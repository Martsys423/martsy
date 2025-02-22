import { supabase } from '@/app/utils/supabase'

// Move from utils/supabase.js and centralize all Supabase operations
export const dbService = {
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        name: userData.name,
        image: userData.image,
        auth_provider: userData.auth_provider,
        last_sign_in: new Date().toISOString(),
      }])
      .single()

    if (error) throw error
    return data
  },
  
  async updateUser(userId, data) {
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', userId)
      .single()

    if (error) throw error
    return updatedUser
  },

  async getUser(email) {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single()

    if (error) throw error
    return data
  }
} 