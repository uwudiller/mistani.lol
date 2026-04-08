'use client'

import { Providers } from '@/components/Providers'
import WatchContent from '@/components/WatchContent'

export default function WatchPage() {
  
  const [anime, setAnime] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [episode, setEpisode] = useState(parseInt(searchParams.get('episode') || '1'))
  const [autoPlay, setAutoPlay] = useState(true)
  const [progressSaved, setProgressSaved] = useState(false)

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

  useEffect(() => {
    const savedProgress = localStorage.getItem(`progress-${params.id}-${episode}`)
    if (savedProgress && videoRef.current) {
      const progress = parseFloat(savedProgress)
      videoRef.current.currentTime = progress
      setCurrentTime(progress)
    }
  }, [params.id, episode])

  const fetchAnimeDetails = async (animeId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/anime/${animeId}`)
      if (response.ok) {
        const data = await response.json()
        setAnime(data)
      } else {
        setError('Failed to fetch anime details')
      }
    } catch (error) {
      setError('An error occurred while fetching anime details')
    } finally {
      setLoading(false)
    }
  }

  const saveProgress = async (currentTime: number) => {
    if (!session?.user?.id || !anime) return

    try {
      await fetch('/api/watch/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animeId: anime.id,
          episode: episode,
          progressSeconds: Math.floor(currentTime),
          totalSeconds: Math.floor(duration),
        }),
      })
      setProgressSaved(true)
      setTimeout(() => setProgressSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      
      // Save progress every 10 seconds
      if (Math.floor(videoRef.current.currentTime) % 10 === 0) {
        saveProgress(videoRef.current.currentTime)
      }
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setVolume(newVolume)
    }
  }

  const handleEpisodeChange = (newEpisode: number) => {
    saveProgress(currentTime)
    setEpisode(newEpisode)
    router.push(`/watch/${params.id}?episode=${newEpisode}`)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
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

  // Mock video URL - in production, this would come from your video streaming service
  const videoUrl = `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href={`/anime/${params.id}`} className="inline-flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Anime</span>
              </Link>
            </div>
            <div className="text-white">
              {anime?.title} - Episode {episode}
            </div>
          </div>
        </div>
      </header>

      {/* Video Player */}
      <div className="relative bg-black">
        <div className="aspect-video">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            autoPlay={autoPlay}
          />
        </div>

        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-white text-sm mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-amber-500 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              <button
                onClick={() => handleEpisodeChange(Math.max(1, episode - 1))}
                disabled={episode <= 1}
                className="text-white hover:text-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <span className="text-white">Episode {episode}</span>
              
              <button
                onClick={() => handleEpisodeChange(episode + 1)}
                disabled={anime?.episodes ? episode >= anime.episodes : false}
                className="text-white hover:text-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-white" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <button className="text-white hover:text-amber-500 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              
              <button className="text-white hover:text-amber-500 transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Saved Indicator */}
        {progressSaved && (
          <div className="absolute top-4 right-4 bg-green-500 text-black px-3 py-1 rounded-lg text-sm font-semibold">
            Progress Saved
          </div>
        )}
      </div>

      {/* Episode List */}
      <div className="bg-gray-900 p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Episodes</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
          {anime?.episodes && Array.from({ length: anime.episodes }, (_, i) => i + 1).map((ep) => (
            <button
              key={ep}
              onClick={() => handleEpisodeChange(ep)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                ep === episode
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Ep {ep}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
