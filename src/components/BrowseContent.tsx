'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, Play, Loader2, Flame, Clock, 
  ArrowLeft, SlidersHorizontal, Grid, List, ChevronDown, X
} from 'lucide-react'

const GENRES = [
  { id: 'action', name: 'Action' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'cars', name: 'Cars' },
  { id: 'comedy', name: 'Comedy' },
  { id: 'crime', name: 'Crime' },
  { id: 'demons', name: 'Demons' },
  { id: 'drama', name: 'Drama' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'hentai', name: 'Hentai' },
  { id: 'historical', name: 'Historical' },
  { id: 'horror', name: 'Horror' },
  { id: 'josei', name: 'Josei' },
  { id: 'kids', name: 'Kids' },
  { id: 'magic', name: 'Magic' },
  { id: 'mecha', name: 'Mecha' },
  { id: 'military', name: 'Military' },
  { id: 'mystery', name: 'Mystery' },
  { id: 'parody', name: 'Parody' },
  { id: 'police', name: 'Police' },
  { id: 'psychological', name: 'Psychological' },
  { id: 'romance', name: 'Romance' },
  { id: 'samurai', name: 'Samurai' },
  { id: 'school', name: 'School' },
  { id: 'sci-fi', name: 'Sci-Fi' },
  { id: 'seinen', name: 'Seinen' },
  { id: 'shoujo', name: 'Shoujo' },
  { id: 'shounen', name: 'Shounen' },
  { id: 'slice-of-life', name: 'Slice of Life' },
  { id: 'sports', name: 'Sports' },
  { id: 'super-power', name: 'Super Power' },
  { id: 'supernatural', name: 'Supernatural' },
  { id: 'thriller', name: 'Thriller' },
  { id: 'vampire', name: 'Vampire' },
]

const CATEGORIES = [
  { id: 'tv', name: 'TV Series', icon: Play },
  { id: 'movie', name: 'Movies', icon: Flame },
  { id: 'ova', name: 'OVA', icon: Clock },
]

interface AnimeItem {
  id: string
  idani?: string
  idX?: string
  title?: string
  name?: string
  jname?: string
  image: string
  img?: string
  imageAnime?: string
  sub?: number | string
  dub?: number | string
  dubani?: number | string
  format?: string
  duration?: string
  pg?: boolean
}

export default function BrowseContent() {
  const session = useSession()
  const router = useRouter()
  
  const [animeList, setAnimeList] = useState<AnimeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('tv')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [showGenreDropdown, setShowGenreDropdown] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (session.status === 'authenticated') {
      fetchAnime()
    }
  }, [session.status, selectedCategory, selectedGenre, page])

  const fetchAnime = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let url = `/api/stream/browse?page=${page}`
      if (selectedGenre) {
        url = `/api/stream/browse?genre=${selectedGenre}&page=${page}`
      } else if (selectedCategory) {
        url = `/api/stream/browse?q=${selectedCategory}&page=${page}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch')
      }
      
      const data = await response.json()
      setAnimeList(data.anime || data.mixAni || data.genreX || [])
      setHasMore(data.hasMore || data.nextpageavai || false)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to load anime')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const clearFilters = () => {
    setSelectedGenre(null)
    setSelectedCategory('tv')
    setPage(1)
  }

  if (session.status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            
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

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-amber-500 text-black' : 'bg-gray-700 text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-amber-500 text-black' : 'bg-gray-700 text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-white">
            {selectedGenre 
              ? GENRES.find(g => g.id === selectedGenre)?.name + ' Anime'
              : CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Browse All'}
          </h1>
          
          <div className="flex items-center space-x-2">
            {(selectedGenre || selectedCategory !== 'tv') && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-gray-400 hover:text-white text-sm"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id)
                setSelectedGenre(null)
                setPage(1)
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === cat.id && !selectedGenre
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              <span>{cat.name}</span>
            </button>
          ))}
          
          <div className="relative">
            <button
              onClick={() => setShowGenreDropdown(!showGenreDropdown)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all ${
                selectedGenre
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{selectedGenre ? GENRES.find(g => g.id === selectedGenre)?.name : 'Genres'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showGenreDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded-xl p-4 shadow-xl z-50 w-80 max-h-80 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {GENRES.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => {
                        setSelectedGenre(genre.id === selectedGenre ? null : genre.id)
                        setSelectedCategory('')
                        setPage(1)
                        setShowGenreDropdown(false)
                      }}
                      className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                        selectedGenre === genre.id
                          ? 'bg-amber-500 text-black'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchAnime}
              className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-2 rounded-lg font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : animeList.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No anime found</h3>
            <p className="text-gray-400">Try different filters</p>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
              : 'space-y-3'
            }>
              {animeList.map((anime) => (
                <Link
                  key={anime.id || anime.idani || anime.idX}
                  href={`/anime/${anime.id || anime.idani || anime.idX}`}
                  className={`group ${viewMode === 'list' ? 'flex items-center space-x-4 bg-gray-800 rounded-lg p-3 hover:bg-gray-700' : ''}`}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-16 h-24' : 'aspect-[3/4]'} bg-gray-700 rounded-lg overflow-hidden flex-shrink-0`}>
                    <img
                      src={anime.image || anime.img || anime.imageAnime || '/placeholder.jpg'}
                      alt={anime.title || anime.name || 'Anime'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    {anime.pg && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                        18+
                      </span>
                    )}
                    {anime.sub && (
                      <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                        SUB
                      </span>
                    )}
                    {anime.dub || anime.dubani ? (
                      <span className="absolute bottom-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                        DUB
                      </span>
                    ) : null}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-amber-500 rounded-full p-2">
                        <Play className="w-5 h-5 text-black fill-current" />
                      </div>
                    </div>
                  </div>
                  <div className={viewMode === 'list' ? 'flex-1 min-w-0' : 'mt-2 px-1'}>
                    <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-amber-500 transition-colors">
                      {anime.title || anime.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                      {anime.format && <span>{anime.format}</span>}
                      {anime.duration && <span>{anime.duration}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {showGenreDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowGenreDropdown(false)}
        />
      )}
    </div>
  )
}
