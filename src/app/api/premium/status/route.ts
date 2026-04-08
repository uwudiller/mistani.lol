import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        is_premium: true,
        premium_expires: true,
        premium_amount: true,
        kofi_transaction_id: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if premium has expired
    let isCurrentlyPremium = user.is_premium
    if (user.is_premium && user.premium_expires) {
      isCurrentlyPremium = user.premium_expires > new Date()
      
      // Update database if premium has expired
      if (!isCurrentlyPremium) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            is_premium: false,
            updated_at: new Date()
          }
        })
      }
    }

    return NextResponse.json({
      is_premium: isCurrentlyPremium,
      premium_expires: user.premium_expires,
      premium_amount: user.premium_amount,
      days_remaining: user.premium_expires 
        ? Math.max(0, Math.ceil((user.premium_expires.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : 0
    })

  } catch (error) {
    console.error('Premium status API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch premium status' },
      { status: 500 }
    )
  }
}
