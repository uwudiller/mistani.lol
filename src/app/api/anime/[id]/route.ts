import { NextRequest, NextResponse } from 'next/server'
import { getAnimeById } from '@/lib/anime'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const malId = parseInt(id)

  if (isNaN(malId)) {
    return NextResponse.json(
      { error: 'Invalid anime ID' },
      { status: 400 }
    )
  }

  try {
    const anime = await getAnimeById(malId)
    
    if (!anime) {
      return NextResponse.json(
        { error: 'Anime not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(anime)
  } catch (error) {
    console.error('Anime details API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch anime details' },
      { status: 500 }
    )
  }
}
