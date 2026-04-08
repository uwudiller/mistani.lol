import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db'
import { KoFiService, KoFiWebhookPayload } from '@/lib/kofi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('x-kofi-signature') || ''
    
    let payload: KoFiWebhookPayload
    try {
      payload = JSON.parse(body)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const kofiService = KoFiService.getInstance()
    if (!kofiService.verifyWebhook(payload, signature)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: payload.email }
    })

    if (!user) {
      console.log(`Ko-fi donation from non-user: ${payload.email}`)
      return NextResponse.json({ message: 'Donation recorded (non-user)' })
    }

    // Process the donation
    const amount = kofiService.formatAmount(payload.amount)
    const isPremium = kofiService.isPremiumTier(amount)
    
    if (!isPremium) {
      console.log(`Small donation from ${user.email}: $${amount}`)
      return NextResponse.json({ message: 'Donation recorded (non-premium)' })
    }

    // Calculate premium expiry
    const premiumMonths = Math.floor(amount / 5) // $5 = 1 month
    const premiumExpiry = new Date()
    premiumExpiry.setMonth(premiumExpiry.getMonth() + premiumMonths)

    // Update user premium status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        is_premium: true,
        premium_expires: premiumExpiry,
        kofi_transaction_id: payload.kofi_transaction_id,
        premium_amount: amount,
        updated_at: new Date()
      }
    })

    // Record the transaction
    await prisma.premiumTransaction.create({
      data: {
        user_id: user.id,
        kofi_transaction_id: payload.kofi_transaction_id,
        amount: amount,
        currency: payload.currency,
        from_name: payload.from_name,
        email: payload.email,
        message: payload.message,
        timestamp: new Date(payload.timestamp),
        is_subscription: payload.is_subscription,
        is_first_payment: payload.is_first_payment,
        premium_months: premiumMonths
      }
    })

    console.log(`Premium activated for ${user.email}: $${amount} (${premiumMonths} months)`)

    return NextResponse.json({ 
      message: 'Premium activated successfully',
      premium_months: premiumMonths,
      expires_at: premiumExpiry
    })

  } catch (error) {
    console.error('Ko-fi webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
