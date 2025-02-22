"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKeys() {
      try {
        const { data, error } = await supabase
          .from('api_keys')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setApiKeys(data || []);
      } catch (error) {
        console.error('Error fetching keys:', error);
        toast.error("Failed to load API keys");
      } finally {
        setLoading(false);
      }
    }

    fetchKeys();
  }, []);

  const createKey = async (newKeyName, monthlyLimit, limitEnabled) => {
    try {
      setLoading(true);
      const newKey = {
        name: newKeyName,
        key: `martsy-${Math.random().toString(36).substr(2, 24)}`,
        usage: '0%',
        monthly_limit: limitEnabled ? parseInt(monthlyLimit) : null
      };

      const { error } = await supabase
        .from('api_keys')
        .insert([newKey]);

      if (error) throw error;

      toast.success('API key created successfully!');
      return true;
    } catch (error) {
      console.error('Failed to create API key:', error);
      toast.error('Failed to create API key: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteKey = async (id) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('API key deleted successfully!');
      return true;
    } catch (error) {
      console.error('Failed to delete API key:', error);
      toast.error('Failed to delete API key: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateKeyName = async (id, newName) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('api_keys')
        .update({ name: newName })
        .eq('id', id);

      if (error) throw error;

      toast.success('API key name updated!');
      return true;
    } catch (error) {
      console.error('Failed to update API key name:', error);
      toast.error('Failed to update API key name: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { apiKeys, loading, createKey, deleteKey, updateKeyName };
} 