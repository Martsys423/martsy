export class APIError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.name = 'APIError'
  }
}

export const handleAPIError = (error) => {
  console.error('API Error:', error)
  
  // Handle different types of errors
  if (error instanceof APIError) {
    // Handle API-specific errors
    switch (error.statusCode) {
      case 401:
        // Handle unauthorized
        break
      case 404:
        // Handle not found
        break
      default:
        // Handle other status codes
    }
  } else if (error.message === 'Network Error') {
    // Handle network errors
    console.error('Network error occurred')
  } else {
    // Handle other types of errors
    console.error('Unexpected error:', error)
  }

  // You might want to show a toast notification or update UI
  // toast.error('An error occurred. Please try again.')
  
  return {
    error: true,
    message: error.message || 'An unexpected error occurred'
  }
} 