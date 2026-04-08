export interface Anime {
  id: string
  mal_id?: number
  title: string
  title_jp?: string
  synopsis?: string
  image_url?: string
  genres: string[]
  rating?: number
  year?: number
  status?: string
  episodes?: number
}

export interface JikanAnime {
  mal_id: number
  title: string
  title_japanese?: string
  synopsis?: string
  images: {
    jpg: {
      image_url?: string
    }
  }
  genres: Array<{
    name: string
  }>
  score?: number
  year?: number
  status?: string
  episodes?: number
}

export interface JikanResponse {
  data: JikanAnime[]
  pagination: {
    has_next_page: boolean
    current_page: number
    last_visible_page: number
  }
}

const JIKAN_BASE_URL = process.env.JIKAN_API_BASE_URL || 'https://api.jikan.moe/v4'

export async function searchAnime(query: string, page = 1): Promise<{ anime: Anime[], hasMore: boolean }> {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`)
    
    if (!response.ok) {
      throw new Error('Failed to search anime')
    }
    
    const data: JikanResponse = await response.json()
    
    const anime = data.data.map(mapJikanToAnime)
    
    return {
      anime,
      hasMore: data.pagination.has_next_page
    }
  } catch (error) {
    console.error('Error searching anime:', error)
    return { anime: [], hasMore: false }
  }
}

export async function getTrendingAnime(page = 1): Promise<{ anime: Anime[], hasMore: boolean }> {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/anime?order_by=popularity&sort=asc&page=${page}&limit=20`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending anime')
    }
    
    const data: JikanResponse = await response.json()
    
    const anime = data.data.map(mapJikanToAnime)
    
    return {
      anime,
      hasMore: data.pagination.has_next_page
    }
  } catch (error) {
    console.error('Error fetching trending anime:', error)
    return { anime: [], hasMore: false }
  }
}

export async function getAnimeById(malId: number, retries = 3): Promise<Anime | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${JIKAN_BASE_URL}/anime/${malId}/full`, {
        next: { revalidate: 3600 }
      })
      
      if (response.ok) {
        const data: JikanAnime = await response.json()
        return mapJikanToAnime(data)
      }
      
      if (response.status === 429) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)))
        continue
      }
      
      throw new Error('Failed to fetch anime details')
    } catch (error) {
      if (i === retries - 1) {
        console.error('Error fetching anime details:', error)
        return null
      }
      await new Promise(r => setTimeout(r, 1000))
    }
  }
  return null
}

function mapJikanToAnime(jikanAnime: JikanAnime): Anime {
  return {
    id: jikanAnime.mal_id.toString(),
    mal_id: jikanAnime.mal_id,
    title: jikanAnime.title,
    title_jp: jikanAnime.title_japanese,
    synopsis: jikanAnime.synopsis,
    image_url: jikanAnime.images.jpg.image_url,
    genres: jikanAnime.genres.map(genre => genre.name),
    rating: jikanAnime.score,
    year: jikanAnime.year,
    status: jikanAnime.status,
    episodes: jikanAnime.episodes
  }
}
