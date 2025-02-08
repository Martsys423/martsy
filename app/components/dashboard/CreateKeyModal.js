'use client'

import { useState } from 'react'

export default function CreateKeyModal({ onClose, onSubmit }) {
  const [newKeyName, setNewKeyName] = useState('')
  const [monthlyLimit, setMonthlyLimit] = useState('1000')
  const [limitEnabled, setLimitEnabled] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await onSubmit(newKeyName, monthlyLimit, limitEnabled)
    if (success) {
      handleClose()
    }
  }

  const handleClose = () => {
    setNewKeyName('')
    setMonthlyLimit('1000')
    setLimitEnabled(true)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Create a new API key
        </h2>
        <p className="text-gray-500 mb-6">
          Enter a name and limit for the new API key.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-1">
              <span className="text-gray-700">Key Name</span>
              <span className="text-gray-400 ml-2">— A unique name to identify this key</span>
            </label>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Key Name"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-gray-700 mb-2">
              <input
                type="checkbox"
                checked={limitEnabled}
                onChange={(e) => setLimitEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span>Limit monthly usage*</span>
            </label>
            <input
              type="number"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              disabled={!limitEnabled}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-400"
              placeholder="1000"
              min="1"
            />
          </div>

          <p className="text-gray-400 text-sm mb-8">
            * If the combined usage of all your keys exceeds your plan&apos;s limit, all requests will be rejected.
          </p>

          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 