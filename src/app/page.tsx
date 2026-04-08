'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Play, Clock, TrendingUp, User, LogOut } from 'lucide-react'
import { Anime } from '@/lib/anime'
import PremiumBadge, { PremiumBanner } from '@/components/PremiumBadge'
import { useSpeedControl } from '@/lib/speedControl'
import { Crown } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([])
  const [continueWatching, setContinueWatching] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Apply speed control delay for free users
      const speedControl = useSpeedControl(isPremium)
      await speedControl.applyDelay()
      
      const [trendingRes, continueRes, premiumRes] = await Promise.all([
        fetch('/api/anime/trending?limit=6'),
        fetch('/api/watch/continue?limit=4'),
        fetch('/api/premium/status')
      ])

      if (trendingRes.ok) {
        const trendingData = await trendingRes.json()
        setTrendingAnime(trendingData.anime)
      }

      if (continueRes.ok) {
        const continueData = await continueRes.json()
        setContinueWatching(continueData)
      }

      if (premiumRes.ok) {
        const premiumData = await premiumRes.json()
        setIsPremium(premiumData.is_premium)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-amber-500">mistani.lol</h1>
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

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/premium" className="text-amber-500 hover:text-amber-400 transition-colors text-sm flex items-center space-x-1">
                  <Crown className="w-4 h-4" />
                  <span>Premium</span>
                </Link>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms
                </Link>
              </div>
              <PremiumBadge />
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-white hidden md:inline">{session.user?.email}</span>
              </div>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Banner */}
        <PremiumBanner />

        {/* Continue Watching Section */}
        {continueWatching.length > 0 && (
          <section className="mb-12 fade-in">
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 text-amber-500 mr-2" />
              <h2 className="text-2xl font-bold text-white">Continue Watching</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {continueWatching.map((item) => (
                <Link
                  key={item.id}
                  href={`/watch/${item.anime_id}?episode=${item.episode}`}
                  className="anime-card bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={item.anime.image_url || '/placeholder.jpg'}
                      alt={item.anime_title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-white font-semibold truncate">{item.anime_title}</h3>
                      <p className="text-gray-300 text-sm">Episode {item.episode}</p>
                    </div>
                    <div className="absolute top-2 right-2 bg-amber-500 text-black px-2 py-1 rounded text-xs font-semibold">
                      {Math.round((item.progress_seconds / item.total_seconds) * 100)}%
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${(item.progress_seconds / item.total_seconds) * 100}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending Anime Section */}
        <section className="fade-in">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-amber-500 mr-2" />
            <h2 className="text-2xl font-bold text-white">Trending Anime</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingAnime.map((anime) => (
              <Link
                key={anime.id}
                href={`/anime/${anime.id}`}
                className="anime-card bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={anime.image_url || '/placeholder.jpg'}
                    alt={anime.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-sm line-clamp-2">{anime.title}</h3>
                      {anime.rating && (
                        <p className="text-amber-500 text-xs">Rating: {anime.rating.toFixed(1)}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium text-sm line-clamp-1">{anime.title}</h3>
                  {anime.year && (
                    <p className="text-gray-400 text-xs">{anime.year}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
