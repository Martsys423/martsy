import { createClient } from '@supabase/supabase-js'
import { APIError } from '@/app/utils/error-handler'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/app/constants'

// Define user interface
interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export const userService = {
  async getUserById(userId: string): Promise<User | null> {
    if (!userId) {
      throw new APIError(
        'User ID is required',
        HTTP_STATUS.BAD_REQUEST
      )
    }
    
    // Connect to Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    // Fetch user from database
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Database error fetching user:', error)
      throw new APIError(
        ERROR_MESSAGES.DATABASE_ERROR,
        HTTP_STATUS.SERVER_ERROR
      )
    }
    
    return data as User | null
  },
  
  async updateUser(userId: string, userData: Partial<User>) {
    if (!userId) {
      throw new APIError(
        'User ID is required',
        HTTP_STATUS.BAD_REQUEST
      )
    }
    
    // Connect to Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    // Update user in database
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('Database error updating user:', error)
      throw new APIError(
        ERROR_MESSAGES.DATABASE_ERROR,
        HTTP_STATUS.SERVER_ERROR
      )
    }
    
    return {
      success: true,
      user: data as User
    }
  },
  
  async getUserUsage(userId: string) {
    // Placeholder for usage tracking
    return {
      apiCalls: 0,
      lastUsed: new Date().toISOString(),
      remainingCredits: 100
    }
  }
} 