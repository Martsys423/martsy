'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export function GitHubApiDemo() {
  const defaultRequest = JSON.stringify({
    "githubURL": "https://github.com/assafelovic/gpt-researcher"
  }, null, 2)
  
  // Example response data to show by default
  const exampleResponse = {
    "success": true,
    "message": "Repository analyzed successfully",
    "data": {
      "analysis": {
        "summary": "GPT Researcher is an autonomous agent designed to perform comprehensive online research on a given topic. It uses a combination of web searches, content extraction, and LLM processing to generate detailed research reports.",
        "coolFacts": [
          "It can autonomously search the web and compile information without human intervention",
          "Uses a specialized agent system to break down complex research tasks into manageable steps",
          "Can generate professional research reports with citations and references"
        ],
        "mainTechnologies": [
          "Python",
          "OpenAI API",
          "Langchain",
          "Selenium"
        ],
        "targetAudience": "Researchers, students, professionals, and anyone needing to gather comprehensive information on specific topics"
      }
    }
  }
  
  const [requestPayload, setRequestPayload] = useState(defaultRequest)
  const [responseData, setResponseData] = useState<any>(exampleResponse)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      let payload
      try {
        payload = JSON.parse(requestPayload)
      } catch (e) {
        throw new Error("Invalid JSON format")
      }
      
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to analyze repository')
      }
      
      setResponseData(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setResponseData(exampleResponse) // Keep example data on error
    } finally {
      setIsLoading(false)
    }
  }

  const resetDemo = () => {
    setRequestPayload(defaultRequest)
    setResponseData(exampleResponse)
    setError(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Request Panel */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">API Request</h3>
              <p className="text-sm text-gray-500 mb-4">Edit the payload and send a request</p>
              <Textarea
                value={requestPayload}
                onChange={(e) => setRequestPayload(e.target.value)}
                className="font-mono h-64 resize-none"
              />
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <Button 
                variant="outline" 
                onClick={resetDemo}
                className="text-gray-700"
              >
                Reset
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                  asChild
                >
                  <a href="/docs/api" target="_blank">Documentation</a>
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Send Request'
                  )}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Response Panel */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">API Response</h3>
          <p className="text-sm text-gray-500 mb-4">View the response from the API</p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-md">
            <pre className="p-4 font-mono text-sm overflow-auto h-64 text-gray-800 whitespace-pre-wrap break-words">
              {responseData ? (
                JSON.stringify(responseData, null, 2)
              ) : (
                "// Response will appear here after you send a request"
              )}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 