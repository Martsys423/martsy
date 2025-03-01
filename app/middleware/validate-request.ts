import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { createErrorResponse, createApiResponse } from '@/app/utils/api-response'

export function validateRequest<T>(
  schema: z.ZodType<T>,
  handler: (req: NextRequest, data: T) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const body = await req.json()
      const data = schema.parse(body)
      return handler(req, data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return createErrorResponse('Validation error', 400)
      }
      
      return createErrorResponse('Invalid request', 400)
    }
  }
}

export async function validateApiKey(apiKey: string) {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    return { valid: false, message: 'Invalid API key format' }
  }
  
  const cleanApiKey = apiKey.trim()
  
  try {
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
      console.error('Database error during API key validation:', error)
      return { valid: false, message: 'Error validating API key' }
    }
    
    return { 
      valid: !!data, 
      message: data ? 'Valid API key' : 'Invalid API key',
      user: data ? { id: data.user_id, name: data.name } : undefined
    }
  } catch (error) {
    console.error('Error in validateApiKey:', error)
    return { valid: false, message: 'Error validating API key' }
  }
} 