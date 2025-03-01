import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/config'

export async function POST(req: Request) {
  // Create headers using the Headers class - moved outside try block
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })

  try {
    const body = await req.json()
    const { apiKey } = body
    
    // Add detailed logging
    console.log('Received API key:', apiKey)
    console.log('API key length:', apiKey?.length)
    console.log('API key characters:', Array.from(apiKey || '').join(' '))

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        message: "API key is required",
        debug: { received: apiKey }
      }), {
        status: 400,
        headers
      })
    }

    console.log('Querying Supabase for key:', apiKey)
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single()
    
    console.log('Supabase response:', { data, error })

    // Add query debug info to response
    if (error || !data) {
      return new Response(JSON.stringify({ 
        message: "Unauthorized",
        debug: { 
          receivedKey: apiKey,
          keyLength: apiKey.length,
          error: error?.message
        }
      }), {
        status: 401,
        headers
      })
    }

    return new Response(JSON.stringify({ 
      message: "Valid API key",
      debug: { 
        receivedKey: apiKey,
        matchedKey: data.key
      }
    }), {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('Validation error:', error)
    return new Response(JSON.stringify({ 
      message: "Internal server error",
      debug: { error: error instanceof Error ? error.message : String(error) }
    }), {
      status: 500,
      headers  // Now headers is accessible here
    })
  }
} 