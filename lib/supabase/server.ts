import { createClient } from '@supabase/supabase-js'

export const createServerSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY

  console.log('Environment Variables Debug:')
  console.log('URL:', supabaseUrl ? 'exists' : 'missing')
  console.log('Key:', supabaseKey ? 'exists' : 'missing')
  console.log('Key value first 10 chars:', supabaseKey?.substring(0, 10))

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(`Missing Supabase environment variables: ${!supabaseUrl ? 'URL' : ''} ${!supabaseKey ? 'Key' : ''}`)
  }

  return createClient(supabaseUrl, supabaseKey)
} 