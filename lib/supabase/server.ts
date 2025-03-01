import { createClient } from '@supabase/supabase-js'

export function createServerSupabase() {
  console.log('Creating Supabase client with:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 10) + '...',
    serviceRoleKey: process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY ? 'exists' : 'missing'
  })

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables')
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  return supabase
} 