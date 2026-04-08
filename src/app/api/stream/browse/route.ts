import { NextRequest, NextResponse } from 'next/server'
import { getHomePage, searchAnime, getAnimeByGenre } from '@/lib/streaming/aniwatch'

const ANIWATCH_API = process.env.ANIWATCH_API_URL || 'https://aniwatch-api-v1-0.onrender.com'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const genre = searchParams.get('genre')
  const page = parseInt(searchParams.get('page') || '1')

  try {
    if (query) {
      const response = await fetch(`${ANIWATCH_API}/api/search/${encodeURIComponent(query)}/${page}`)
      if (!response.ok) return NextResponse.json({ anime: [], hasMore: false })
      const data = await response.json()
      return NextResponse.json({
        anime: data.searchYour || [],
        hasMore: data.nextpageavailable || false
      })
    }

    if (genre) {
      const response = await fetch(`${ANIWATCH_API}/api/genre/${encodeURIComponent(genre)}/${page}`)
      if (!response.ok) return NextResponse.json({ anime: [], hasMore: false })
      const data = await response.json()
      return NextResponse.json({
        anime: data.genreX || [],
        hasMore: data.nextpageavai || false
      })
    }

    const response = await fetch(`${ANIWATCH_API}/api/mix/tv/${page}`)
    if (!response.ok) return NextResponse.json({ anime: [], hasMore: false })
    const data = await response.json()
    return NextResponse.json({
      anime: data.mixAni || [],
      hasMore: data.nextpageavai || false
    })
  } catch (error) {
    console.error('Browse API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
