// This is a placeholder file to satisfy TypeScript
import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse(
    JSON.stringify({ message: 'This endpoint is deprecated' }),
    { status: 410, headers: { 'Content-Type': 'application/json' } }
  )
}
