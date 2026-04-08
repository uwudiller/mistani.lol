'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ArrowLeft, Crown, Zap, CheckCircle, Star, Gift, Loader2, Sparkles, Shield, Clock } from 'lucide-react'

interface PremiumStatus {
  is_premium: boolean
  premium_expires?: string
  days_remaining: number
  premium_amount?: number
}

const PREMIUM_TIERS = [
  { amount: 5, months: 1, label: '1 Month', popular: false },
  { amount: 10, months: 2, label: '2 Months', popular: true },
  { amount: 25, months: 5, label: '5 Months', popular: false },
  { amount: 50, months: 12, label: '1 Year', popular: false },
]

export default function PremiumContent() {
  const session = useSession()
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (session.status === 'authenticated') {
      fetchPremiumStatus()
    } else if (session.status === 'unauthenticated') {
      setLoading(false)
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

  const handleKoFiDonate = (amount: number) => {
    setProcessing(true)
    const koFiUrl = `https://ko-fi.com/mistlol/?donate=checkout&amount=${amount}&hide_ghipping=true`
    window.open(koFiUrl, '_blank', 'noopener,noreferrer')
    setTimeout(() => setProcessing(false), 2000)
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="inline-flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Crown className="w-20 h-20 text-amber-500 mx-auto mb-6 animate-float" />
          <h1 className="text-4xl font-bold text-white mb-4">Sign in to view Premium</h1>
          <p className="text-gray-400 mb-8">Create an account or sign in to access premium features</p>
          <Link href="/auth/signin" className="inline-block bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105">
            Sign In
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-white font-semibold">Premium</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-block p-4 bg-amber-500/20 rounded-full mb-6 animate-pulse-glow">
            <Crown className="w-16 h-16 text-amber-500" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="text-amber-500">mistani</span>.lol Premium
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Unlock the ultimate anime streaming experience with lightning-fast speeds and no throttling
          </p>
        </div>

        {premiumStatus?.is_premium ? (
          <div className="space-y-8 animate-slideUp">
            <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-2xl p-8 text-center animate-gradient">
              <div className="bg-black/20 rounded-xl p-6 inline-block">
                <Crown className="w-16 h-16 text-black mx-auto mb-2" />
                <h2 className="text-3xl font-bold text-black mb-2">Premium Active!</h2>
                <p className="text-black/80 text-lg">
                  Valid until {new Date(premiumStatus.premium_expires || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <div className="mt-4 bg-black/30 rounded-lg px-6 py-3 inline-block">
                  <span className="text-black font-bold text-xl">{premiumStatus.days_remaining} days remaining</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Zap, title: 'Lightning-Fast Streaming', desc: 'Buffer-free anime with our fastest servers' },
                { icon: Shield, title: 'No Speed Limits', desc: 'Unlimited streaming without throttling' },
                { icon: Star, title: 'Premium Badge', desc: 'Show off your support with a special badge' },
                { icon: Gift, title: 'Support the Platform', desc: 'Help keep mistani.lol running ad-free' },
              ].map((benefit, i) => (
                <div 
                  key={benefit.title} 
                  className="bg-gray-800 rounded-xl p-6 flex items-start space-x-4 hover-lift"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <benefit.icon className="w-8 h-8 text-amber-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-2xl p-8 animate-slideUp">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Premium Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Zap, title: 'Lightning-Fast Streaming', desc: 'Buffer-free anime with our fastest servers' },
                  { icon: Shield, title: 'No Speed Limits', desc: 'Unlimited streaming without throttling' },
                  { icon: Star, title: 'Premium Badge', desc: 'Show off your support with a special badge' },
                  { icon: Gift, title: 'Support the Platform', desc: 'Help keep mistani.lol running ad-free' },
                ].map((benefit, i) => (
                  <div 
                    key={benefit.title} 
                    className="flex items-start space-x-4 p-4 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-colors"
                  >
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <benefit.icon className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-gray-400 text-sm">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8 animate-slideUp" style={{ animationDelay: '100ms' }}>
              <div className="text-center mb-8">
                <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h2>
                <p className="text-gray-400">Select a donation amount to unlock premium</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {PREMIUM_TIERS.map((tier) => (
                  <button
                    key={tier.amount}
                    onClick={() => handleKoFiDonate(tier.amount)}
                    disabled={processing}
                    className={`relative p-6 rounded-xl transition-all hover-lift ${
                      tier.popular 
                        ? 'bg-gradient-to-br from-amber-500 to-yellow-500 text-black' 
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        POPULAR
                      </span>
                    )}
                    <div className="text-3xl font-bold mb-1">${tier.amount}</div>
                    <div className="text-sm opacity-80">{tier.label}</div>
                  </button>
                ))}
              </div>

              <div className="bg-gray-700/50 rounded-xl p-6 text-center">
                <p className="text-gray-300 mb-4">
                  Payments are securely processed through Ko-fi. After donation, premium is automatically activated within minutes.
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> Auto-activation</span>
                  <span className="flex items-center"><Shield className="w-4 h-4 mr-1" /> Secure payment</span>
                  <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> Cancel anytime</span>
                </div>
              </div>

              <div className="text-center mt-6">
                <a
                  href="https://ko-fi.com/mistlol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25"
                >
                  <Crown className="w-6 h-6" />
                  <span>Support on Ko-fi</span>
                </a>
                <p className="text-gray-500 text-sm mt-3">
                  Already donated? <Link href="/faq" className="text-amber-500 hover:underline">Check FAQ</Link> for activation help
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
