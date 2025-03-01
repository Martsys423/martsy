import { createServerSupabase } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')

    return new Response(JSON.stringify({
      success: true,
      keys: data?.map(k => ({
        name: k.name,
        key: k.key,
        keyLength: k.key.length
      }))
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: String(error)
    }), {
      status: 500
    })
  }
} 