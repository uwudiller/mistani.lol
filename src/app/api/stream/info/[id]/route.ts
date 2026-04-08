import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const ANIWATCH_API = process.env.ANIWATCH_API_URL || 'https://aniwatch-api-v1-0.onrender.com'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const [infoResponse, episodesResponse] = await Promise.all([
      fetch(`${ANIWATCH_API}/api/related/${encodeURIComponent(id)}`),
      fetch(`${ANIWATCH_API}/api/episode/${encodeURIComponent(id)}`)
    ])

    if (!infoResponse.ok && !episodesResponse.ok) {
      return NextResponse.json({ error: 'Anime not found' }, { status: 404 })
    }

    let info = null
    let episodes: any[] = []

    if (infoResponse.ok) {
      const infoData = await infoResponse.json()
      const infoArray = infoData.infoX || []
      info = infoArray[0] || null
    }

    if (episodesResponse.ok) {
      const epData = await episodesResponse.json()
      episodes = epData.episodestown || []
    }

    if (!info && episodes.length === 0) {
      return NextResponse.json({ error: 'Anime not found' }, { status: 404 })
    }

    const mappedEpisodes = episodes.map((ep: any) => ({
      episodeId: ep.epId,
      episodeNumber: parseInt(ep.order) || 1,
      title: ep.name || `Episode ${ep.order}`
    }))

    const animeInfo = {
      id: id,
      title: info?.name || id,
      jname: info?.jname || '',
      image: info?.image || '',
      type: info?.format || 'TV',
      desc: info?.desc || '',
      status: info?.statusAnime || '',
      genres: info?.genre || [],
      totalEpisodes: mappedEpisodes.length,
      episodes: mappedEpisodes
    }

    return NextResponse.json(animeInfo)
  } catch (error) {
    console.error('Anime info API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
