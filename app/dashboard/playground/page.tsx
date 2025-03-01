'use client'

import { useState } from 'react'
import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Toaster, toast } from 'react-hot-toast'
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { FiHome, FiKey, FiCode, FiSettings, FiHelpCircle, FiEye, FiEyeOff } from 'react-icons/fi'
import Link from 'next/link'

export default function PlaygroundPage() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin')
    },
  })

  const [apiKey, setApiKey] = useState('')
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [isValidated, setIsValidated] = useState(false)

  const verifyApiKey = async () => {
    if (!apiKey) {
      toast.error('Please enter an API key')
      return false
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'Invalid API key')
        return false
      }

      toast.success('API key verified successfully')
      return true
    } catch (error) {
      console.error('Error validating API key:', error)
      toast.error('Failed to validate API key')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleTest = async () => {
    if (!apiKey) {
      toast.error('Please enter an API key')
      return
    }

    const isValid = await verifyApiKey()
    if (!isValid) return

    // Add your test API call here
    setResponse('API call successful!')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsValidated(false)
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

      if (response.ok && data.success) {
        setIsValidated(true)
        toast.success('Valid API Key')
        
        // Add a slight delay before redirecting to ensure the toast is seen
        setTimeout(() => {
          router.push(`/protected?apiKey=${encodeURIComponent(apiKey)}`)
        }, 1000)
      } else {
        toast.error(data.message || 'Invalid API Key')
        setIsValidated(false)
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error('Error validating API key')
      setIsValidated(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout
      sidebar={
        <div className="space-y-6">
          <div className="px-3 py-2">
            <div className="mb-6 px-4">
              <Link 
                href="/"
                className="inline-block text-2xl font-bold bg-gradient-to-r from-purple-600 via-purple-400 to-blue-300 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Martsys
              </Link>
            </div>
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-sm"
                onClick={() => router.push('/dashboard')}
              >
                <FiHome className="h-4 w-4" /> Overview
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-sm"
                onClick={() => router.push('/dashboard')}
              >
                <FiKey className="h-4 w-4" /> API Keys
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-sm active"
                onClick={() => router.push('/dashboard/playground')}
              >
                <FiCode className="h-4 w-4" /> Playground
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <FiSettings className="h-4 w-4" /> Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <FiHelpCircle className="h-4 w-4" /> Help & Support
              </Button>
            </div>
          </div>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Toaster position="bottom-right" />
        <Card>
          <CardHeader>
            <CardTitle>API Playground</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">API Key</label>
              <div className="flex gap-2 mt-1">
                <div className="relative flex-1">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !apiKey}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {isLoading ? 'Validating...' : 'Validate Key'}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Query</label>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your query here"
                className="mt-1"
                rows={5}
              />
            </div>

            <Button 
              onClick={handleTest} 
              disabled={isLoading || !apiKey}
              className="bg-black text-white hover:bg-gray-800"
            >
              Test API
            </Button>

            {response && (
              <div>
                <label className="text-sm font-medium">Response</label>
                <pre className="bg-gray-100 p-4 rounded-lg mt-1 overflow-auto">
                  {response}
                </pre>
              </div>
            )}

            {isValidated && (
              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
                API key is valid! Redirecting to protected page...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 