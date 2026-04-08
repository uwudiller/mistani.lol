'use client'

import { useState, useEffect } from 'react'
import { Crown, Zap } from 'lucide-react'

interface PremiumStatus {
  is_premium: boolean
  premium_expires?: string
  days_remaining: number
  premium_amount?: number
}

export default function PremiumBadge() {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPremiumStatus()
  }, [])

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

  if (loading) {
    return <div className="w-6 h-6 bg-gray-700 rounded animate-pulse" />
  }

  if (!premiumStatus?.is_premium) {
    return null
  }

  return (
    <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
      <Crown className="w-4 h-4" />
      <span>Premium</span>
      {premiumStatus.days_remaining > 0 && (
        <span className="text-xs opacity-75">
          {premiumStatus.days_remaining}d left
        </span>
      )}
    </div>
  )
}

export function PremiumBanner() {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPremiumStatus()
  }, [])

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

  if (loading || premiumStatus?.is_premium) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500 text-black p-2 rounded-lg">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-amber-400 font-semibold">Upgrade to Premium</h3>
            <p className="text-gray-300 text-sm">
              Get faster streaming speeds and support mistani.lol development
            </p>
          </div>
        </div>
        <a
          href="https://ko-fi.com/mistlol"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          Upgrade Now
        </a>
      </div>
    </div>
  )
}
