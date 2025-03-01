import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const key = url.searchParams.get('key') || 'martsy_-cuZ-280DQmFGYFwiq81IEhlRGmHMvDu'
    
    console.log('Testing specific key:', key)
    const supabase = createServerSupabase()
    
    // Direct query
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', key)
      .maybeSingle()

    // Get all keys for comparison
    const { data: allKeys } = await supabase
      .from('api_keys')
      .select('key, name')

    // Find closest match
    const keyComparisons = allKeys?.map(k => ({
      name: k.name,
      key: k.key,
      exactMatch: k.key === key,
      similarity: Array.from(k.key).filter((c, i) => c === key[i]).length / Math.max(k.key.length, key.length)
    })).sort((a, b) => b.similarity - a.similarity)

    return new Response(JSON.stringify({
      success: true,
      testKey: key,
      keyLength: key.length,
      keyFound: !!data,
      keyData: data,
      error: error?.message || null,
      closestMatches: keyComparisons?.slice(0, 3)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Test key error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 