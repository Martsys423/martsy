import { NextResponse } from 'next/server'

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
}

export function createApiResponse<T = any>(
  data: T | null = null, 
  success = true, 
  message = 'Success', 
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success,
    message,
    ...(data !== null && { data })
  }, { status })
}

export function createErrorResponse(
  message = 'An error occurred', 
  status = 500
): NextResponse<ApiResponse<null>> {
  return NextResponse.json({
    success: false,
    message
  }, { status })
} 