'use client'

import { useState, useEffect } from 'react'
import { FiEye, FiCopy, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import toast, { Toaster } from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import ApiKeysTable from '../components/dashboard/ApiKeysTable'
import CreateKeyModal from '../components/dashboard/CreateKeyModal'
import { useApiKeys } from '../hooks/useApiKeys'

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { apiKeys, isLoading, fetchKeys, createKey, deleteKey, updateKeyName } = useApiKeys()

  useEffect(() => {
    fetchKeys()
  }, [])

  const handleCreateKey = async (name, limit, limitEnabled) => {
    return await createKey(name, limit, limitEnabled)
  }

  const handleDeleteKey = async (id) => {
    if (!window.confirm('Are you sure you want to delete this API key?')) return
    return await deleteKey(id)
  }

  const handleEditName = async (id, currentName) => {
    const newName = window.prompt('Enter new name for the API key:', currentName)
    if (newName && newName !== currentName) {
      return await updateKeyName(id, newName)
    }
  }

  // Add loading state handling in your JSX
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading API keys...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-8">
          <Toaster position="bottom-right" />
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Overview</h1>
                <div className="flex gap-4">
                  <button className="text-gray-600 hover:text-gray-800">
                    <span className="sr-only">GitHub</span>
                    {/* Add GitHub icon */}
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <span className="sr-only">Twitter</span>
                    {/* Add Twitter icon */}
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <span className="sr-only">Email</span>
                    {/* Add Email icon */}
                  </button>
                </div>
              </div>

              {/* Current Plan Card */}
              <div className="bg-gradient-to-r from-purple-600 via-purple-400 to-blue-300 rounded-xl p-6 text-white mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm font-medium mb-2">CURRENT PLAN</div>
                    <h2 className="text-2xl font-semibold">Researcher</h2>
                  </div>
                  <button className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded-lg text-sm backdrop-blur-sm">
                    Manage Plan
                  </button>
                </div>
                
                <div>
                  <div className="text-sm mb-2">API Limit</div>
                  <div className="bg-white/20 rounded-full h-2 mb-1">
                    <div className="bg-white rounded-full h-2 w-[35%]"></div>
                  </div>
                  <div className="text-sm">35/1,000 Requests</div>
                </div>
              </div>
            </div>

            {/* API Keys Section */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">API Keys</h2>
                    <p className="text-gray-600 text-sm mt-2">
                      The key is used to authenticate your requests to the Research API. 
                      To learn more, see the documentation page.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                    Create New Key
                  </button>
                </div>
              </div>

              <ApiKeysTable 
                apiKeys={apiKeys}
                isLoading={isLoading}
                onDelete={handleDeleteKey}
                onEditName={handleEditName}
              />
            </div>

            {showCreateModal && (
              <CreateKeyModal
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateKey}
              />
            )}

            {/* Contact Section */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Have any questions, feedback or need support? We&apos;d love to hear from you!
              </p>
              <button className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                Contact us
              </button>
            </div>
          </div>
          <div className="z-50">
            <div id="toast-container" />
          </div>
        </div>
      </main>
    </div>
  )
}
