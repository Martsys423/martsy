'use client'

import { useState, useEffect } from 'react'
import { FiEye, FiCopy, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import Sidebar from '../components/Sidebar'

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCopied, setIsCopied] = useState(null)
  const [showKey, setShowKey] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [monthlyLimit, setMonthlyLimit] = useState('1000')
  const [limitEnabled, setLimitEnabled] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('api_keys')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setApiKeys(data.map(key => ({
          id: key.id,
          name: key.name,
          key: key.key,
          usage: key.usage || '0%',
          created: new Date(key.created_at).toISOString().split('T')[0]
        })));
      } catch (error) {
        console.error('Failed to fetch API keys:', error);
        toast.error('Failed to fetch API keys: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeys();
  }, []); // Empty dependency array means this runs once on mount

  const handleCreateKey = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const newKey = {
        name: newKeyName,
        key: `martsy-${Math.random().toString(36).substr(2, 24)}`,
        usage: '0%',
        monthly_limit: limitEnabled ? parseInt(monthlyLimit) : null
      }

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select()

      if (error) throw error

      // Refresh the keys list
      const { data: updatedKeys, error: fetchError } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setApiKeys(updatedKeys.map(key => ({
        id: key.id,
        name: key.name,
        key: key.key,
        usage: key.usage || '0%',
        created: new Date(key.created_at).toISOString().split('T')[0]
      })))

      setNewKeyName('')
      setMonthlyLimit('1000')
      setShowCreateModal(false)
      
      toast.success('API key created successfully!', {
        duration: 2000,
        position: 'bottom-right',
        style: {
          background: '#10B981',
          color: 'white',
          padding: '16px',
          borderRadius: '10px',
        },
        icon: '🔑',
      })
    } catch (error) {
      console.error('Failed to create API key:', error)
      toast.error('Failed to create API key: ' + error.message, {
        duration: 2000,
        position: 'bottom-right',
        style: {
          background: '#EF4444',
          color: 'white',
          padding: '16px',
          borderRadius: '10px',
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteKey = async (id) => {
    if (!window.confirm('Are you sure you want to delete this API key?')) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh the list after successful deletion
      const { data: updatedKeys, error: fetchError } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setApiKeys(updatedKeys.map(key => ({
        id: key.id,
        name: key.name,
        key: key.key,
        usage: key.usage || '0%',
        created: new Date(key.created_at).toISOString().split('T')[0]
      })));

      toast.success('API key deleted successfully!', {
        duration: 2000,
        position: 'bottom-right',
        style: {
          background: '#10B981',
          color: 'white',
          padding: '16px',
          borderRadius: '10px',
        },
        icon: '🗑️',
      })
    } catch (error) {
      console.error('Failed to delete API key:', error);
      toast.error('Failed to delete API key: ' + error.message, {
        duration: 2000,
        position: 'bottom-right',
        style: {
          background: '#EF4444',
          color: 'white',
          padding: '16px',
          borderRadius: '10px',
        },
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key)
      setIsCopied(key)
      toast.success('API key copied to clipboard!', {
        duration: 2000,
        position: 'bottom-right',
        style: {
          background: '#10B981',
          color: 'white',
          padding: '16px',
          borderRadius: '10px',
        },
        icon: '📋',
      })
    } catch (error) {
      console.error('Failed to copy key:', error)
      toast.error('Failed to copy key to clipboard', {
        duration: 2000,
        position: 'bottom-right',
        style: {
          background: '#EF4444',
          color: 'white',
          padding: '16px',
          borderRadius: '10px',
        },
      })
    }
  }

  const handleEditName = async (id, currentName) => {
    const newName = window.prompt('Enter new name for the API key:', currentName);
    if (newName && newName !== currentName) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('api_keys')
          .update({ name: newName })
          .eq('id', id);

        if (error) throw error;

        // Refresh the list after successful update
        const { data: updatedKeys, error: fetchError } = await supabase
          .from('api_keys')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setApiKeys(updatedKeys.map(key => ({
          id: key.id,
          name: key.name,
          key: key.key,
          usage: key.usage || '0%',
          created: new Date(key.created_at).toISOString().split('T')[0]
        })));

        toast.success('API key name updated!', {
          duration: 2000,
          position: 'bottom-right',
          style: {
            background: '#10B981',
            color: 'white',
            padding: '16px',
            borderRadius: '10px',
          },
          icon: '✏️',
        })
      } catch (error) {
        console.error('Failed to update API key name:', error);
        toast.error('Failed to update API key name: ' + error.message, {
          duration: 2000,
          position: 'bottom-right',
          style: {
            background: '#EF4444',
            color: 'white',
            padding: '16px',
            borderRadius: '10px',
          },
        })
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main 
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
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

              {/* API Keys Table */}
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
                                onClick={() => handleEditName(apiKey.id, apiKey.name)}
                                className="text-gray-600 hover:text-gray-900 p-1"
                                title="Edit Name"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteKey(apiKey.id)}
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
            </div>

            {/* Create New Key Modal */}
            {showCreateModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 w-full max-w-md">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Create a new API key
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Enter a name and limit for the new API key.
                  </p>
                  
                  <form onSubmit={handleCreateKey}>
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
                      * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
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
                        onClick={() => {
                          setShowCreateModal(false)
                          setNewKeyName('')
                          setMonthlyLimit('1000')
                          setLimitEnabled(true)
                        }}
                        className="px-6 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Contact Section */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Have any questions, feedback or need support? We'd love to hear from you!
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
