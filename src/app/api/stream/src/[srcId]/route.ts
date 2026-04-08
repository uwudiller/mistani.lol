import { NextRequest, NextResponse } from 'next/server'
import { getStreamingUrl } from '@/lib/streaming/aniwatch'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ srcId: string }> }
) {
  const { srcId } = await params
  const searchParams = request.nextUrl.searchParams
  const serverType = (searchParams.get('type') as 'sub' | 'dub') || 'sub'

  try {
    const streamData = await getStreamingUrl(srcId)
    
    if (!streamData) {
      return NextResponse.json({ error: 'Stream not found' }, { status: 404 })
    }

    return NextResponse.json(streamData)
  } catch (error) {
    console.error('Stream URL API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
