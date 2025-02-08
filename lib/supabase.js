import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey
  })
  throw new Error('Missing Supabase environment variables')
}

const options = {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: { 'x-my-custom-header': 'my-app-name' },
  },
}

let supabase

try {
  console.log('Initializing Supabase client...')
  supabase = createClient(supabaseUrl, supabaseKey, options)
  console.log('Supabase client initialized successfully')
} catch (error) {
  console.error('Error initializing Supabase client:', error)
  throw error
}

export { supabase }
