import { Suspense } from 'react'
import { Providers } from '@/components/Providers'
import SearchContent from '@/components/SearchContent'

export default function SearchPage() {
  return (
    <Providers>
      <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>}>
        <SearchContent />
      </Suspense>
    </Providers>
  )
}
