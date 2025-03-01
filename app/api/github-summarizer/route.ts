import { NextResponse } from 'next/server'
import { githubService } from '@/app/services/github'
import { createApiResponse, createErrorResponse } from '@/app/utils/api-response'
import { handleApiError } from '@/app/utils/error-handler'
import { z } from 'zod'
import { validateRequest } from '@/app/middleware/validate-request'

const githubRequestSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  githubURL: z.string().url('Invalid GitHub URL')
})

async function handler(req: Request, data: z.infer<typeof githubRequestSchema>) {
  try {
    const { apiKey, githubURL } = data
    
    console.log('Received request for GitHub summarizer:', {
      apiKeyProvided: !!apiKey,
      apiKeyLength: apiKey?.length,
      githubURL
    })

    // Validate API key and analyze repository
    await githubService.validateRequest(apiKey, githubURL)
    
    // If validation successful, analyze the repository
    const analysis = await githubService.analyzeRepository(githubURL)
    
    return createApiResponse({ analysis }, true, 'Repository analyzed successfully')
  } catch (error) {
    console.error('Error in GitHub summarizer:', error)
    const errorResponse = handleApiError(error)
    return createErrorResponse(errorResponse.message, errorResponse.status)
  }
}

export const POST = validateRequest(githubRequestSchema, handler)

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