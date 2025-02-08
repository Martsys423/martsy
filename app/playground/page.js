'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../components/Sidebar'
import toast, { Toaster } from 'react-hot-toast'

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    console.log('Validating API key:', apiKey)

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()
      console.log('API Response:', { 
        status: response.status, 
        data 
      })

      if (response.ok && data.valid) {
        toast.success('Valid API Key, /protected can be accessed')
        router.push('/protected')
      } else {
        toast.error(data.message || 'Invalid API Key')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error('Error validating API key')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <Toaster position="bottom-right" />
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">API Playground</h1>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Validate Your API Key
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  placeholder="Enter your API key"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Validating...' : 'Validate Key'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
} 