'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ArrowLeft, Crown, Zap, Shield, Loader2, Check, Lock, Clock, Sparkles, Star, Gift, CheckCircle } from 'lucide-react'

interface PremiumStatus {
  is_premium: boolean
  premium_expires?: string
  days_remaining: number
}

export default function PremiumContent() {
  const session = useSession()
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const koFiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (session.status === 'authenticated') {
      fetchPremiumStatus()
    } else if (session.status === 'unauthenticated') {
      setLoading(false)
    }

    const checkSuccess = new URLSearchParams(window.location.search).get('success')
    if (checkSuccess === 'true') {
      setPaymentSuccess(true)
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
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-white text-lg">Loading...</p>
      </div>
    )
  }

  if (!session.data) {
    return (
      <div className="min-h-screen bg-gray-900">
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/" className="inline-flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <Crown className="w-20 h-20 text-amber-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Sign in to view Premium</h1>
          <p className="text-gray-400 mb-8">Create an account or sign in to access premium features</p>
          <Link href="/auth/signin" className="inline-block bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-lg font-semibold">
            Sign In
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-white font-semibold">Premium</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-amber-500/20 rounded-full mb-6">
            <Crown className="w-16 h-16 text-amber-500" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="text-amber-500">mistani</span>.lol Premium
          </h1>
          <p className="text-xl text-gray-300">
            Unlock lightning-fast streaming with no throttling
          </p>
        </div>

        {paymentSuccess && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 mb-8 text-center animate-fadeIn">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-green-400 mb-2">Payment Successful!</h3>
            <p className="text-gray-300">Your premium is being activated. Refreshing...</p>
          </div>
        )}

        {premiumStatus?.is_premium ? (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-2xl p-8 text-center">
              <div className="bg-black/20 rounded-xl p-6 inline-block">
                <Crown className="w-16 h-16 text-black mx-auto mb-2" />
                <h2 className="text-3xl font-bold text-black mb-2">Premium Active!</h2>
                <p className="text-black/80 text-lg">
                  Valid until {new Date(premiumStatus.premium_expires || '').toLocaleDateString()}
                </p>
                <div className="mt-4 bg-black/30 rounded-lg px-6 py-3 inline-block">
                  <span className="text-black font-bold text-xl">{premiumStatus.days_remaining} days remaining</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Zap, title: 'Lightning-Fast Streaming', desc: 'Buffer-free anime' },
                { icon: Shield, title: 'No Speed Limits', desc: 'Unlimited speed' },
                { icon: Star, title: 'Premium Badge', desc: 'Show your support' },
                { icon: Gift, title: 'Support the Platform', desc: 'Keep it ad-free' },
              ].map((benefit, i) => (
                <div key={benefit.title} className="bg-gray-800 rounded-xl p-6 flex items-start space-x-4">
                  <benefit.icon className="w-8 h-8 text-amber-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Premium Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Zap, title: 'Lightning-Fast Streaming' },
                  { icon: Shield, title: 'No Speed Limits' },
                  { icon: Star, title: 'Premium Badge' },
                  { icon: Gift, title: 'Support the Platform' },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-xl">
                    <benefit.icon className="w-6 h-6 text-amber-500" />
                    <span className="text-white">{benefit.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8">
              <div className="text-center mb-6">
                <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-white mb-2">Get Premium via Ko-fi</h2>
                <p className="text-gray-400">Choose an amount below to unlock premium instantly</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <div ref={koFiRef}>
                  <iframe 
                    src={'https://ko-fi.com/widget.php?id=mistlol&t=light&tn=Premium+Subscription&ts=Check+out+my+page!&te=Support+me+on+Ko-fi!'}
                    style={{ border: '0', width: '100%', padding: '4px' }}
                    height="800" 
                    title="Support me on Ko-fi"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 mt-6">
                <span className="flex items-center"><Lock className="w-4 h-4 mr-1" /> Secure payment</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> Instant activation</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
