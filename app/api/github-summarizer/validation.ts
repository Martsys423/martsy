import { createServerSupabase } from '@/lib/supabase/server'
import { HTTP_STATUS } from '@/app/constants'

interface ValidationResult {
  isValid: boolean
  message: string
  status: number
}

export async function validateApiKey(apiKey: string): Promise<ValidationResult> {
  console.log('\n=== API Key Validation Start ===')
  console.log('Validating key:', { key: apiKey, length: apiKey?.length })

  if (!apiKey) {
    return {
      isValid: false,
      message: "API key is required",
      status: HTTP_STATUS.UNAUTHORIZED
    }
  }

  try {
    const supabase = createServerSupabase()

    // Get all keys first for direct comparison
    const { data: allKeys } = await supabase
      .from('api_keys')
      .select('key, name')

    console.log('All keys from DB:', allKeys?.map(k => ({
      name: k.name,
      key: k.key,
      keyLength: k.key.length,
      matches: k.key === apiKey,
      // Compare character by character
      charDiff: Array.from(k.key).map((char, i) => 
        char === apiKey[i] ? null : `Pos ${i}: DB=${char}, Input=${apiKey[i]}`)
        .filter(Boolean)
    })))

    // Get exact match
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .maybeSingle()

    console.log('Validation query result:', {
      found: !!data,
      error: error?.message || 'none'
    })

    // If error, log it and return
    if (error) {
      console.error('Database error during validation:', error)
      return {
        isValid: false,
        message: "Database error during validation",
        status: HTTP_STATUS.SERVER_ERROR
      }
    }

    // If no match found
    if (!data) {
      return {
        isValid: false,
        message: "Invalid API key",
        status: HTTP_STATUS.UNAUTHORIZED
      }
    }

    // Key found and valid
    console.log('API key validated successfully')
    console.log('=== API Key Validation End ===\n')

    return {
      isValid: true,
      message: "Valid API key",
      status: HTTP_STATUS.OK
    }
  } catch (error) {
    console.error('Unexpected error during validation:', error)
    return {
      isValid: false,
      message: "Error validating API key",
      status: HTTP_STATUS.SERVER_ERROR
    }
  }
} 