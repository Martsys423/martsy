'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { FiCopy, FiEye, FiEyeOff, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

export interface ApiKey {
  id: string
  name: string
  key: string
  created_at?: string
  user_id?: string
  monthly_limit?: number
}

interface ApiKeysTableProps {
  apiKeys: ApiKey[]
  isLoading: boolean
  onDelete: (id: string) => Promise<void>
  onEditName: (id: string, currentName: string) => Promise<void>
}

export default function ApiKeysTable({ apiKeys, isLoading, onDelete, onEditName }: ApiKeysTableProps) {
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({})

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('API key copied to clipboard')
    } catch (err) {
      toast.error('Failed to copy API key')
    }
  }

  if (isLoading) {
    return (
      <CardContent className="p-6">
        <div className="text-center text-gray-500">Loading API keys...</div>
      </CardContent>
    )
  }

  if (!apiKeys?.length) {
    return (
      <CardContent className="p-6">
        <div className="text-center text-gray-500">No API keys found. Create one to get started.</div>
      </CardContent>
    )
  }

  return (
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4 font-medium text-gray-500">Name</th>
              <th className="text-left p-4 font-medium text-gray-500">API Key</th>
              <th className="text-left p-4 font-medium text-gray-500">Created</th>
              <th className="text-right p-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((apiKey) => (
              <tr key={apiKey.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 text-sm">{apiKey.name}</td>
                <td className="p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                      {visibleKeys[apiKey.id] ? apiKey.key : '••••••••••••••••'}
                    </code>
                  </div>
                </td>
                <td className="p-4 text-sm">
                  {new Date(apiKey.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-sm">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="h-8 w-8 p-0"
                    >
                      {visibleKeys[apiKey.id] ? (
                        <FiEyeOff className="h-4 w-4" />
                      ) : (
                        <FiEye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="h-8 w-8 p-0"
                    >
                      <FiCopy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditName(apiKey.id, apiKey.name)}
                      className="h-8 w-8 p-0"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(apiKey.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  )
} 