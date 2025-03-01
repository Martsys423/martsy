'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

// Define the type for the analysis result
interface AnalysisResult {
  summary: string;
  coolFacts: string[];
  mainTechnologies: string[];
  targetAudience: string;
  setupComplexity: string;
}

export default function ProtectedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [apiKey, setApiKey] = useState('')
  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [githubUrl, setGithubUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    // Get API key from URL parameters
    const keyFromUrl = searchParams.get('apiKey')
    if (keyFromUrl) {
      setApiKey(keyFromUrl)
      validateApiKey(keyFromUrl)
    } else {
      setIsValidating(false)
      toast.error('No API key provided')
    }
  }, [searchParams])

  const validateApiKey = async (key: string) => {
    setIsValidating(true)
    try {
      console.log('Validating API key on protected page:', key)
      
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key }),
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        setIsValid(true)
        toast.success('API key validated')
      } else {
        setIsValid(false)
        toast.error(data.message || 'Invalid API key')
        // Don't redirect immediately, let the user see the error
        setTimeout(() => {
          router.push('/dashboard/playground')
        }, 3000)
      }
    } catch (error) {
      console.error('Error validating API key:', error)
      setIsValid(false)
      toast.error('Error validating API key')
      setTimeout(() => {
        router.push('/dashboard/playground')
      }, 3000)
    } finally {
      setIsValidating(false)
    }
  }

  const analyzeRepository = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!githubUrl) {
      toast.error('Please enter a GitHub repository URL')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          githubURL: githubUrl,
        }),
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        setAnalysisResult(data.data.analysis)
        toast.success('Repository analyzed successfully')
      } else {
        toast.error(data.message || 'Failed to analyze repository')
      }
    } catch (error) {
      console.error('Error analyzing repository:', error)
      toast.error('Error analyzing repository')
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (isValidating) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Validating API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Invalid API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">The provided API key is invalid or has expired.</p>
            <Button onClick={() => router.push('/dashboard/playground')}>
              Return to Playground
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>GitHub Repository Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={analyzeRepository} className="space-y-4">
            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium mb-1">
                GitHub Repository URL
              </label>
              <Input
                id="githubUrl"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Repository'}
            </Button>
          </form>

          {analysisResult && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Analysis Result</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Summary</h4>
                  <p className="mt-1">{analysisResult.summary}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Cool Facts</h4>
                  <ul className="list-disc pl-5 mt-1">
                    {analysisResult.coolFacts.map((fact, index) => (
                      <li key={index}>{fact}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">Main Technologies</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {analysisResult.mainTechnologies.map((tech, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Target Audience</h4>
                  <p className="mt-1">{analysisResult.targetAudience}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Setup Complexity</h4>
                  <p className="mt-1">{analysisResult.setupComplexity}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 