'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import toast from 'react-hot-toast'

export default function ProtectedPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const apiKey = searchParams.get('apiKey')

  useEffect(() => {
    const verifyApiKey = async () => {
      if (!apiKey) {
        toast.error('No API key provided')
        router.push('/playground')
        return
      }

      try {
        const response = await fetch('/api/validate-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apiKey }),
        })

        const data = await response.json()

        if (response.ok && data.valid) {
          setIsAuthorized(true)
          toast.success('API key verified')
        } else {
          toast.error(data.message || 'Invalid API key')
          router.push('/playground')
        }
      } catch (error) {
        console.error('Error verifying API key:', error)
        toast.error('Error verifying API key')
        router.push('/playground')
      } finally {
        setIsLoading(false)
      }
    }

    verifyApiKey()
  }, [apiKey, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Verifying API key...</div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null // Router will redirect
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-8">
          <h1 className="text-2xl font-semibold mb-4">Protected Page</h1>
          <p className="text-gray-600 mb-4">
            This page is only accessible with a valid API key.
          </p>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Your API Key Information</h2>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
              <code>{apiKey}</code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  )
} 