import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/config'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    console.log('GET /api/keys - Session:', session) // Debug log

    if (!session?.user?.email) {
      console.log('GET /api/keys - No user email in session') // Debug log
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerSupabase()
    
    // First get the user's ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    console.log('GET /api/keys - User data:', userData) // Debug log
    if (userError) console.log('GET /api/keys - User error:', userError) // Debug log

    if (userError || !userData) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Then get their API keys
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false })

    console.log('GET /api/keys - API keys:', data) // Debug log
    if (error) console.log('GET /api/keys - API keys error:', error) // Debug log

    if (error) {
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('GET /api/keys - Error:', error)
    return NextResponse.json({ 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 