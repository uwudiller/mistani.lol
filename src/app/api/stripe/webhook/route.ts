import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

let stripeClient: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not configured')
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return stripeClient
}

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const stripe = getStripe()
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    const months = parseInt(session.metadata?.months || '1')

    if (userId) {
      const expiresDate = new Date()
      expiresDate.setMonth(expiresDate.getMonth() + months)

      await prisma.user.update({
        where: { id: userId },
        data: {
          is_premium: true,
          premium_expires: expiresDate,
        },
      })

      await prisma.premiumTransaction.create({
        data: {
          user_id: userId,
          kofi_transaction_id: session.id,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency || 'usd',
          from_name: session.customer_details?.name || 'Stripe Customer',
          email: session.customer_details?.email || '',
          message: 'Premium subscription via Stripe',
          timestamp: new Date(),
          is_subscription: false,
          is_first_payment: true,
          premium_months: months,
        },
      })
    }
  }

  return NextResponse.json({ received: true })
}
