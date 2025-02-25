'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/utils/supabase'
import toast from 'react-hot-toast'
import { ApiKey } from '@/components/dashboard/ApiKeysTable'

interface ApiKeyFromDB {
  id: string
  name: string
  key: string
  usage?: string
  created_at: string
  last_used?: string
  user_id?: string
  monthly_limit?: number
}

interface TransformedApiKey {
  id: string
  name: string
  key: string
  usage?: string
  createdAt: string
  lastUsed?: string
  user_id?: string
  monthly_limit?: number
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)

  const transformApiKey = (key: ApiKeyFromDB): ApiKey => ({
    id: key.id,
    name: key.name,
    key: key.key,
    created_at: key.created_at,
    user_id: key.user_id,
    monthly_limit: key.monthly_limit
  })

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    try {
      const response = await fetch('/api/keys')
      if (!response.ok) throw new Error('Failed to fetch API keys')
      const data = await response.json()
      setApiKeys(data.map(transformApiKey))
    } catch (error) {
      console.error('Error fetching API keys:', error)
      toast.error('Failed to load API keys')
    } finally {
      setLoading(false)
    }
  }

  const createKey = async (name: string, limit: string, limitEnabled: boolean) => {
    try {
      console.log('Creating key:', { name, limit, limitEnabled })
      const { data, error } = await supabase
        .from('api_keys')
        .insert([
          {
            name,
            monthly_limit: limitEnabled ? parseInt(limit) : null,
            key: `martsy-${generateRandomKey()}`,
          },
        ])
        .select()

      if (error) throw error
      
      await fetchKeys()
      toast.success('API key created successfully')
      return true
    } catch (error) {
      console.error('Error creating API key:', error)
      toast.error('Failed to create API key')
      return false
    }
  }

  const generateRandomKey = () => {
    return Math.random().toString(36).substring(2) + 
           Math.random().toString(36).substring(2)
  }

  const deleteKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchKeys()
    } catch (error) {
      console.error('Error deleting API key:', error)
    }
  }

  const updateKeyName = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ name })
        .eq('id', id)

      if (error) throw error
      await fetchKeys()
    } catch (error) {
      console.error('Error updating API key name:', error)
    }
  }

  return {
    apiKeys,
    loading,
    createKey,
    deleteKey,
    updateKeyName,
  }
} 