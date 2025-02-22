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
  UNAUTHORIZED: 'You must be logged in to access this resource',
  INVALID_REQUEST: 'Invalid request parameters',
  SERVER_ERROR: 'An unexpected error occurred'
}

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} 