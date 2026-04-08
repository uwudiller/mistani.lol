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

export default function PremiumPage() {
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
              <Link href="/" className="inline-flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <h1 className="text-2xl font-bold text-white">Premium</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {premiumStatus?.is_premium ? (
          // Premium User View
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mb-4">
                <Crown className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Premium Active!</h2>
              <p className="text-gray-400">
                Thank you for supporting mistani.lol! Enjoy your premium benefits.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Your Premium Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-amber-500 font-semibold">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Expires:</span>
                  <span className="text-white">
                    {premiumStatus.premium_expires 
                      ? new Date(premiumStatus.premium_expires).toLocaleDateString()
                      : 'Lifetime'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Days Remaining:</span>
                  <span className="text-white">{premiumStatus.days_remaining}</span>
                </div>
                {premiumStatus.premium_amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Donation:</span>
                    <span className="text-white">${premiumStatus.premium_amount}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Premium Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span className="text-white">Instant streaming speeds</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-amber-500" />
                  <span className="text-white">HD video quality</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="text-white">Priority support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Gift className="w-5 h-5 text-amber-500" />
                  <span className="text-white">No advertisements</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a
                href="https://ko-fi.com/mistlol"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Gift className="w-5 h-5" />
                <span>Extend Premium</span>
              </a>
            </div>
          </div>
        ) : (
          // Free User View
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-700 rounded-full mb-4">
                <Crown className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Upgrade to Premium</h2>
              <p className="text-gray-400">
                Support mistani.lol development and unlock premium features
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Free</h3>
                <div className="text-3xl font-bold text-gray-400 mb-6">$0</div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">Basic streaming</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">480p video quality</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">2-second delays</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">Advertisements</span>
                  </li>
                </ul>
              </div>

              {/* Premium Plan */}
              <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-lg p-6 border border-amber-500 relative">
                <div className="absolute top-2 right-2 bg-amber-500 text-black px-2 py-1 rounded text-xs font-semibold">
                  POPULAR
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Premium</h3>
                <div className="text-3xl font-bold text-amber-500 mb-6">$5+</div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-white">Instant streaming</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-white">HD video quality</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-white">No delays</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-white">No advertisements</span>
                  </li>
                </ul>
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
