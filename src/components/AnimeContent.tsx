'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Loader2, AlertCircle, RefreshCw, Crown } from 'lucide-react'

interface AnimeInfo {
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
  episodes: { episodeId: string; episodeNumber: number; title?: string }[]
}

export default function AnimeContent() {
  const session = useSession()
  const router = useRouter()
  const params = useParams()
  const [anime, setAnime] = useState<AnimeInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [session.status, router])

  useEffect(() => {
    if (params.id && session.status === 'authenticated') {
      fetchAnime()
      fetchPremiumStatus()
    }
  }, [params.id, session.status])

  const fetchAnime = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/stream/info/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Anime not found')
        } else {
          setError(`Failed to load anime (Error: ${response.status})`)
        }
        return
      }
      
      const data = await response.json()
      setAnime(data)
    } catch (err) {
      console.error('Error fetching anime:', err)
      setError('Failed to load anime')
    } finally {
      setLoading(false)
    }
  }

  const fetchPremiumStatus = async () => {
    try {
      const res = await fetch('/api/premium/status')
      if (res.ok) {
        const data = await res.json()
        setIsPremium(data.is_premium)
      }
    } catch (err) {
      console.error('Error fetching premium status:', err)
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
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{error || 'Anime not found'}</h2>
        <button
          onClick={fetchAnime}
          className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-lg font-semibold mt-4"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Try Again</span>
        </button>
        <Link href="/browse" className="text-amber-500 hover:text-amber-400 mt-4">
          Browse Anime
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/browse" className="flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Browse</span>
            </Link>
            {!isPremium && (
              <Link href="/premium" className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg transition-all">
                <Crown className="w-4 h-4" />
                <span className="text-sm font-semibold">Get Premium</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="relative aspect-video bg-gray-700">
                <img
                  src={anime.image || '/placeholder.jpg'}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
              </div>
              
              <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-1">{anime.title}</h1>
                {anime.jname && anime.jname !== anime.title && (
                  <p className="text-gray-400 mb-4">{anime.jname}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {anime.type && (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                      {anime.type}
                    </span>
                  )}
                  {anime.status && (
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                      {anime.status}
                    </span>
                  )}
                  {anime.totalEpisodes > 0 && (
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                      {anime.totalEpisodes} Episodes
                    </span>
                  )}
                </div>

                {anime.genres && anime.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {anime.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {anime.desc && (
                  <p className="text-gray-300 leading-relaxed mb-6">{anime.desc}</p>
                )}
                
                <Link
                  href={`/watch/${anime.id}?episode=1`}
                  className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
                >
                  <Play className="w-6 h-6" />
                  <span>Watch Now</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Play className="w-5 h-5 text-amber-500 mr-2" />
                Episodes ({anime.episodes?.length || 0})
              </h2>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {anime.episodes && anime.episodes.length > 0 ? (
                  anime.episodes.map((ep) => (
                    <Link
                      key={ep.episodeId}
                      href={`/watch/${anime.id}?episode=${ep.episodeNumber}`}
                      className="flex items-center justify-between p-3 bg-gray-700/50 hover:bg-amber-500 hover:text-black rounded-lg transition-colors group"
                    >
                      <div>
                        <span className="font-medium">Episode {ep.episodeNumber}</span>
                        {ep.title && (
                          <p className="text-xs text-gray-400 group-hover:text-black/70 truncate max-w-32">{ep.title}</p>
                        )}
                      </div>
                      <Play className="w-4 h-4 opacity-50" />
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">No episodes available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
