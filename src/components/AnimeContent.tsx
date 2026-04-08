'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Star, Calendar, Plus, Check, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Anime } from '@/lib/anime'

export default function AnimeContent() {
  const session = useSession()
  const router = useRouter()
  const params = useParams()
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [session.status, router])

  useEffect(() => {
    if (params.id && session.status === 'authenticated') {
      fetchAnime()
    }
  }, [params.id, session.status])

  const fetchAnime = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/anime/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Anime not found')
        } else {
          setError('Failed to load anime')
        }
        return
      }
      
      const data = await response.json()
      setAnime(data)
    } catch (err) {
      console.error('Error fetching anime:', err)
      setError('Failed to load anime. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleWatchlist = async () => {
    if (!anime) return
    
    try {
      const response = await fetch('/api/watchlist', {
        method: isInWatchlist ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ anime_id: anime.id }),
      })
      
      if (response.ok) {
        setIsInWatchlist(!isInWatchlist)
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error)
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

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{error || 'Anime not found'}</h2>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <button
            onClick={fetchAnime}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white animate-fadeIn">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </Link>
            <button
              onClick={toggleWatchlist}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isInWatchlist 
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isInWatchlist ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Watchlist</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl overflow-hidden animate-slideUp">
              <div className="aspect-video bg-gray-700 relative overflow-hidden">
                <img
                  src={anime.image_url || '/placeholder.jpg'}
                  alt={anime.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-2">{anime.title}</h1>
                {anime.title_jp && (
                  <p className="text-gray-400 mb-4">{anime.title_jp}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {anime.rating && (
                    <div className="flex items-center space-x-1 bg-gray-700/50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="text-white font-semibold">{anime.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {anime.year && (
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{anime.year}</span>
                    </div>
                  )}
                  {anime.status && (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                      {anime.status}
                    </span>
                  )}
                </div>

                {anime.genres && anime.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {anime.genres.map((genre, i) => (
                      <span 
                        key={genre} 
                        className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full hover:bg-gray-600 transition-colors"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-gray-300 leading-relaxed mb-6">{anime.synopsis || 'No synopsis available.'}</p>
                
                <Link
                  href={`/watch/${anime.id}`}
                  className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25"
                >
                  <Play className="w-6 h-6" />
                  <span>Watch Now</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 sticky top-24 animate-slideUp" style={{ animationDelay: '100ms' }}>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Play className="w-5 h-5 text-amber-500 mr-2" />
                Episodes
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {anime.episodes ? (
                  Array.from({ length: Math.min(anime.episodes, 24) }, (_, i) => i + 1).map((ep) => (
                    <Link
                      key={ep}
                      href={`/watch/${anime.id}?episode=${ep}`}
                      className="flex items-center justify-between p-3 bg-gray-700/50 hover:bg-amber-500 hover:text-black rounded-lg transition-all group"
                    >
                      <span className="font-medium">Episode {ep}</span>
                      <Play className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">No episodes available</p>
                )}
                {anime.episodes && anime.episodes > 24 && (
                  <p className="text-gray-500 text-sm text-center pt-2">
                    +{anime.episodes - 24} more episodes
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
