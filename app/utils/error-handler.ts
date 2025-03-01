import { HTTP_STATUS } from '@/app/constants'

export class APIError extends Error {
  statusCode: number;
  code?: string;
  details?: any;

  constructor(
    message: string, 
    statusCode = HTTP_STATUS.SERVER_ERROR, 
    code?: string, 
    details?: any
  ) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
        details: this.details
      }
    };
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);
  
  if (error instanceof APIError) {
    return {
      success: false,
      message: error.message,
      code: error.code,
      details: error.details,
      status: error.statusCode
    };
  }
  
  return {
    success: false,
    message: error instanceof Error ? error.message : 'Unknown error occurred',
    status: HTTP_STATUS.SERVER_ERROR
  };
} 