import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getAnimeById } from '@/lib/anime'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { animeId, episode, progressSeconds, totalSeconds } = await request.json()

    if (!animeId || !episode || progressSeconds === undefined || !totalSeconds) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get anime details to store title
    const { anime } = await getAnimeById(parseInt(animeId))
    if (!anime) {
      return NextResponse.json(
        { error: 'Anime not found' },
        { status: 404 }
      )
    }

    // Upsert watch history
    const watchHistory = await prisma.watchHistory.upsert({
      where: {
        user_id_anime_id_episode: {
          user_id: session.user.id,
          anime_id: animeId,
          episode: episode
        }
      },
      update: {
        progress_seconds: progressSeconds,
        total_seconds: totalSeconds,
        updated_at: new Date()
      },
      create: {
        user_id: session.user.id,
        anime_id: animeId,
        anime_title: anime.title,
        episode: episode,
        progress_seconds: progressSeconds,
        total_seconds: totalSeconds
      }
    })

    return NextResponse.json(watchHistory)
  } catch (error) {
    console.error('Watch progress API error:', error)
    return NextResponse.json(
      { error: 'Failed to update watch progress' },
      { status: 500 }
    )
  }
}
