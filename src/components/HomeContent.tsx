'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Clock, TrendingUp, User, LogOut, Shield, Database, Trash2, Settings, ChevronRight, Loader2 } from 'lucide-react'
import { Anime } from '@/lib/anime'

interface ContinueWatchingItem {
  id: string
  anime_id: string
  episode: number
  progress_seconds: number
  total_seconds: number
  anime: {
    title: string
    image_url?: string
  }
  anime_title: string
}
import PremiumBadge, { PremiumBanner } from '@/components/PremiumBadge'
import { useSpeedControl } from '@/lib/speedControl'
import { Crown as CrownIcon } from 'lucide-react'

export default function HomeContent() {
  const session = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([])
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    if (session.status === 'authenticated') {
      fetchDashboardData()
    } else if (session.status === 'unauthenticated') {
      fetchTrendingOnly()
    }
  }, [session.status])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
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

  const fetchTrendingOnly = async () => {
    try {
      setLoading(true)
      const trendingRes = await fetch('/api/anime/trending?limit=8')
      if (trendingRes.ok) {
        const trendingData = await trendingRes.json()
        setTrendingAnime(trendingData.anime)
      }
    } catch (error) {
      console.error('Error fetching trending anime:', error)
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

  if (session.status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-white text-lg animate-pulse">Loading...</p>
      </div>
    )
  }

  if (!session.data) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-2xl font-bold text-amber-500">mistani.lol</h1>
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Watch Anime <span className="text-amber-500">Privately</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              A privacy-first anime streaming service. No tracking, no ads, no data selling. Your watch history stays on your device.
            </p>
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                />
              </div>
            </form>
          </div>

          {/* Privacy Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <Shield className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Tracking</h3>
              <p className="text-gray-400">We don't track what you watch. Your viewing history stays private and local.</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <Database className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Minimal Data</h3>
              <p className="text-gray-400">We only store what's necessary for your account. Nothing else.</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <Trash2 className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Delete Anytime</h3>
              <p className="text-gray-400">Delete your account and all data instantly. No questions asked.</p>
            </div>
          </div>

          {/* Trending Anime */}
          {trendingAnime.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <TrendingUp className="w-6 h-6 text-amber-500 mr-2" />
                  <h2 className="text-2xl font-bold text-white">Trending Now</h2>
                </div>
                <Link href="/browse" className="text-amber-500 hover:text-amber-400 transition-colors flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
                {trendingAnime.map((anime) => (
                  <Link
                    key={anime.id}
                    href={`/anime/${anime.id}`}
                    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-amber-500 transition-all"
                  >
                    <div className="relative">
                      <img
                        src={anime.image_url || '/placeholder.jpg'}
                        alt={anime.title}
                        className="w-full h-64 object-cover"
                      />
                      {anime.score && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-black px-2 py-1 rounded text-xs font-semibold">
                          {anime.score.toFixed(1)}
                        </div>
                      )}
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
          )}

          {/* CTA */}
          <div className="mt-16 text-center bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to watch privately?</h3>
            <p className="text-gray-400 mb-6">Join now and start streaming with complete privacy.</p>
            <Link href="/auth/signup" className="inline-block bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-lg font-semibold transition-colors">
              Create Free Account
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</Link>
                <Link href="/premium" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center">
                  <CrownIcon className="w-4 h-4 mr-1" /> Premium
                </Link>
              </div>
              <p className="text-gray-500 text-sm">mistani.lol - Privacy-first anime</p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-amber-500">mistani.lol</h1>
            
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

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/premium" className="text-amber-500 hover:text-amber-400 transition-colors text-sm flex items-center space-x-1">
                  <CrownIcon className="w-4 h-4" />
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
                <Link href="/settings" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center">
                  <Settings className="w-4 h-4" />
                </Link>
              </div>
              <PremiumBadge />
              <Link href="/settings" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Settings className="w-5 h-5 md:hidden" />
              </Link>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-white hidden md:inline">{session.data?.user?.email}</span>
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
        <PremiumBanner />

        {continueWatching.length > 0 && (
          <section className="mb-12 animate-slideUp">
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 text-amber-500 mr-2" />
              <h2 className="text-2xl font-bold text-white">Continue Watching</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {continueWatching.map((item, i) => (
                <Link
                  key={item.id}
                  href={`/watch/${item.anime_id}?episode=${item.episode}`}
                  className="anime-card bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.anime.image_url || '/placeholder.jpg'}
                      alt={item.anime_title}
                      className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
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
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(item.progress_seconds / item.total_seconds) * 100}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="animate-slideUp" style={{ animationDelay: continueWatching.length > 0 ? '200ms' : '0ms' }}>
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-amber-500 mr-2" />
            <h2 className="text-2xl font-bold text-white">Trending Anime</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingAnime.map((anime, i) => (
              <Link
                key={anime.id}
                href={`/anime/${anime.id}`}
                className="anime-card bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={anime.image_url || '/placeholder.jpg'}
                    alt={anime.title}
                    className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {anime.score && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-black px-2 py-1 rounded text-xs font-semibold">
                      {anime.score.toFixed(1)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-sm line-clamp-2">{anime.title}</h3>
                      {anime.score && (
                        <p className="text-amber-500 text-xs">Score: {anime.score.toFixed(1)}</p>
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
