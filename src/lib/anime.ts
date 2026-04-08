export interface Anime {
  id: string
  mal_id?: number
  title: string
  title_jp?: string
  title_english?: string
  synopsis?: string
  image_url?: string
  large_image_url?: string
  genres: string[]
  score?: number
  year?: number
  status?: string
  episodes?: number
  duration?: string
  studios?: string[]
  producers?: string[]
  source?: string
  content_rating?: string
  streaming?: Array<{
    name: string
    url: string
  }>
}

export interface JikanAnime {
  mal_id: number
  title: string
  title_english?: string
  title_japanese?: string
  synopsis?: string
  images: {
    jpg: {
      image_url?: string
      large_image_url?: string
    }
  }
  genres: Array<{
    mal_id: number
    name: string
  }>
  score?: number
  year?: number
  status?: string
  episodes?: number
  rating?: string
  duration?: string
  studios: Array<{
    name: string
  }>
  producers: Array<{
    name: string
  }>
  source?: string
  airing?: boolean
  broadcast?: {
    day?: string
    time?: string
    string?: string
  }
  streaming?: Array<{
    name: string
    url: string
  }>
}

export interface JikanSingleResponse {
  data: JikanAnime
  relations?: Array<{
    relation: string
    entry: Array<{
      mal_id: number
      name: string
      type: string
    }>
  }>
  recommendations?: Array<{
    mal_id: number
    entry: Array<{
      mal_id: number
      title: string
      image_url: string
    }>
  }>
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
    const response = await fetch(`${JIKAN_BASE_URL}/anime?order_by=popularity&sort=asc&page=${page}&limit=20`, {
      next: { revalidate: 300 }
    })
    
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

export type AnimeOrder = 'popularity' | 'score' | 'rank' | 'start_date' | 'end_date' | 'episodes' | 'id'

export interface GetAnimeOptions {
  page?: number
  limit?: number
  orderBy?: AnimeOrder
  sort?: 'desc' | 'asc'
  genre?: string | number
  genreExclude?: string | number
  status?: 'airing' | 'complete' | 'upcoming' | 'pb' | 'russ'
  rating?: string
  year?: number
  season?: string
  filter?: string
}

export async function getAnime(options: GetAnimeOptions = {}): Promise<{ anime: Anime[], hasMore: boolean, totalResults?: number }> {
  const {
    page = 1,
    limit = 20,
    orderBy = 'popularity',
    sort = 'asc',
    genre,
    genreExclude,
    status,
    rating,
    year,
    season
  } = options

  const params = new URLSearchParams()
  params.set('page', page.toString())
  params.set('limit', limit.toString())
  params.set('order_by', orderBy)
  params.set('sort', sort)
  
  if (genre) params.set('genres', genre.toString())
  if (genreExclude) params.set('genres_exclude', genreExclude.toString())
  if (status) params.set('status', status)
  if (rating) params.set('rating', rating)
  if (year) params.set('start_date', `${year}-01-01`)
  if (season) params.set('filter', season)

  try {
    const response = await fetch(`${JIKAN_BASE_URL}/anime?${params.toString()}`, {
      next: { revalidate: 300 }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch anime')
    }
    
    const data: JikanResponse = await response.json()
    
    const anime = data.data.map(mapJikanToAnime)
    
    return {
      anime,
      hasMore: data.pagination.has_next_page,
      totalResults: data.pagination.last_visible_page * limit
    }
  } catch (error) {
    console.error('Error fetching anime:', error)
    return { anime: [], hasMore: false }
  }
}

export async function getAnimeByGenre(genre: string | number, page = 1): Promise<{ anime: Anime[], hasMore: boolean }> {
  return getAnime({ genre, page, orderBy: 'score', sort: 'desc' })
}

export async function getSeasonalAnime(season: string, year: number, page = 1): Promise<{ anime: Anime[], hasMore: boolean }> {
  return getAnime({ season: `${season} ${year}`, page, orderBy: 'popularity', sort: 'asc' })
}

export async function getTopAnime(page = 1): Promise<{ anime: Anime[], hasMore: boolean }> {
  return getAnime({ page, orderBy: 'score', sort: 'desc' })
}

export async function getUpcomingAnime(page = 1): Promise<{ anime: Anime[], hasMore: boolean }> {
  return getAnime({ page, orderBy: 'start_date', sort: 'asc', status: 'upcoming' })
}

export async function getAnimeById(malId: number, retries = 3): Promise<{ anime: Anime | null, relations?: any[], recommendations?: any[] }> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${JIKAN_BASE_URL}/anime/${malId}/full`, {
        next: { revalidate: 3600 }
      })
      
      if (response.ok) {
        const data: JikanSingleResponse = await response.json()
        return {
          anime: mapJikanToAnime(data.data),
          relations: data.relations,
          recommendations: data.recommendations
        }
      }
      
      if (response.status === 429) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)))
        continue
      }
      
      throw new Error('Failed to fetch anime details')
    } catch (error) {
      if (i === retries - 1) {
        console.error('Error fetching anime details:', error)
        return { anime: null }
      }
      await new Promise(r => setTimeout(r, 1000))
    }
  }
  return { anime: null }
}

function mapJikanToAnime(jikanAnime: JikanAnime): Anime {
  return {
    id: jikanAnime.mal_id.toString(),
    mal_id: jikanAnime.mal_id,
    title: jikanAnime.title || jikanAnime.title_english || 'Unknown Title',
    title_jp: jikanAnime.title_japanese,
    synopsis: jikanAnime.synopsis,
    image_url: jikanAnime.images.jpg.image_url,
    large_image_url: jikanAnime.images.jpg.large_image_url,
    genres: jikanAnime.genres.map(genre => genre.name),
    score: jikanAnime.score,
    year: jikanAnime.year,
    status: jikanAnime.status,
    episodes: jikanAnime.episodes,
    duration: jikanAnime.duration,
    studios: jikanAnime.studios?.map(s => s.name),
    producers: jikanAnime.producers?.map(p => p.name),
    source: jikanAnime.source,
    content_rating: jikanAnime.rating,
    streaming: jikanAnime.streaming
  }
}
