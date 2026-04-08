'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ArrowLeft, Crown, Zap, CheckCircle, Star, Gift } from 'lucide-react'

interface PremiumStatus {
  is_premium: boolean
  premium_expires?: string
  days_remaining: number
  premium_amount?: number
}

export default function PremiumContent() {
  const session = useSession()
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session.status === 'authenticated') {
      fetchPremiumStatus()
    }
  }, [session.status])

  const fetchPremiumStatus = async () => {
    try {
      const response = await fetch('/api/premium/status')
      if (response.ok) {
        const data = await response.json()
        setPremiumStatus(data)
      }
    } catch (error) {
      console.error('Failed to fetch premium status:', error)
    } finally {
      setLoading(false)
    }
  }

  if (session.status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session.data) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
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
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-white font-semibold">Premium</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">mistani.lol Premium</h1>
          <p className="text-xl text-gray-300">Unlock the ultimate anime streaming experience</p>
        </div>

        {premiumStatus?.is_premium ? (
          // Premium user view
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg p-8 text-center">
              <Crown className="w-12 h-12 text-black mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-black mb-2">Premium Active!</h2>
              <p className="text-black mb-4">
                You have premium access until {new Date(premiumStatus.premium_expires || '').toLocaleDateString()}
              </p>
              <div className="bg-black bg-opacity-20 rounded-lg p-4 inline-block">
                <p className="text-black font-semibold">
                  {premiumStatus.days_remaining} days remaining
                </p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Your Premium Benefits</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-amber-500" />
                  <span className="text-gray-300">Lightning-fast streaming speeds</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-amber-500" />
                  <span className="text-gray-300">No speed throttling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-6 h-6 text-amber-500" />
                  <span className="text-gray-300">Premium badge on your profile</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Gift className="w-6 h-6 text-amber-500" />
                  <span className="text-gray-300">Support the mistani.lol platform</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Free user view
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Why Go Premium?</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-amber-500" />
                  <div>
                    <h4 className="text-white font-semibold">Lightning-Fast Streaming</h4>
                    <p className="text-gray-400 text-sm">Enjoy buffer-free anime streaming with our fastest servers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-amber-500" />
                  <div>
                    <h4 className="text-white font-semibold">No Speed Limits</h4>
                    <p className="text-gray-400 text-sm">Free users experience speed throttling - premium users get unlimited speed</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-6 h-6 text-amber-500" />
                  <div>
                    <h4 className="text-white font-semibold">Premium Badge</h4>
                    <p className="text-gray-400 text-sm">Show off your premium status with a special badge on your profile</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Gift className="w-6 h-6 text-amber-500" />
                  <div>
                    <h4 className="text-white font-semibold">Support mistani.lol</h4>
                    <p className="text-gray-400 text-sm">Your donation helps keep the platform running and ad-free</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">How Premium Works</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  Premium is activated through Ko-fi donations. Simply donate $5 or more to unlock premium features for 1 month.
                </p>
                <div className="bg-gray-700 rounded p-4">
                  <h4 className="font-semibold text-amber-400 mb-2">Donation Tiers:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>$5 - 1 month premium</li>
                    <li>$10 - 2 months premium</li>
                    <li>$25 - 5 months premium</li>
                    <li>$50+ - 10+ months premium</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a
                href="https://ko-fi.com/mistlol"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <Crown className="w-6 h-6" />
                <span>Upgrade to Premium</span>
              </a>
              <p className="text-gray-400 text-sm mt-3">
                Secure payment through Ko-fi
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
