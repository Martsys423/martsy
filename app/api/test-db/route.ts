import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    console.log('Testing Supabase connection...')
    const supabase = createServerSupabase()
    
    // First get all keys to debug
    const { data: keys, error: keysError } = await supabase
      .from('api_keys')
      .select('*')

    if (keysError) {
      console.error('Error fetching keys:', keysError)
      throw keysError
    }

    // Log each key for debugging
    console.log('Found keys:', keys?.map(k => ({
      name: k.name,
      key: k.key,
      keyLength: k.key.length
    })))

    return new Response(JSON.stringify({
      success: true,
      keysFound: keys?.length || 0,
      envCheck: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 10) + '...',
        serviceRole: process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY ? 'present' : 'missing'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Test DB Error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 