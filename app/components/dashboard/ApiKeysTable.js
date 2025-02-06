'use client'

import { useState } from 'react'
import { FiEye, FiCopy, FiEdit2, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ApiKeysTable({ apiKeys, isLoading, onDelete, onEditName }) {
  const [showKey, setShowKey] = useState(null)

  const handleCopyKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key)
      toast.success('API key copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy key:', error)
      toast.error('Failed to copy key to clipboard')
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-6 py-3 text-sm font-medium text-gray-500">NAME</th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500">USAGE</th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500">KEY</th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500">OPTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {isLoading ? (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                Loading API keys...
              </td>
            </tr>
          ) : apiKeys.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                No API keys found. Create one to get started.
              </td>
            </tr>
          ) : (
            apiKeys.map((apiKey) => (
              <tr key={apiKey.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{apiKey.name}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {apiKey.usage}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-gray-900">
                  {showKey === apiKey.id ? apiKey.key : `martsy-${'•'.repeat(24)}`}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                      className="text-gray-600 hover:text-gray-900 p-1"
                      title="View Key"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopyKey(apiKey.key)}
                      className="text-gray-600 hover:text-gray-900 p-1"
                      title="Copy Key"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditName(apiKey.id, apiKey.name)}
                      className="text-gray-600 hover:text-gray-900 p-1"
                      title="Edit Name"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(apiKey.id)}
                      className="text-gray-600 hover:text-gray-900 p-1"
                      title="Delete Key"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
} 