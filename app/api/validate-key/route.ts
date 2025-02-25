import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/config'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { apiKey } = await request.json()
    if (!apiKey) {
      return NextResponse.json({ message: 'API key is required' }, { status: 400 })
    }

    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single()

    if (error || !data) {
      return NextResponse.json({ message: 'Invalid API key' }, { status: 400 })
    }

    return NextResponse.json({ 
      valid: true,
      message: 'API key verified successfully'
    })
  } catch (error) {
    console.error('Error validating API key:', error)
    return NextResponse.json({ 
      message: 'Internal Server Error' 
    }, { status: 500 })
  }
} 