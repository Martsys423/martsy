import { handleAPIError } from '@/app/utils/error-handler'
import { dbService } from './supabase'

export const apiService = {
  async summarizeGithub(url) {
    try {
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      handleAPIError(error)
      throw error
    }
  },
  
  async getUser(email) {
    try {
      return await dbService.getUser(email)
    } catch (error) {
      handleAPIError(error)
      throw error
    }
  }
} 