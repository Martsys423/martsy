import { NextResponse } from 'next/server'
import { githubService } from '@/app/services/github'
import { createApiResponse, createErrorResponse } from '@/app/utils/api-response'
import { APIError } from '@/app/utils/error-handler'
import { z } from 'zod'

// Define the request schema
const githubRequestSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  githubURL: z.string().url('Invalid GitHub URL')
})

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json()
    
    // Get API key from header if not in body
    const apiKeyFromHeader = req.headers.get('x-api-key')
    const apiKey = body.apiKey || apiKeyFromHeader
    const githubURL = body.githubURL
    
    // Validate required fields
    if (!apiKey) {
      return createErrorResponse('API key is required', 400)
    }
    
    if (!githubURL) {
      return createErrorResponse('GitHub URL is required', 400)
    }
    
    console.log('Received request for GitHub summarizer:', {
      apiKeyProvided: !!apiKey,
      apiKeyLength: apiKey?.length,
      githubURL
    })

    // Validate API key and analyze repository
    await githubService.validateRequest(apiKey, githubURL)
    
    // If validation successful, analyze the repository
    const analysis = await githubService.analyzeRepository(githubURL)
    
    // Remove content field if it exists
    if (analysis && 'content' in analysis) {
      const { content, ...rest } = analysis as any
      return createApiResponse({ analysis: rest }, true, 'Repository analyzed successfully')
    }
    
    return createApiResponse({ analysis }, true, 'Repository analyzed successfully')
  } catch (error) {
    console.error('Error in GitHub summarizer:', error)
    
    if (error instanceof APIError) {
      return createErrorResponse(error.message, error.statusCode)
    }
    
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to analyze repository',
      500
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    }
  })
} 