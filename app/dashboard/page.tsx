'use client'

import { useState } from 'react'
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FiPlus, FiGithub, FiTwitter, FiMail } from 'react-icons/fi'
import { Toaster } from 'react-hot-toast'
import ApiKeysTable from '@/components/dashboard/ApiKeysTable'
import CreateKeyModal from '@/components/dashboard/CreateKeyModal'
import { useApiKeys } from '@/hooks/useApiKeys'
import Sidebar from '@/components/Sidebar'

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin')
    },
  })

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { apiKeys, loading, createKey, deleteKey, updateKeyName } = useApiKeys()

  if (status === "loading" || loading) {
    return <div>Loading...</div>
  }

  const handleCreateKey = async (name: string, limit: string, limitEnabled: boolean) => {
    const success = await createKey(name, limit, limitEnabled)
    if (success) {
      setShowCreateModal(false)
    }
  }

  const handleDeleteKey = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this API key?')) return
    return await deleteKey(id)
  }

  const handleEditName = async (id: string, currentName: string) => {
    const newName = window.prompt('Enter new name for the API key:', currentName)
    if (newName && newName !== currentName) {
      return await updateKeyName(id, newName)
    }
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
                  <Button variant="ghost" size="icon">
                    <FiGithub className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FiTwitter className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FiMail className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Current Plan Card */}
              <Card className="bg-gradient-to-r from-purple-600 via-purple-400 to-blue-300 text-white mb-8">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm font-medium mb-2">CURRENT PLAN</div>
                      <h2 className="text-2xl font-semibold">Researcher</h2>
                    </div>
                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
                      Manage Plan
                    </Button>
                  </div>
                  
                  <div>
                    <div className="text-sm mb-2">API Limit</div>
                    <div className="bg-white/20 rounded-full h-2 mb-1">
                      <div className="bg-white rounded-full h-2 w-[35%]"></div>
                    </div>
                    <div className="text-sm">35/1,000 Requests</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Keys Section */}
            <Card>
              <CardHeader className="border-b p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>API Keys</CardTitle>
                    <p className="text-gray-600 text-sm mt-2">
                      The key is used to authenticate your requests to the Research API. 
                      To learn more, see the documentation page.
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2"
                  >
                    <FiPlus className="w-4 h-4" />
                    Create New Key
                  </Button>
                </div>
              </CardHeader>

              <ApiKeysTable 
                apiKeys={apiKeys}
                isLoading={loading}
                onDelete={handleDeleteKey}
                onEditName={handleEditName}
              />
            </Card>

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
              <Button>Contact us</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 