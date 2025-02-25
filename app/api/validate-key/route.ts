import { NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabase'

export async function POST(request: Request) {
  console.log('API route called')

  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { valid: false, message: 'API key is required' },
        { status: 400 }
      )
    }

    // Debug Supabase client
    if (!supabase) {
      console.error('Supabase client is not initialized')
      return NextResponse.json({ 
        valid: false, 
        message: 'Database connection error' 
      })
    }

    console.log('Querying Supabase...')

    // Query Supabase to check if the API key exists and is valid
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single()

    console.log('Supabase response:', { data, error })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { valid: false, message: 'Invalid API key' },
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      valid: true, 
      message: "API key is valid",
      data 
    })

  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json(
      { valid: false, message: 'Error validating API key' },
      { status: 500 }
    )
  }
} 