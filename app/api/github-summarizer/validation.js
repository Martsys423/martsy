import { supabase } from '@/lib/supabase'

export async function validateApiKey(apiKey) {
  if (!apiKey) {
    return {
      isValid: false,
      message: "API key is required in x-api-key header",
      status: 400
    }
  }

  if (!supabase) {
    return {
      isValid: false,
      message: "Database connection error",
      status: 500
    }
  }

  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('id')
      .eq('key', apiKey)

    if (error) {
      return {
        isValid: false,
        message: "Error validating API key",
        error: error.message,
        status: 500
      }
    }

    const isValid = Array.isArray(data) && data.length > 0
    if (!isValid) {
      return {
        isValid: false,
        message: "Invalid API key",
        status: 401
      }
    }

    return { isValid: true }
  } catch (error) {
    return {
      isValid: false,
      message: "Database query error",
      error: error.message,
      status: 500
    }
  }
} 