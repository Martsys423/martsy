export function validateEnv() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_OPENAI_API_KEY',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ]
  
  const missingEnvVars = requiredEnvVars.filter(
    envVar => !process.env[envVar]
  )
  
  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    )
  }
} 