import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'

const PREMIUM_PRICES: Record<string, { months: number; name: string }> = {
  'price_premium_1month': { months: 1, name: '1 Month Premium' },
  'price_premium_2month': { months: 2, name: '2 Months Premium' },
  'price_premium_5month': { months: 5, name: '5 Months Premium' },
  'price_premium_12month': { months: 12, name: '1 Year Premium' },
}

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId } = await request.json()

    if (!PREMIUM_PRICES[priceId]) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/premium?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/premium?canceled=true`,
      metadata: {
        userId: session.user.id,
        months: PREMIUM_PRICES[priceId].months.toString(),
      },
      customer_email: session.user.email!,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
