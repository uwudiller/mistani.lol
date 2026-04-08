const ANIWATCH_API = process.env.ANIWATCH_API_URL || 'https://aniwatch-api-v1-0.onrender.com'

export interface AnimeSearchResult {
  id: string
  title: string
  jname: string
  image: string
  sub?: number | string
  dub?: number | string
  totalEpisodes?: number
  format?: string
}

export interface AnimeHome {
  slides: {
    name: string
    jname: string
    imageAnime: string
    animeId: string
    format: string
    duration: string
    release: string
    quality: string
  }[]
  trend: {
    name: string
    ranking: string
    imgAni: string
    iD: string
    jname: string
  }[]
  topUpcoming: any[]
  topAiring: any[]
  topMovie: any[]
  topSpecial: any[]
}

export interface AnimeInfo {
  id: string
  title: string
  jname: string
  image: string
  type: string
  desc: string
  releaseDate: string
  status: string
  genres: string[]
  totalEpisodes: number
  episodes: {
    episodeId: string
    episodeNumber: number
    title?: string
  }[]
}

export interface EpisodeServer {
  server: string
  id: string
  srcId: string
}

export interface StreamingSource {
  server: string
  url: string
}

export async function getHomePage(): Promise<AnimeHome | null> {
  try {
    const response = await fetch(`${ANIWATCH_API}/api/parse`, {
      next: { revalidate: 300 }
    })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export async function searchAnime(query: string, page = 1): Promise<{ anime: AnimeSearchResult[], hasMore: boolean }> {
  try {
    const response = await fetch(`${ANIWATCH_API}/api/search/${encodeURIComponent(query)}/${page}`)
    if (!response.ok) return { anime: [], hasMore: false }
    
    const data = await response.json()
    return {
      anime: data.searchYour || [],
      hasMore: data.nextpageavailable || false
    }
  } catch {
    return { anime: [], hasMore: false }
  }
}

export async function getAnimeInfo(id: string): Promise<AnimeInfo | null> {
  try {
    const response = await fetch(`${ANIWATCH_API}/api/related/${id}`)
    if (!response.ok) return null
    
    const data = await response.json()
    const info = data.infoX?.[0]
    const epData = data.infoX?.[1]
    
    if (!info) return null
    
    const episodesResponse = await fetch(`${ANIWATCH_API}/api/episode/${id}`)
    const episodesData = await episodesResponse.json()
    
    return {
      id: info.id,
      title: info.name,
      jname: info.jname,
      image: info.image,
      type: info.format,
      desc: info.desc,
      releaseDate: epData?.aired || '',
      status: epData?.statusAnime,
      genres: info.genre || [],
      totalEpisodes: parseInt(info.totalep) || 0,
      episodes: episodesData.episodetown?.map((ep: any) => ({
        episodeId: ep.epId,
        episodeNumber: parseInt(ep.order),
        title: ep.name
      })) || []
    }
  } catch {
    return null
  }
}

export async function getAnimeEpisodes(id: string): Promise<{ episodeId: string; episodeNumber: number; title?: string }[]> {
  try {
    const response = await fetch(`${ANIWATCH_API}/api/episode/${id}`)
    if (!response.ok) return []
    
    const data = await response.json()
    return data.episodetown?.map((ep: any) => ({
      episodeId: ep.epId,
      episodeNumber: parseInt(ep.order),
      title: ep.name
    })) || []
  } catch {
    return []
  }
}

export async function getEpisodeServers(episodeId: string, type: 'sub' | 'dub' = 'sub'): Promise<EpisodeServer[]> {
  try {
    const response = await fetch(`${ANIWATCH_API}/api/server/${encodeURIComponent(episodeId)}`)
    if (!response.ok) return []
    
    const data = await response.json()
    return data[type] || []
  } catch {
    return []
  }
}

export async function getStreamingUrl(srcId: string): Promise<StreamingSource | null> {
  try {
    const response = await fetch(`${ANIWATCH_API}/api/src-server/${srcId}`)
    if (!response.ok) return null
    
    const data = await response.json()
    const sources = data.serverSrc?.[0]
    
    if (!sources) return null
    
    const streamUrl = sources.rest?.[0]?.file || sources.serverlinkAni
    
    return {
      server: sources.text || 'Unknown',
      url: streamUrl
    }
  } catch {
    return null
  }
}

export async function getAnimeByGenre(genre: string, page = 1): Promise<{ anime: AnimeSearchResult[], hasMore: boolean }> {
  try {
    const response = await fetch(`${ANIWATCH_API}/api/genre/${encodeURIComponent(genre)}/${page}`)
    if (!response.ok) return { anime: [], hasMore: false }
    
    const data = await response.json()
    return {
      anime: data.genreX?.map((item: any) => ({
        id: item.idX,
        title: item.name,
        jname: item.jname,
        image: item.imageX,
        sub: item.sub,
        dub: item.dubXanime,
        totalEpisodes: parseInt(item.totalepX)
      })) || [],
      hasMore: data.nextpageavai || false
    }
  } catch {
    return { anime: [], hasMore: false }
  }
}

export async function getTrendingAnime(): Promise<AnimeSearchResult[]> {
  try {
    const home = await getHomePage()
    if (!home) return []
    
    return home.trend.map((anime) => ({
      id: anime.iD,
      title: anime.name,
      jname: anime.jname,
      image: anime.imgAni
    }))
  } catch {
    return []
  }
}
