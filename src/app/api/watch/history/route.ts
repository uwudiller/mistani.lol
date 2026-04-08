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

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')

    const watchHistory = await prisma.watchHistory.findMany({
      where: {
        user_id: session.user.id
      },
      orderBy: {
        updated_at: 'desc'
      },
      take: limit,
      include: {
        anime: true
      }
    })

    return NextResponse.json(watchHistory)
  } catch (error) {
    console.error('Watch history API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch watch history' },
      { status: 500 }
    )
  }
}
