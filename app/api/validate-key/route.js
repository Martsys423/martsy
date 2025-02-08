import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(request) {
  // Skip environment check in production
  if (process.env.NODE_ENV === 'production' || isSupabaseConfigured()) {
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

  // Return a generic error for unconfigured environments
  return NextResponse.json({ 
    valid: false, 
    message: 'Service not configured' 
  }, { status: 503 })
} 