'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Play, Star, Calendar, ArrowLeft } from 'lucide-react'
import { Anime } from '@/lib/anime'

export default function SearchContent() {
  const session = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [searchResults, setSearchResults] = useState<Anime[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [session.status, router])

  useEffect(() => {
    if (searchQuery && session.status === 'authenticated') {
      performSearch(searchQuery, 1)
    }
  }, [searchQuery, session.status])

  const performSearch = async (query: string, pageNum: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/anime/search?q=${encodeURIComponent(query)}&page=${pageNum}&limit=20`)
      if (response.ok) {
        const data = await response.json()
        if (pageNum === 1) {
          setSearchResults(data.anime)
        } else {
          setSearchResults(prev => [...prev, ...data.anime])
        }
        setHasMore(data.anime.length === 20)
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
      performSearch(searchQuery.trim(), 1)
    }
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      performSearch(searchQuery, page + 1)
    }
  }

  if (session.status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session.data) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-amber-500 hover:text-amber-400 transition-colors flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
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
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-amber-500" />
              <span className="text-white font-semibold">Search</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Search Results for "{searchQuery}"
          </h1>
          <p className="text-gray-400">
            {searchResults.length} results found
          </p>
        </div>

        {loading && searchResults.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="text-white text-xl">Searching...</div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-400">
              Try searching for a different anime title
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
              {searchResults.map((anime) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.id}`}
                  className="group block bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-amber-500 transition-all"
                >
                  <div className="aspect-[3/4] bg-gray-700 relative">
                    <img
                      src={anime.image_url || '/placeholder.jpg'}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2 bg-amber-500 text-black px-2 py-1 rounded text-xs font-semibold">
                      {anime.rating && anime.rating.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-white mb-1 line-clamp-2">{anime.title}</h3>
                    {anime.year && (
                      <p className="text-gray-400 text-xs">{anime.year}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
