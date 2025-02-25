import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/config'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data.map(key => ({
      id: key.id,
      name: key.name,
      key: key.key,
      created_at: key.created_at,
      user_id: key.user_id,
      monthly_limit: key.monthly_limit
    })))
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
} 