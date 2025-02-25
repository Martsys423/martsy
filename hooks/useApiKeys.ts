'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/utils/supabase'
import toast from 'react-hot-toast'

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed?: string
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setApiKeys(data || [])
    } catch (error) {
      console.error('Error fetching API keys:', error)
      toast.error('Failed to fetch API keys')
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
      
      await fetchApiKeys()
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
      await fetchApiKeys()
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
      await fetchApiKeys()
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