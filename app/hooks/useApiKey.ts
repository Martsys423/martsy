import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { ApiKeyResponse } from '@/app/types/api'

export function useApiKey() {
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeys, setApiKeys] = useState<ApiKeyResponse[]>([])

  const fetchApiKeys = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/keys')
      const data = await response.json()
      
      if (data.success) {
        setApiKeys(data.data)
      } else {
        toast.error(data.message || 'Failed to fetch API keys')
      }
    } catch (error) {
      console.error('Error fetching API keys:', error)
      toast.error('Error fetching API keys')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createApiKey = useCallback(async (name: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('API key created successfully')
        return data.data
      } else {
        toast.error(data.message || 'Failed to create API key')
        return null
      }
    } catch (error) {
      console.error('Error creating API key:', error)
      toast.error('Error creating API key')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteApiKey = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('API key deleted successfully')
        return true
      } else {
        toast.error(data.message || 'Failed to delete API key')
        return false
      }
    } catch (error) {
      console.error('Error deleting API key:', error)
      toast.error('Error deleting API key')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    apiKeys,
    isLoading,
    fetchApiKeys,
    createApiKey,
    deleteApiKey
  }
} 