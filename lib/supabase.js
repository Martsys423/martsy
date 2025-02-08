import { createClient } from '@supabase/supabase-js'

// Default to empty strings if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create client even if env vars are missing (will fail gracefully)
export const supabase = createClient(supabaseUrl, supabaseKey)

// Add a helper function to check if config is valid
export const isSupabaseConfigured = () => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
         !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}
