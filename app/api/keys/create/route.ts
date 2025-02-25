import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/config'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log('POST /api/keys/create - Session:', session)

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { name, monthly_limit } = await request.json()
    console.log('POST /api/keys/create - Request body:', { name, monthly_limit })

    const supabase = createServerSupabase()

    // First get or create the user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    let userId = userData?.id

    // If user doesn't exist, create them
    if (!userData && !userError) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        })
        .select()
        .single()

      if (createError) throw createError
      userId = newUser.id
    }

    if (!userId) {
      throw new Error('Failed to get or create user')
    }

    // Create the API key
    const apiKey = `martsy_${nanoid(32)}`
    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        {
          name,
          key: apiKey,
          monthly_limit: monthly_limit || null,
          user_id: userId,
        },
      ])
      .select()
      .single()

    console.log('POST /api/keys/create - API key created:', data)
    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('POST /api/keys/create - Error:', error)
    return NextResponse.json({ 
      message: 'Failed to create API key',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 