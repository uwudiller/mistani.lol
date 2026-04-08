import { NextRequest, NextResponse } from 'next/server'
import { getTrendingAnime } from '@/lib/anime'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')

  try {
    const result = await getTrendingAnime(page)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Trending API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending anime' },
      { status: 500 }
    )
  }
}
