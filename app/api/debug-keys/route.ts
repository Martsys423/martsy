// This is a placeholder file to satisfy TypeScript
// It will be removed in a future update

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  return new NextResponse(
    JSON.stringify({ message: 'This endpoint is deprecated' }),
    { 
      status: 410,
      headers: { 'Content-Type': 'application/json' }
    }
  )
} 