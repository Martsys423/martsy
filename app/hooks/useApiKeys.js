import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchKeys = useCallback(async () => {
    if (isLoading) return
    
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setApiKeys(data || [])
    } catch (error) {
      console.error('Error fetching keys:', error)
      toast.error('Failed to load API keys')
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const createKey = async (newKeyName, monthlyLimit, limitEnabled) => {
    setIsLoading(true)
    try {
      const newKey = {
        name: newKeyName,
        key: `martsy-${Math.random().toString(36).substr(2, 24)}`,
        usage: '0%',
        monthly_limit: limitEnabled ? parseInt(monthlyLimit) : null
      }

      const { error } = await supabase
        .from('api_keys')
        .insert([newKey])

      if (error) throw error

      await fetchKeys()
      toast.success('API key created successfully!')
      return true
    } catch (error) {
      console.error('Failed to create API key:', error)
      toast.error('Failed to create API key: ' + error.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const deleteKey = async (id) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchKeys()
      toast.success('API key deleted successfully!')
      return true
    } catch (error) {
      console.error('Failed to delete API key:', error)
      toast.error('Failed to delete API key: ' + error.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateKeyName = async (id, newName) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ name: newName })
        .eq('id', id)

      if (error) throw error

      await fetchKeys()
      toast.success('API key name updated!')
      return true
    } catch (error) {
      console.error('Failed to update API key name:', error)
      toast.error('Failed to update API key name: ' + error.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    apiKeys,
    isLoading,
    fetchKeys,
    createKey,
    deleteKey,
    updateKeyName
  }
} 