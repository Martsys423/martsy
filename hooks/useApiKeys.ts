'use client'

import { useState, useEffect } from 'react'
import { ApiKey } from '@/components/dashboard/ApiKeysTable'
import toast from 'react-hot-toast'

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchKeys = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/keys')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch API keys')
      }
      
      const data = await response.json()
      setApiKeys(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load API keys'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKeys()
  }, [])

  const createKey = async (name: string, limit: string, limitEnabled: boolean) => {
    try {
      const response = await fetch('/api/keys/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          monthly_limit: limitEnabled ? parseInt(limit) : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create API key')
      }

      await fetchKeys()
      toast.success('API key created successfully')
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create API key'
      toast.error(message)
      return false
    }
  }

  const deleteKey = async (id: string) => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete API key')
      
      await fetchKeys()
      toast.success('API key deleted successfully')
    } catch (error) {
      console.error('Error deleting API key:', error)
      toast.error('Failed to delete API key')
    }
  }

  const updateKeyName = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) throw new Error('Failed to update API key')
      
      await fetchKeys()
      toast.success('API key name updated successfully')
    } catch (error) {
      console.error('Error updating API key name:', error)
      toast.error('Failed to update API key name')
    }
  }

  return {
    apiKeys,
    loading,
    error,
    createKey,
    deleteKey,
    updateKeyName,
  }
} 