import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/config'

export async function POST(req: Request) {
  try {
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    const body = await req.json()
    const { apiKey } = body
    
    console.log('Received API key:', apiKey)

    if (!apiKey) {
      return new Response(JSON.stringify({ message: "API key is required" }), {
        status: 400
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

    if (error || !data) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401
      })
    }

    return new Response(JSON.stringify({ message: "Valid API key" }), {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('Validation error:', error)
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500
    })
  }
} 