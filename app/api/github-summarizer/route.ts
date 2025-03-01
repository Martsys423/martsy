import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // Get API key from header
    const apiKey = req.headers.get('x-api-key')
    
    // Add CORS headers
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',  // Added x-api-key
    })

    // Validate API key
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        success: false,
        message: "API key is required",
        error: "Missing API key"
      }), {
        status: 401,
        headers
      })
    }

    // Verify API key in database
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single()

    if (error || !data) {
      return new Response(JSON.stringify({ 
        success: false,
        message: "Invalid API key",
        error: "Invalid API key"
      }), {
        status: 401,
        headers
      })
    }

    // Get request body
    const body = await req.json()
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

    // TODO: Add your GitHub repository analysis logic here
    // For now, return a mock response
    return new Response(JSON.stringify({
      success: true,
      message: "Repository analyzed successfully",
      data: {
        url: githubURL,
        // Add your analysis results here
      }
    }), {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('Error in GitHub summarizer:', error)
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