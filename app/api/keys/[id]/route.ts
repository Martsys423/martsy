import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/config'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerSupabase()

    // First get the user's ID from their email
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (!userData) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Delete the API key only if it belongs to the user
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userData.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting API key:', error)
    return NextResponse.json({ 
      message: 'Failed to delete API key',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const supabase = createServerSupabase()

    // First get the user's ID from their email
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (!userData) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Update the API key only if it belongs to the user
    const { data, error } = await supabase
      .from('api_keys')
      .update(body)
      .eq('id', params.id)
      .eq('user_id', userData.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating API key:', error)
    return NextResponse.json({ 
      message: 'Failed to update API key',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 