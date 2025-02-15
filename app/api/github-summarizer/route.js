import { NextResponse } from 'next/server'
import { createAnalysisChain } from './chain'
import { getGitHubReadme, validateGitHubUrl } from './github'
import { validateApiKey } from './validation'

export async function POST(request) {
  console.log('\n=== GitHub Summarizer API route called ===')

  try {
    // Get and validate API key
    const apiKey = request.headers.get('x-api-key')
    console.log('Received API key:', apiKey ? '✓ Present' : '✗ Missing')
    
    const apiKeyValidation = await validateApiKey(apiKey)
    if (!apiKeyValidation.isValid) {
      console.log('❌ API Key validation failed:', apiKeyValidation.message)
      return NextResponse.json({
        success: false,
        message: apiKeyValidation.message,
        error: apiKeyValidation.error
      }, { status: apiKeyValidation.status })
    }

    // Get and validate GitHub URL
    const body = await request.json()
    const { githubUrl } = body
    console.log('Received GitHub URL:', githubUrl)

    const urlValidation = validateGitHubUrl(githubUrl)
    if (!urlValidation.isValid) {
      console.log('❌ URL validation failed:', urlValidation.message)
      return NextResponse.json({
        success: false,
        message: urlValidation.message
      }, { status: 400 })
    }

    // Fetch README content
    console.log('\n📚 Starting README fetch...')
    const readmeResult = await getGitHubReadme(githubUrl)
    
    if (!readmeResult.success) {
      console.log('❌ Error fetching README:', readmeResult.error)
      return NextResponse.json({
        success: false,
        message: "Failed to fetch README",
        error: readmeResult.error
      }, { status: 500 })
    }

    // Print README preview
    console.log('\n📄 README Preview (first 500 chars):')
    console.log('----------------------------------------')
    console.log(readmeResult.content.substring(0, 500))
    console.log('----------------------------------------')

    // Analyze repository
    console.log('\n🤖 Starting repository analysis...')
    const chain = createAnalysisChain()
    const analysis = await chain.invoke({
      readme: readmeResult.content
    })
    console.log('✨ Analysis complete!')

    return NextResponse.json({
      success: true,
      message: "Successfully analyzed repository",
      analysis
    })

  } catch (error) {
    console.log('❌ General error:', error.message)
    return NextResponse.json({
      success: false,
      message: "Error processing request",
      error: error.message
    }, { status: 400 })
  }
} 