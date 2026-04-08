import { Suspense } from 'react'
import { Providers } from '@/components/Providers'
import BrowseContent from '@/components/BrowseContent'

export default function BrowsePage() {
  return (
    <Providers>
      <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
        <BrowseContent />
      </Suspense>
    </Providers>
  )
}
