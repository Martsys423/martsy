export class APIError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

export const handleAPIError = (error) => {
  console.error('API Error:', error)
  // Add proper error handling logic
} 