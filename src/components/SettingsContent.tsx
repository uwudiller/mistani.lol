'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Volume2, VolumeX, Globe, Bell, BellOff, Trash2, Shield, Moon, Sun, ChevronRight, Loader2, AlertTriangle, Check, LogOut, Play, FileText } from 'lucide-react'

interface UserSettings {
  preferredAudio: 'sub' | 'dub'
  autoplay: boolean
  notifications: boolean
  quality: 'auto' | '1080p' | '720p' | '480p'
  subtitles: boolean
}

export default function SettingsContent() {
  const session = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    preferredAudio: 'sub',
    autoplay: true,
    notifications: true,
    quality: 'auto',
    subtitles: true,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session.status === 'authenticated') {
      loadSettings()
    }
  }, [session.status, router])

  const loadSettings = async () => {
    try {
      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    setSaveSuccess(false)
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings))
      await new Promise(r => setTimeout(r, 500))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return
    
    setDeleteLoading(true)
    setDeleteError('')
    
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      })
      
      if (response.ok) {
        router.push('/')
      } else {
        const data = await response.json()
        setDeleteError(data.error || 'Failed to delete account')
      }
    } catch (error) {
      setDeleteError('An error occurred. Please try again.')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (session.status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-white text-lg">Loading settings...</p>
      </div>
    )
  }

  if (!session.data) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </Link>
            <h1 className="text-xl font-bold text-white">Settings</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Playback Settings */}
          <section className="bg-gray-800 rounded-xl p-6 animate-slideUp">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Volume2 className="w-6 h-6 text-amber-500 mr-3" />
              Playback
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-3 font-medium">Preferred Audio</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSettings({ ...settings, preferredAudio: 'sub' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      settings.preferredAudio === 'sub'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                        : 'border-gray-700 hover:border-gray-600 text-gray-300'
                    }`}
                  >
                    <div className="text-lg font-bold mb-1">Subtitles</div>
                    <div className="text-sm opacity-70">Japanese audio with subtitles</div>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, preferredAudio: 'dub' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      settings.preferredAudio === 'dub'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                        : 'border-gray-700 hover:border-gray-600 text-gray-300'
                    }`}
                  >
                    <div className="text-lg font-bold mb-1">Dubbed</div>
                    <div className="text-sm opacity-70">English dubbed audio</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-3 font-medium">Subtitles</label>
                <button
                  onClick={() => setSettings({ ...settings, subtitles: !settings.subtitles })}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                    settings.subtitles
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-amber-500 mr-3" />
                    <span className={settings.subtitles ? 'text-amber-500' : 'text-gray-300'}>
                      Show subtitles for dubbed content
                    </span>
                  </div>
                  <div className={`w-12 h-7 rounded-full p-1 transition-colors ${settings.subtitles ? 'bg-amber-500' : 'bg-gray-600'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.subtitles ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </button>
              </div>

              <div>
                <label className="block text-gray-300 mb-3 font-medium">Autoplay</label>
                <button
                  onClick={() => setSettings({ ...settings, autoplay: !settings.autoplay })}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                    settings.autoplay
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center">
                    <Play className="w-5 h-5 text-amber-500 mr-3" />
                    <span className={settings.autoplay ? 'text-amber-500' : 'text-gray-300'}>
                      Auto-play next episode
                    </span>
                  </div>
                  <div className={`w-12 h-7 rounded-full p-1 transition-colors ${settings.autoplay ? 'bg-amber-500' : 'bg-gray-600'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.autoplay ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </button>
              </div>

              <div>
                <label className="block text-gray-300 mb-3 font-medium">Video Quality</label>
                <select
                  value={settings.quality}
                  onChange={(e) => setSettings({ ...settings, quality: e.target.value as any })}
                  className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-700 text-white focus:border-amber-500 outline-none"
                >
                  <option value="auto">Auto</option>
                  <option value="1080p">1080p HD</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                </select>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-gray-800 rounded-xl p-6 animate-slideUp" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Bell className="w-6 h-6 text-amber-500 mr-3" />
              Notifications
            </h2>
            
            <button
              onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                settings.notifications
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center">
                {settings.notifications ? (
                  <Bell className="w-5 h-5 text-amber-500 mr-3" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-500 mr-3" />
                )}
                <span className={settings.notifications ? 'text-amber-500' : 'text-gray-300'}>
                  Enable notifications
                </span>
              </div>
              <div className={`w-12 h-7 rounded-full p-1 transition-colors ${settings.notifications ? 'bg-amber-500' : 'bg-gray-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>
          </section>

          {/* Privacy */}
          <section className="bg-gray-800 rounded-xl p-6 animate-slideUp" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Shield className="w-6 h-6 text-amber-500 mr-3" />
              Privacy & Security
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-700/50 rounded-xl">
                <div className="text-gray-300 mb-2">Email</div>
                <div className="text-white font-medium">{session.data.user?.email}</div>
              </div>
              
              <Link
                href="/privacy"
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-amber-500 mr-3" />
                  <span className="text-gray-300">Privacy Policy</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </Link>
              
              <Link
                href="/terms"
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-amber-500 mr-3" />
                  <span className="text-gray-300">Terms of Service</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </Link>
            </div>
          </section>

          {/* Account */}
          <section className="bg-gray-800 rounded-xl p-6 animate-slideUp" style={{ animationDelay: '300ms' }}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <User className="w-6 h-6 text-amber-500 mr-3" />
              Account
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="w-full p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors flex items-center"
              >
                <LogOut className="w-5 h-5 text-amber-500 mr-3" />
                <span className="text-gray-300">Sign Out</span>
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-colors flex items-center"
              >
                <Trash2 className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-red-500">Delete Account</span>
              </button>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex items-center justify-end space-x-4">
            {saveSuccess && (
              <span className="flex items-center text-green-500">
                <Check className="w-5 h-5 mr-1" />
                Saved!
              </span>
            )}
            <button
              onClick={saveSettings}
              disabled={saving}
              className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full animate-slideUp">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
              <h3 className="text-xl font-bold text-white">Delete Account</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            
            <div className="mb-4">
              <label className="block text-gray-400 mb-2 text-sm">Type DELETE to confirm</label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 outline-none"
              />
            </div>
            
            {deleteError && (
              <p className="text-red-500 text-sm mb-4">{deleteError}</p>
            )}
            
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirm('')
                  setDeleteError('')
                }}
                className="flex-1 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || deleteLoading}
                className="flex-1 p-3 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {deleteLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Delete Account'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
