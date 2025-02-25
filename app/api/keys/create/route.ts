import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/config'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { name, monthly_limit } = await request.json()
    const apiKey = `martsy_${nanoid(32)}`

    const supabase = createServerSupabase()
    const { error } = await supabase
      .from('api_keys')
      .insert([
        {
          name,
          key: apiKey,
          monthly_limit,
          user_id: session.user.id,
          created_at: new Date().toISOString(),
        },
      ])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating API key:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
} 