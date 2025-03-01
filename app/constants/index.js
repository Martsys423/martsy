export const AUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github'
}

export const API_ROUTES = {
  GITHUB_SUMMARY: '/api/github-summarizer',
  AUTH: '/api/auth',
  USER: '/api/user'
}

export const ERROR_MESSAGES = {
  INVALID_API_KEY: 'Invalid API key',
  MISSING_GITHUB_URL: 'GitHub URL is required',
  DATABASE_ERROR: 'Database error',
  SERVER_ERROR: 'Server error',
  VALIDATION_ERROR: 'Validation error'
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} 