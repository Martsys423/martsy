import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  // Check environment variables
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('Environment check:', { hasUrl, hasKey })

  // Only throw during development
  if (!hasUrl || !hasKey) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('Missing Supabase environment variables')
    }
    // In production, return error response instead of throwing
    return NextResponse.json({ 
      valid: false, 
      message: 'Configuration error' 
    }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { apiKey } = body

    if (!apiKey) {
      return NextResponse.json({ 
        valid: false, 
        message: 'API key is required' 
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('id')
      .eq('key', apiKey)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        valid: false, 
        message: 'Database error',
        error: error.message 
      }, { status: 500 })
    }

    const isValid = Array.isArray(data) && data.length > 0

    return NextResponse.json({ 
      valid: isValid,
      message: isValid ? 'API key is valid' : 'Invalid API key'
    }, { status: isValid ? 200 : 401 })

  } catch (error) {
    console.error('Request error:', error)
    return NextResponse.json({ 
      valid: false, 
      message: 'Error processing request',
      error: error.message
    }, { status: 400 })
  }
} 