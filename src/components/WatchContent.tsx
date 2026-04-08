'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, Volume2, Maximize, SkipBack, SkipForward } from 'lucide-react'

export default function WatchContent() {
  const session = useSession()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [anime, setAnime] = useState<any>(null)
  const [episode, setEpisode] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    const episodeNum = searchParams.get('episode')
    if (episodeNum && anime) {
      fetchEpisode(parseInt(episodeNum))
    }
  }, [searchParams, anime])

  const fetchAnime = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/anime/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setAnime(data)
        // Fetch first episode if no episode specified
        if (!searchParams.get('episode') && data.episodes && data.episodes.length > 0) {
          fetchEpisode(data.episodes[0].number)
        }
      }
    } catch (error) {
      console.error('Error fetching anime:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEpisode = async (episodeNumber: number) => {
    try {
      const response = await fetch(`/api/anime/${params.id}/episode/${episodeNumber}`)
      if (response.ok) {
        const data = await response.json()
        setEpisode(data)
      }
    } catch (error) {
      console.error('Error fetching episode:', error)
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
              <Link href={`/anime/${params.id}`} className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                <span>Back to Anime</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-amber-500" />
              <span className="text-white font-semibold">Watching</span>
            </div>
          </div>
        </div>
      </header>

      {/* Video Player */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {/* Video Container */}
          <div className="relative aspect-video bg-black">
            {episode ? (
              <video
                className="w-full h-full"
                controls
                poster={episode.image_url}
              >
                <source src={episode.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Select an episode to start watching</p>
                </div>
              </div>
            )}
          </div>

          {/* Episode Info */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-2">{anime.title}</h1>
            {episode && (
              <h2 className="text-xl text-gray-300 mb-4">
                Episode {episode.number}: {episode.title}
              </h2>
            )}

            {/* Episode List */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Episodes</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {anime.episodes?.map((ep: any) => (
                  <Link
                    key={ep.number}
                    href={`/watch/${params.id}?episode=${ep.number}`}
                    className={`block p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-center ${
                      episode?.number === ep.number ? 'ring-2 ring-amber-500' : ''
                    }`}
                  >
                    <div className="text-white font-medium">Episode {ep.number}</div>
                    {ep.title && (
                      <div className="text-gray-400 text-sm mt-1 truncate">{ep.title}</div>
                    )}
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
