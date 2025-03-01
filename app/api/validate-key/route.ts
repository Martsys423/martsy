import { createServerSupabase } from '@/lib/supabase/server'
import { validateApiKey } from '@/app/api/github-summarizer/validation'

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
    const body = await req.json();
    const apiKey = body.apiKey;
    
    console.log('Validating API key via POST:', apiKey);
    
    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        message: "API key is required"
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Use direct database check like in the GitHub service
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .maybeSingle();
    
    console.log('API key validation result:', {
      found: !!data,
      error: error?.message || 'none'
    });
    
    if (error) {
      return new Response(JSON.stringify({
        success: false,
        message: "Database error during validation"
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!data) {
      return new Response(JSON.stringify({
        success: false,
        message: "Invalid API key"
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: "Valid API key",
      user: {
        name: data.name,
        id: data.user_id
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('API key validation error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 