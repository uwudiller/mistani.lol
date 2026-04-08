import { NextRequest, NextResponse } from 'next/server'
import { getAnimeInfo } from '@/lib/streaming/aniwatch'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const info = await getAnimeInfo(id)
    
    if (!info) {
      return NextResponse.json({ error: 'Anime not found' }, { status: 404 })
    }

    return NextResponse.json(info)
  } catch (error) {
    console.error('Anime info API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
