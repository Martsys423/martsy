import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  // Debug Supabase connection
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('API route called')

  try {
    const body = await request.json()
    const { apiKey } = body

    // Validate the API key
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          valid: false,
          message: "API key is required"
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
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
    
    try {
      // Query Supabase to check if the API key exists
      const { data, error } = await supabase
        .from('api_keys')
        .select('id')
        .eq('key', apiKey)

      console.log('Supabase response:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json({ 
          valid: false, 
          message: 'Error validating API key',
          error: error.message 
        }, { status: 500 })
      }

      // Check if we found a matching key
      const isValid = Array.isArray(data) && data.length > 0
      console.log('Validation result:', { isValid, dataLength: data?.length })

      if (isValid) {
        return new Response(
          JSON.stringify({
            valid: true,
            message: "API key is valid"
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      } else {
        return new Response(
          JSON.stringify({
            valid: false,
            message: "Invalid API key"
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }

    } catch (supabaseError) {
      console.error('Supabase query error:', supabaseError)
      return NextResponse.json({ 
        valid: false, 
        message: 'Database query error',
        error: supabaseError.message
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error in API route:', error)
    return new Response(
      JSON.stringify({
        valid: false,
        message: "Error processing request",
        error: error.message
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 