import { NextRequest, NextResponse } from 'next/server'
import { getHomePage, searchAnime, getAnimeByGenre } from '@/lib/streaming/aniwatch'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const genre = searchParams.get('genre')
  const page = parseInt(searchParams.get('page') || '1')

  try {
    if (query) {
      const results = await searchAnime(query, page)
      return NextResponse.json(results)
    }

    if (genre) {
      const results = await getAnimeByGenre(genre, page)
      return NextResponse.json(results)
    }

    const home = await getHomePage()
    if (!home) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
    }

    return NextResponse.json({
      slides: home.slides,
      trending: home.trend,
      topAiring: home.topAiring,
      topMovie: home.topMovie,
      topUpcoming: home.topUpcoming
    })
  } catch (error) {
    console.error('Browse API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
