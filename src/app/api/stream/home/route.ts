import { NextRequest, NextResponse } from 'next/server'
import { getHomePage, getTrendingAnime } from '@/lib/streaming/aniwatch'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'home'

  try {
    if (type === 'trending') {
      const anime = await getTrendingAnime()
      return NextResponse.json({ anime })
    }

    const home = await getHomePage()
    if (!home) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
    }

    return NextResponse.json(home)
  } catch (error) {
    console.error('Home API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
