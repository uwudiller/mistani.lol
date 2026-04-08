'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Star, Calendar, Plus, Check } from 'lucide-react'
import { Anime } from '@/lib/anime'

export default function AnimeContent() {
  const session = useSession()
  const router = useRouter()
  const params = useParams()
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(true)
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
      const response = await fetch(`/api/anime/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setAnime(data)
      }
    } catch (error) {
      console.error('Error fetching anime:', error)
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session.data || !anime) {
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
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleWatchlist}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
              >
                {isInWatchlist ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Anime Info */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-700 relative">
                <img
                  src={anime.image_url || '/placeholder.jpg'}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-4">{anime.title}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  {anime.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-amber-500" />
                      <span className="text-white">{anime.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {anime.year && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400">{anime.year}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-300 mb-6">{anime.synopsis}</p>
                
                <div className="flex items-center space-x-4">
                  <Link
                    href={`/watch/${anime.id}`}
                    className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Watch Now</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Episodes Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Episodes</h2>
              <div className="space-y-2">
                {anime.episodes?.map((episode) => (
                  <Link
                    key={episode.id}
                    href={`/watch/${anime.id}?episode=${episode.number}`}
                    className="block p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white">Episode {episode.number}</span>
                      <span className="text-gray-400 text-sm">{episode.title}</span>
                    </div>
                  </Link>
                )) || (
                  <p className="text-gray-400">No episodes available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
