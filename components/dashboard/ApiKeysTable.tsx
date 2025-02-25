'use client'

import { FiEye, FiEyeOff, FiCopy, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { Button } from "@/components/ui/button"
import toast from 'react-hot-toast'
import { useState } from 'react'

interface ApiKey {
  id: string
  name: string
  key: string
  usage?: string
}

interface ApiKeysTableProps {
  apiKeys: ApiKey[]
  isLoading: boolean
  onDelete: (id: string) => Promise<void>
  onEditName: (id: string, name: string) => Promise<void>
}

export default function ApiKeysTable({ apiKeys, isLoading, onDelete, onEditName }: ApiKeysTableProps) {
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({})

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('API key copied to clipboard')
  }

  if (isLoading) {
    return <div className="p-6">Loading API keys...</div>
  }

  if (!apiKeys?.length) {
    return <div className="p-6 text-gray-500">No API keys found</div>
  }

  const getHiddenKey = (key: string) => {
    const prefix = key.split('-')[0]
    const rest = key.split('-')[1]
    return `${prefix}-${'*'.repeat(rest.length)}`
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 text-sm font-medium text-gray-500 w-1/4">Name</th>
            <th className="text-left p-4 text-sm font-medium text-gray-500 w-2/5">Key</th>
            <th className="text-left p-4 text-sm font-medium text-gray-500 w-1/6">Created</th>
            <th className="text-left p-4 text-sm font-medium text-gray-500 w-1/6">Last Used</th>
            <th className="text-right p-4 text-sm font-medium text-gray-500 w-1/6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((key) => (
            <tr key={key.id} className="border-b">
              <td className="p-4">{key.name}</td>
              <td className="p-4 font-mono">
                <div className="flex items-center gap-2">
                  {visibleKeys[key.id] 
                    ? key.key
                    : getHiddenKey(key.key)}
                </div>
              </td>
              <td className="p-4">{new Date(key.createdAt).toLocaleDateString()}</td>
              <td className="p-4">
                {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
              </td>
              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleKeyVisibility(key.id)}
                  >
                    {visibleKeys[key.id] ? (
                      <FiEye className="h-4 w-4" />
                    ) : (
                      <FiEyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(key.key)}
                  >
                    <FiCopy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditName(key.id, key.name)}
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(key.id)}
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
  )
} 