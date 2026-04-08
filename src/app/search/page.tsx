'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Play, Star, Calendar, ArrowLeft } from 'lucide-react'
import { Anime } from '@/lib/anime'

export default function SearchPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [searchResults, setSearchResults] = useState<Anime[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (searchQuery && status === 'authenticated') {
      performSearch(searchQuery, 1)
    }
  }, [searchQuery, status])

  const performSearch = async (query: string, pageNum: number) => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/anime/search?q=${encodeURIComponent(query)}&page=${pageNum}`)
      if (response.ok) {
        const data = await response.json()
        if (pageNum === 1) {
          setSearchResults(data.anime)
        } else {
          setSearchResults(prev => [...prev, ...data.anime])
        }
        setHasMore(data.hasMore)
        setPage(pageNum)
      }
    } catch (error) {
      console.error('Search error:', error)
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

  const loadMore = () => {
    if (hasMore && !loading) {
      performSearch(searchQuery, page + 1)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="inline-flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <h1 className="text-2xl font-bold text-white">Search</h1>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-xl text-gray-300">
              Search results for: <span className="text-amber-500 font-semibold">"{searchQuery}"</span>
            </h2>
            {searchResults.length > 0 && (
              <p className="text-gray-400 mt-1">Found {searchResults.length} results</p>
            )}
          </div>
        )}

        {loading && searchResults.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="text-white text-xl">Searching...</div>
          </div>
        ) : searchResults.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No anime found for "{searchQuery}"</div>
            <p className="text-gray-500 mt-2">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {searchResults.map((anime) => (
              <Link
                key={anime.id}
                href={`/anime/${anime.id}`}
                className="anime-card bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={anime.image_url || '/placeholder.jpg'}
                    alt={anime.title}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-sm line-clamp-2">{anime.title}</h3>
                      {anime.rating && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-4 h-4 text-amber-500 fill-current" />
                          <span className="text-amber-500 text-xs">{anime.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {anime.episodes && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {anime.episodes} eps
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium text-sm line-clamp-1 mb-2">{anime.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    {anime.year && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{anime.year}</span>
                      </div>
                    )}
                    {anime.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-amber-500" />
                        <span>{anime.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {anime.genres.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {anime.genres.slice(0, 2).map((genre) => (
                        <span
                          key={genre}
                          className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                        >
                          {genre}
                        </span>
                      ))}
                      {anime.genres.length > 2 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          +{anime.genres.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
