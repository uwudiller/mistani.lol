'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ArrowLeft, Play, Star, Calendar, Clock, Plus, Heart } from 'lucide-react'
import { Anime } from '@/lib/anime'

export default function AnimeDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (params.id && status === 'authenticated') {
      fetchAnimeDetails(params.id as string)
    }
  }, [params.id, status])

  const fetchAnimeDetails = async (animeId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/anime/${animeId}`)
      if (response.ok) {
        const data = await response.json()
        setAnime(data)
      } else if (response.status === 404) {
        setError('Anime not found')
      } else {
        setError('Failed to fetch anime details')
      }
    } catch (error) {
      setError('An error occurred while fetching anime details')
    } finally {
      setLoading(false)
    }
  }

  const handleWatchEpisode = (episode: number) => {
    router.push(`/watch/${anime?.id}?episode=${episode}`)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <Link href="/" className="text-amber-500 hover:text-amber-400">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Anime not found</div>
      </div>
    )
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Anime Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={anime.image_url || '/placeholder.jpg'}
                alt={anime.title}
                className="w-full h-96 object-cover"
              />
              <div className="p-6">
                <h1 className="text-2xl font-bold text-white mb-2">{anime.title}</h1>
                {anime.title_jp && (
                  <p className="text-gray-400 mb-4">{anime.title_jp}</p>
                )}
                
                {/* Stats */}
                <div className="space-y-3 mb-6">
                  {anime.rating && (
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-amber-500 fill-current" />
                      <span className="text-white">{anime.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {anime.year && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-white">{anime.year}</span>
                    </div>
                  )}
                  {anime.episodes && (
                    <div className="flex items-center space-x-2">
                      <Play className="w-5 h-5 text-gray-400" />
                      <span className="text-white">{anime.episodes} episodes</span>
                    </div>
                  )}
                  {anime.status && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-white capitalize">{anime.status}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {anime.genres.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  <button className="w-full bg-amber-500 text-black py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors flex items-center justify-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>Start Watching</span>
                  </button>
                  <button className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2">
                    <Heart className="w-5 h-5" />
                    <span>Add to Favorites</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Synopsis and Episodes */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Synopsis</h2>
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-300 leading-relaxed">
                  {anime.synopsis || 'No synopsis available.'}
                </p>
              </div>
            </section>

            {/* Episodes */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Episodes</h2>
              <div className="bg-gray-800 rounded-lg p-6">
                {anime.episodes ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {Array.from({ length: Math.min(anime.episodes, 24) }, (_, i) => i + 1).map((episode) => (
                      <button
                        key={episode}
                        onClick={() => handleWatchEpisode(episode)}
                        className="bg-gray-700 hover:bg-amber-500 hover:text-black text-white py-3 px-4 rounded-lg transition-colors font-medium"
                      >
                        Ep {episode}
                      </button>
                    ))}
                    {anime.episodes > 24 && (
                      <div className="bg-gray-700 text-gray-400 py-3 px-4 rounded-lg text-center">
                        +{anime.episodes - 24} more
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400">Episode information not available</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
