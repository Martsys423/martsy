import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/config'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    console.log('[Vercel] GET /api/keys - Session:', session)

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerSupabase()
    console.log('[Vercel] Supabase client created')

    // Get the user's ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    console.log('[Vercel] User lookup result:', { userData, userError })

    if (userError || !userData) {
      console.error('[Vercel] User error:', userError)
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Get their API keys
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false })

    console.log('[Vercel] API keys result:', { data, error })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('[Vercel] Error in GET /api/keys:', error)
    return NextResponse.json({ 
      message: 'Failed to fetch API keys',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 