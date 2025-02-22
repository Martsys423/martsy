import { NextResponse } from 'next/server'
import { githubService } from '@/app/services/github'
import { handleAPIError } from '@/app/utils/error-handler'
import { HTTP_STATUS } from '@/app/constants'

export async function POST(request) {
  console.log('\n=== GitHub Summarizer API route called ===')

  try {
    // Get request data
    const apiKey = request.headers.get('x-api-key')
    const { githubUrl } = await request.json()
    
    console.log('Received API key:', apiKey ? '✓ Present' : '✗ Missing')
    console.log('Received GitHub URL:', githubUrl)

    // Validate request
    await githubService.validateRequest(apiKey, githubUrl)

    // Analyze repository
    console.log('\n🤖 Starting repository analysis...')
    const { content, analysis } = await githubService.analyzeRepository(githubUrl)

    // Log success
    console.log('\n📄 README Preview (first 500 chars):')
    console.log('----------------------------------------')
    console.log(content.substring(0, 500))
    console.log('----------------------------------------')
    console.log('✨ Analysis complete!')

    return NextResponse.json({
      success: true,
      message: "Successfully analyzed repository",
      analysis
    })

  } catch (error) {
    console.log('❌ Error:', error.message)
    const errorResponse = handleAPIError(error)
    
    return NextResponse.json({
      success: false,
      message: errorResponse.message,
      error: error.message
    }, { 
      status: error.statusCode || HTTP_STATUS.SERVER_ERROR 
    })
  }
} 