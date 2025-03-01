import { createServerSupabase } from '@/lib/supabase/server'
import { validateApiKey } from '@/app/api/github-summarizer/validation'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const key = url.searchParams.get('key') || 'martsy_-cuZ-280DQmFGYFwiq81IEhlRGmHMvDu'
    
    console.log('Direct validation test for key:', key)
    
    // Use the same validation function
    const validationResult = await validateApiKey(key)
    
    // Also do a direct DB check
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', key)
      .maybeSingle()
    
    // Character-by-character comparison
    const dbKey = data?.key || ''
    const charComparison = []
    
    if (dbKey) {
      for (let i = 0; i < Math.max(key.length, dbKey.length); i++) {
        if (key[i] !== dbKey[i]) {
          charComparison.push({
            position: i,
            inputChar: key[i],
            inputCharCode: key.charCodeAt(i),
            dbChar: dbKey[i],
            dbCharCode: dbKey.charCodeAt(i)
          })
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      key,
      keyLength: key.length,
      validationResult,
      directDbCheck: {
        found: !!data,
        error: error?.message || null
      },
      charComparison,
      keyInDb: data?.key,
      keyInDbLength: data?.key?.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Validation test error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Add a POST handler for API key validation
export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json()
    
    // Validate API key format
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      return NextResponse.json({
        success: false,
        message: 'Invalid API key format'
      }, { status: 400 })
    }
    
    // Clean the API key
    const cleanApiKey = apiKey.trim()
    
    console.log('Validating API key:', {
      keyLength: cleanApiKey.length,
      keyPrefix: cleanApiKey.substring(0, 7) // Show only prefix for security
    })
    
    // Check API key in database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', cleanApiKey)
      .maybeSingle()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        message: 'Error validating API key'
      }, { status: 500 })
    }
    
    if (!data) {
      return NextResponse.json({
        success: false,
        message: 'Invalid API key'
      }, { status: 401 })
    }
    
    // API key is valid
    return NextResponse.json({
      success: true,
      message: 'API key is valid'
    })
  } catch (error) {
    console.error('Error in validate-key route:', error)
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 })
  }
} 