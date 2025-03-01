import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { githubService } from '@/app/services/github'
import { APIError } from '@/app/utils/error-handler'

async function fetchGitHubReadme(url: string) {
  try {
    // Extract owner and repo from GitHub URL
    const urlParts = url.replace('https://github.com/', '').split('/')
    const owner = urlParts[0]
    const repo = urlParts[1]

    // Fetch readme using GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        // Add GitHub token if you have rate limiting issues
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch readme: ${response.statusText}`)
    }

    const readme = await response.text()
    return readme
  } catch (error) {
    console.error('Error fetching GitHub readme:', error)
    return null
  }
}

export async function POST(req: Request) {
  try {
    // Get API key from header
    const apiKey = req.headers.get('x-api-key')
    console.log('Received API key:', apiKey)
    
    // Add CORS headers
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    })

    // Log all headers for debugging
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))

    // Get request body
    const body = await req.json()
    console.log('Request body:', body)
    const { githubURL } = body

    if (!githubURL) {
      return new Response(JSON.stringify({
        success: false,
        message: "GitHub URL is required",
        error: "Missing githubURL in request body"
      }), {
        status: 400,
        headers
      })
    }

    // Use the GitHub service for validation and analysis
    await githubService.validateRequest(apiKey, githubURL)
    const result = await githubService.analyzeRepository(githubURL)

    return new Response(JSON.stringify({
      success: true,
      message: "Repository analyzed successfully",
      data: {
        url: githubURL,
        analysis: {
          summary: result.summary,
          coolFacts: result.coolFacts || [],
          mainTechnologies: result.mainTechnologies || [],
          targetAudience: result.targetAudience,
          setupComplexity: result.setupComplexity
        }
      }
    }), {
      status: 200,
      headers: new Headers({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
      })
    })

  } catch (error: unknown) {
    console.error('Error in GitHub summarizer:', error)
    
    // Type guard for APIError
    if (error instanceof APIError) {
      return new Response(JSON.stringify({
        success: false,
        message: error.message,
        error: error.message
      }), {
        status: error.statusCode,
        headers: new Headers({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
        })
      })
    }

    // Handle unknown errors
    return new Response(JSON.stringify({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
      })
    })
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 204,
    headers: new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    })
  })
} 