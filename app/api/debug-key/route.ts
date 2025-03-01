import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key')
    console.log('Debug - Received API key:', apiKey)

    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)

    return new Response(JSON.stringify({
      success: true,
      apiKey,
      queryResult: { data, error },
      allHeaders: Object.fromEntries(req.headers.entries())
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Debug route error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: String(error)
    }), {
      status: 500
    })
  }
} 