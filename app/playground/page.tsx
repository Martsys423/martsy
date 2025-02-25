'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
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
        toast.success('Valid API Key')
        router.push(`/protected?apiKey=${encodeURIComponent(apiKey)}`)
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
              <Input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Validating...' : 'Validate Key'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
} 