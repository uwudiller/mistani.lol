import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getEpisodeServers, getStreamingUrl } from '@/lib/streaming/aniwatch'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; episode: string }> }
) {
  const { id, episode } = await params
  const searchParams = request.nextUrl.searchParams
  const serverType = (searchParams.get('type') as 'sub' | 'dub') || 'sub'

  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    let isPremium = false
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      isPremium = user?.is_premium === true && 
        !!user?.premium_expires && 
        new Date(user.premium_expires) > new Date()
    }

    const servers = await getEpisodeServers(episode, serverType)
    
    if (!servers || servers.length === 0) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 })
    }

    const primaryServer = servers[0]
    const streamData = await getStreamingUrl(primaryServer.srcId)

    const embedUrl = streamData?.url || ''
    
    return NextResponse.json({
      episodeId: episode,
      episodeNumber: 1,
      servers: servers.map(s => ({
        name: s.server,
        srcId: s.srcId,
        url: ''
      })),
      currentStream: {
        server: primaryServer.server,
        url: embedUrl
      },
      isPremium,
      speedLimit: isPremium ? 'unlimited' : 'throttled',
      message: isPremium 
        ? 'Premium streaming enabled - Full speed!' 
        : 'Free tier - Streaming speed is limited. Upgrade to Premium for unlimited speed!'
    })
  } catch (error) {
    console.error('Stream API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
