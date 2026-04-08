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
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get the most recent watch history entries that are not completed
    const continueWatching = await prisma.watchHistory.findMany({
      where: {
        user_id: session.user.id,
        progress_seconds: {
          lt: prisma.watchHistory.fields.total_seconds
        }
      },
      orderBy: {
        updated_at: 'desc'
      },
      take: limit,
      include: {
        anime: true
      }
    })

    return NextResponse.json(continueWatching)
  } catch (error) {
    console.error('Continue watching API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch continue watching' },
      { status: 500 }
    )
  }
}
