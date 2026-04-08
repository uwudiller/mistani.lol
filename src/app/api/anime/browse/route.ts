import { NextRequest, NextResponse } from 'next/server'
import { getAnime, getAnimeByGenre, getSeasonalAnime, getTopAnime, getUpcomingAnime, GetAnimeOptions } from '@/lib/anime'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  const page = parseInt(searchParams.get('page') || '1')
  const type = searchParams.get('type') || 'filter'
  const genre = searchParams.get('genre')
  const season = searchParams.get('season')
  const yearStr = searchParams.get('year')
  const year = yearStr ? parseInt(yearStr) : undefined
  const orderBy = searchParams.get('order_by') as any
  const sort = (searchParams.get('sort') as 'asc' | 'desc') || 'asc'
  const status = searchParams.get('status') as any
  const ratingParam = searchParams.get('rating')
  const rating = ratingParam || undefined
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    let result: { anime: any[], hasMore: boolean, totalResults?: number }

    switch (type) {
      case 'genre':
        if (!genre) {
          return NextResponse.json({ error: 'Genre is required' }, { status: 400 })
        }
        result = await getAnimeByGenre(genre, page)
        break
      
      case 'seasonal':
        if (!season || !year) {
          return NextResponse.json({ error: 'Season and year are required' }, { status: 400 })
        }
        result = await getSeasonalAnime(season, year, page)
        break
      
      case 'top':
        result = await getTopAnime(page)
        break
      
      case 'upcoming':
        result = await getUpcomingAnime(page)
        break
      
      default: {
        const options: GetAnimeOptions = {
          page,
          limit,
          orderBy: orderBy || 'popularity',
          sort,
          status,
          rating,
          year,
        }
        if (season && year) options.season = `${season} ${year}`
        if (genre) options.genre = genre
        result = await getAnime(options)
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Anime filter API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch anime' },
      { status: 500 }
    )
  }
}
