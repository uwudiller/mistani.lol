'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, Play, Star, ChevronRight, 
  Loader2, Flame, Clock, TrendingUp, Calendar,
  LayoutGrid, List, ArrowLeft, SlidersHorizontal, Crown
} from 'lucide-react'

const GENRES = [
  'action', 'adventure', 'cars', 'comedy', 'crime', 'dementia', 
  'demons', 'drama', 'dub', 'ecchi', 'family', 'fantasy', 'game',
  'gourmet', 'harem', 'hentai', 'historical', 'horror', 'josei',
  'kids', 'magic', 'martial-arts', 'mecha', 'military', 'music',
  'mystery', 'parody', 'police', 'psychological', 'romance', 'samurai',
  'school', 'sci-fi', 'seinen', 'shoujo', 'shoujo-ai', 'shounen',
  'shounen-ai', 'slice-of-life', 'smut', 'space', 'sports', 'super-power',
  'supernatural', 'suspense', 'thriller', 'vampire', 'yaoi', 'yuri', 'zombies'
]

const GENRE_DISPLAY: Record<string, string> = {
  'action': 'Action', 'adventure': 'Adventure', 'comedy': 'Comedy',
  'drama': 'Drama', 'fantasy': 'Fantasy', 'horror': 'Horror',
  'mystery': 'Mystery', 'romance': 'Romance', 'sci-fi': 'Sci-Fi',
  'slice-of-life': 'Slice of Life', 'sports': 'Sports', 
  'supernatural': 'Supernatural', 'thriller': 'Thriller'
}

interface AnimeItem {
  id: string
  title?: string
  name?: string
  jname?: string
  image: string
  imgAni?: string
  imageAnime?: string
  animeId?: string
  iD?: string
  sub?: number | string
  dub?: number | string
  dubani?: number | string
  format?: string
  ranking?: string
}

export default function BrowseContent() {
  const session = useSession()
  const router = useRouter()
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [hoveredAnime, setHoveredAnime] = useState<string | null>(null)
  
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [slides, setSlides] = useState<AnimeItem[]>([])
  const [trending, setTrending] = useState<AnimeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/stream/home')
      
      if (!response.ok) {
        throw new Error('Failed to fetch anime')
      }
      
      const data = await response.json()
      
      setSlides(data.slides || [])
      setTrending(data.trend || [])
    } catch (err) {
      console.error('Error fetching anime:', err)
      setError('Failed to load anime. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session.status === 'authenticated') {
      fetchHomeData()
    }
  }, [session.status, fetchHomeData])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleGenreSelect = async (genre: string | null) => {
    setSelectedGenre(genre)
    
    if (!genre) {
      fetchHomeData()
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/stream/browse?genre=${genre}`)
      if (response.ok) {
        const data = await response.json()
        setSlides(data.anime || [])
        setTrending([])
      }
    } catch (err) {
      console.error('Error fetching genre:', err)
    } finally {
      setLoading(false)
    }
  }

  if (session.status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-white text-lg">Loading anime...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-colors group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </Link>
              <h1 className="text-xl font-bold text-white hidden sm:block">Browse Anime</h1>
            </div>
            
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </form>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  showFilters ? 'bg-amber-500 text-black' : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Genres</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showFilters && (
          <div className="mb-6 animate-slideDown">
            <h3 className="text-lg font-semibold text-white mb-4">Browse by Genre</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(GENRE_DISPLAY).map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => handleGenreSelect(selectedGenre === key ? null : key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedGenre === key
                      ? 'bg-amber-500 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedGenre ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {GENRE_DISPLAY[selectedGenre] || selectedGenre} Anime
            </h2>
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => handleGenreSelect(selectedGenre)}
                  className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-2 rounded-lg font-semibold"
                >
                  Try Again
                </button>
              </div>
            ) : slides.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No anime found</h3>
                <p className="text-gray-400">Try a different genre</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {slides.map((anime) => (
                  <Link
                    key={anime.id}
                    href={`/anime/${anime.id}`}
                    className="group"
                    onMouseEnter={() => setHoveredAnime(anime.id)}
                    onMouseLeave={() => setHoveredAnime(null)}
                  >
                    <div className="relative aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={anime.image || anime.imgAni || '/placeholder.jpg'}
                        alt={anime.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            {anime.sub && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">SUB</span>
                            )}
                            {anime.dub && (
                              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">DUB</span>
                            )}
                          </div>
                          <p className="text-white text-sm font-medium line-clamp-2">
                            {anime.title}
                          </p>
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="bg-amber-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-5 h-5 text-black" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      {anime.ranking && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded">
                          #{anime.ranking}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 px-1">
                      <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-amber-500 transition-colors">
                        {anime.title}
                      </h3>
                      {anime.format && (
                        <p className="text-gray-500 text-xs">{anime.format}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {slides.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Featured Anime</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {slides.slice(0, 12).map((anime) => (
                    <Link
                      key={anime.animeId || anime.id}
                      href={`/anime/${anime.animeId || anime.id}`}
                      className="group animate-slideUp"
                      onMouseEnter={() => setHoveredAnime(anime.animeId || anime.id)}
                      onMouseLeave={() => setHoveredAnime(null)}
                    >
                      <div className="relative aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={anime.imageAnime || anime.image || anime.imgAni || '/placeholder.jpg'}
                          alt={anime.name || anime.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white text-sm font-medium line-clamp-2">
                              {anime.name || anime.title}
                            </p>
                            {anime.format && (
                              <p className="text-amber-400 text-xs mt-1">{anime.format}</p>
                            )}
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-amber-500 rounded-full p-2">
                            <Play className="w-5 h-5 text-black" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 px-1">
                        <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-amber-500 transition-colors">
                          {anime.name || anime.title}
                        </h3>
                        {anime.format && (
                          <p className="text-gray-500 text-xs">{anime.format}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {trending.length > 0 && (
              <section>
                <div className="flex items-center space-x-2 mb-6">
                  <Flame className="w-6 h-6 text-amber-500" />
                  <h2 className="text-2xl font-bold text-white">Trending Now</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {trending.map((anime) => (
                    <Link
                      key={anime.iD || anime.id}
                      href={`/anime/${anime.iD || anime.id}`}
                      className="group"
                      onMouseEnter={() => setHoveredAnime(anime.iD || anime.id)}
                      onMouseLeave={() => setHoveredAnime(null)}
                    >
                      <div className="relative aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={anime.imgAni || anime.image || '/placeholder.jpg'}
                          alt={anime.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        {anime.ranking && (
                          <div className="absolute top-2 left-2 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded">
                            #{anime.ranking}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white text-sm font-medium line-clamp-2">
                              {anime.name}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">{anime.jname}</p>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-amber-500 rounded-full p-2">
                            <Play className="w-5 h-5 text-black" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 px-1">
                        <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-amber-500 transition-colors">
                          {anime.name}
                        </h3>
                        <p className="text-gray-500 text-xs">{anime.jname}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
