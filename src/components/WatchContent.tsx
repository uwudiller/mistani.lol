'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Settings, Loader2, AlertCircle, Crown, ChevronLeft, ChevronRight } from 'lucide-react'

interface StreamingServer {
  name: string
  url: string
  type: 'direct' | 'embed'
}

interface StreamInfo {
  id: string
  title: string
  episodeNumber: number
  servers: StreamingServer[]
  nextEpisode?: { episodeId: string; episodeNumber: number }
  prevEpisode?: { episodeId: string; episodeNumber: number }
  isPremium: boolean
  speedLimit: string
  message?: string
}

interface AnimeInfo {
  id: string
  title: string
  episodes: { episodeId: string; episodeNumber: number; title?: string }[]
}

export default function WatchContent() {
  const session = useSession()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  
  const [animeInfo, setAnimeInfo] = useState<AnimeInfo | null>(null)
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentServer, setCurrentServer] = useState(0)

  const episodeParam = searchParams.get('episode')
  const currentEpisode = episodeParam ? parseInt(episodeParam) : 1

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [session.status, router])

  useEffect(() => {
    if (params.id && session.status === 'authenticated') {
      fetchAnimeInfo()
    }
  }, [params.id, session.status])

  useEffect(() => {
    if (params.id && animeInfo && currentEpisode) {
      const episode = animeInfo.episodes.find(ep => ep.episodeNumber === currentEpisode)
      if (episode) {
        fetchStream(episode.episodeId)
      }
    }
  }, [params.id, animeInfo, currentEpisode])

  const fetchAnimeInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/stream/info/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setAnimeInfo(data)
      } else {
        setError('Anime not found')
      }
    } catch (err) {
      console.error('Error fetching anime info:', err)
      setError('Failed to load anime')
    } finally {
      setLoading(false)
    }
  }

  const fetchStream = async (episodeId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/stream/${params.id}/${episodeId}?server=vidstreaming`)
      if (response.ok) {
        const data = await response.json()
        setStreamInfo(data)
      } else {
        setError('Episode not found')
      }
    } catch (err) {
      console.error('Error fetching stream:', err)
      setError('Failed to load stream')
    } finally {
      setLoading(false)
    }
  }

  const handleEpisodeChange = (episodeNumber: number) => {
    router.push(`/watch/${params.id}?episode=${episodeNumber}`)
  }

  const cycleServer = () => {
    if (streamInfo && streamInfo.servers.length > 0) {
      setCurrentServer((prev) => (prev + 1) % streamInfo.servers.length)
    }
  }

  if (session.status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-white text-lg">Loading player...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">{error}</h2>
        <Link href="/" className="text-amber-500 hover:text-amber-400">
          Back to Home
        </Link>
      </div>
    )
  }

  const currentStreamUrl = streamInfo?.servers[currentServer]?.url || ''
  const isPremium = streamInfo?.isPremium || false

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href={`/anime/${params.id}`} className="flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </Link>
            <div className="text-center">
              <h1 className="text-white font-semibold truncate max-w-md">{animeInfo?.title}</h1>
              <p className="text-gray-400 text-sm">Episode {currentEpisode}</p>
            </div>
            {!isPremium && (
              <Link href="/premium" className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg transition-all hover:scale-105">
                <Crown className="w-4 h-4" />
                <span className="text-sm font-semibold">Get Premium</span>
              </Link>
            )}
            <div className="w-24" />
          </div>
        </div>
      </header>

      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="aspect-video bg-black relative">
            {currentStreamUrl ? (
              <iframe
                src={currentStreamUrl}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                scrolling="no"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Loading stream...</p>
                </div>
              </div>
            )}
            
            {!isPremium && currentStreamUrl && (
              <div className="absolute top-4 right-4 bg-red-500/90 text-white px-3 py-1 rounded-full text-sm flex items-center animate-pulse">
                <VolumeX className="w-4 h-4 mr-1" />
                Free tier - Limited speed
              </div>
            )}
          </div>

          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-800">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => streamInfo?.prevEpisode && handleEpisodeChange(streamInfo.prevEpisode.episodeNumber)}
                disabled={!streamInfo?.prevEpisode}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-lg font-semibold min-w-32 text-center">
                Episode {currentEpisode}
              </span>
              
              <button
                onClick={() => streamInfo?.nextEpisode && handleEpisodeChange(streamInfo.nextEpisode.episodeNumber)}
                disabled={!streamInfo?.nextEpisode}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={cycleServer}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Change server"
              >
                <Settings className="w-5 h-5" />
              </button>
              {streamInfo?.servers && streamInfo.servers.length > 1 && (
                <span className="text-gray-400 text-sm">
                  {currentServer + 1}/{streamInfo.servers.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-xl p-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-white mb-4">{animeInfo?.title}</h2>
              {streamInfo?.message && !isPremium && (
                <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4 mb-4">
                  <p className="text-amber-400">{streamInfo.message}</p>
                </div>
              )}
              <div className="flex items-center space-x-4 text-sm">
                {isPremium ? (
                  <span className="flex items-center text-green-400">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium streaming enabled
                  </span>
                ) : (
                  <Link href="/premium" className="text-amber-500 hover:text-amber-400">
                    Upgrade to Premium for unlimited speed
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl p-4 sticky top-24 animate-slideUp">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Play className="w-5 h-5 text-amber-500 mr-2" />
                Episodes
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {animeInfo?.episodes.map((ep) => (
                  <button
                    key={ep.episodeId}
                    onClick={() => handleEpisodeChange(ep.episodeNumber)}
                    className={`w-full p-3 rounded-lg text-left transition-all hover:scale-102 ${
                      ep.episodeNumber === currentEpisode
                        ? 'bg-amber-500 text-black font-semibold'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Ep {ep.episodeNumber}</span>
                      {ep.title && <span className="text-xs opacity-70 truncate ml-2 hidden sm:inline">{ep.title}</span>}
                    </div>
                  </button>
                )) || (
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
