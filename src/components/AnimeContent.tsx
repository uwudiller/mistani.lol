'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Star, Calendar, Plus, Check, Loader2, AlertCircle, RefreshCw, Clock, Film, ChevronRight, Share2, Bookmark } from 'lucide-react'
import { Anime } from '@/lib/anime'
import PremiumBadge from './PremiumBadge'

interface AnimeDetails extends Anime {
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

export default function AnimeContent() {
  const session = useSession()
  const router = useRouter()
  const params = useParams()
  const [anime, setAnime] = useState<AnimeDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'relations' | 'recommendations'>('overview')

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

  const fetchAnime = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/anime/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Anime not found. It may have been removed from our database.')
        } else if (response.status === 429) {
          setError('Too many requests. Please wait a moment and try again.')
        } else {
          setError(`Failed to load anime (Error: ${response.status})`)
        }
        return
      }
      
      const data = await response.json()
      setAnime(data)
      setRetryCount(0)
    } catch (err) {
      console.error('Error fetching anime:', err)
      setError('Failed to load anime. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    fetchAnime()
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
        <div className="relative">
          <Loader2 className="w-16 h-16 text-amber-500 animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-amber-500/20 rounded-full animate-ping" />
        </div>
        <p className="text-white text-lg mt-6 animate-pulse">Loading anime details...</p>
        <p className="text-gray-500 text-sm mt-2">Fetching from Jikan API</p>
      </div>
    )
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error || 'Anime not found'}</p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleRetry}
              className="flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again {retryCount > 0 && `(${retryCount})`}</span>
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-all group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-3">
              <PremiumBadge />
              <button
                onClick={toggleWatchlist}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isInWatchlist 
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {isInWatchlist ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Watchlist</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl overflow-hidden animate-fadeIn">
              <div className="relative aspect-video bg-gray-700 overflow-hidden">
                <img
                  src={anime.large_image_url || anime.image_url || '/placeholder.jpg'}
                  alt={anime.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    {anime.score && (
                      <div className="flex items-center space-x-1 bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{anime.score.toFixed(1)}</span>
                      </div>
                    )}
                    {anime.status && (
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                        {anime.status}
                      </span>
                    )}
                    {anime.episodes && (
                      <span className="px-3 py-1 bg-gray-700/80 text-gray-300 rounded-full text-sm flex items-center">
                        <Film className="w-4 h-4 mr-1" />
                        {anime.episodes} eps
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-1">{anime.title}</h1>
                {anime.title_jp && anime.title_jp !== anime.title && (
                  <p className="text-gray-400 mb-4 text-lg">{anime.title_jp}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {anime.genres && anime.genres.map((genre, i) => (
                    <Link
                      key={genre}
                      href={`/search?genre=${encodeURIComponent(genre)}`}
                      className="px-4 py-1.5 bg-gray-700 hover:bg-amber-500 hover:text-black text-gray-300 text-sm rounded-full transition-all"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {genre}
                    </Link>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                  {anime.year && (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{anime.year}</span>
                    </div>
                  )}
                  {anime.duration && (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{anime.duration}</span>
                    </div>
                  )}
                  {anime.studios && anime.studios.length > 0 && (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <span>Studio: {anime.studios[0]}</span>
                    </div>
                  )}
                  {anime.source && (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <span>Source: {anime.source}</span>
                    </div>
                  )}
                </div>

                {anime.synopsis && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
                    <p className="text-gray-300 leading-relaxed">{anime.synopsis}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/watch/${anime.id}`}
                    className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25"
                  >
                    <Play className="w-6 h-6" />
                    <span>Watch Now</span>
                  </Link>
                  <button className="inline-flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl font-semibold transition-all">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                  <button className="inline-flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl font-semibold transition-all">
                    <Bookmark className="w-5 h-5" />
                    <span>Bookmark</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-700">
                <div className="flex border-b border-gray-700">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-4 text-center font-medium transition-colors ${
                      activeTab === 'overview' 
                        ? 'text-amber-500 border-b-2 border-amber-500' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('relations')}
                    className={`flex-1 py-4 text-center font-medium transition-colors ${
                      activeTab === 'relations' 
                        ? 'text-amber-500 border-b-2 border-amber-500' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Relations {anime.relations && anime.relations.length > 0 && `(${anime.relations.length})`}
                  </button>
                  <button
                    onClick={() => setActiveTab('recommendations')}
                    className={`flex-1 py-4 text-center font-medium transition-colors ${
                      activeTab === 'recommendations' 
                        ? 'text-amber-500 border-b-2 border-amber-500' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Recommendations {anime.recommendations && anime.recommendations.length > 0 && `(${anime.recommendations.length})`}
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      {anime.studios && anime.studios.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Studios</span>
                          <span className="text-white">{anime.studios.join(', ')}</span>
                        </div>
                      )}
                      {anime.producers && anime.producers.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Producers</span>
                          <span className="text-white">{anime.producers.slice(0, 3).join(', ')}</span>
                        </div>
                      )}
                      {anime.source && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Source</span>
                          <span className="text-white">{anime.source}</span>
                        </div>
                      )}
                      {anime.content_rating && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rating</span>
                          <span className="text-white">{anime.content_rating}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'relations' && (
                    <div className="space-y-4">
                      {anime.relations && anime.relations.length > 0 ? (
                        anime.relations.map((rel, i) => (
                          <div key={i}>
                            <h4 className="text-gray-400 text-sm mb-2">{rel.relation}</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {rel.entry.map((entry) => (
                                <Link
                                  key={entry.mal_id}
                                  href={`/anime/${entry.mal_id}`}
                                  className="flex items-center space-x-3 p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                  <div className="w-12 h-16 bg-gray-600 rounded overflow-hidden">
                                    <img src="/placeholder.jpg" alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{entry.name}</p>
                                    <p className="text-gray-400 text-xs">{entry.type}</p>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-center py-8">No relations available</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'recommendations' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {anime.recommendations && anime.recommendations.length > 0 ? (
                        anime.recommendations.slice(0, 8).map((rec) => (
                          rec.entry.slice(0, 1).map((entry) => (
                            <Link
                              key={entry.mal_id}
                              href={`/anime/${entry.mal_id}`}
                              className="group"
                            >
                              <div className="aspect-[3/4] bg-gray-700 rounded-lg overflow-hidden mb-2">
                                <img
                                  src={entry.image_url || '/placeholder.jpg'}
                                  alt={entry.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-amber-500 transition-colors">
                                {entry.title}
                              </p>
                            </Link>
                          ))
                        ))
                      ) : (
                        <p className="col-span-full text-gray-400 text-center py-8">No recommendations available</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-6 sticky top-24 animate-slideUp">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Play className="w-5 h-5 text-amber-500 mr-2" />
                Episodes
              </h2>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
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
                  <div className="text-center py-8">
                    <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No episodes available</p>
                    <Link
                      href={`/watch/${anime.id}`}
                      className="inline-block mt-4 text-amber-500 hover:text-amber-400"
                    >
                      Watch anyway
                    </Link>
                  </div>
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
