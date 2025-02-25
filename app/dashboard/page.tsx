'use client'

import { useState } from 'react'
import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FiPlus, FiGithub, FiTwitter, FiMail, FiHome, FiKey, FiSettings, FiHelpCircle, FiCode } from 'react-icons/fi'
import { Toaster } from 'react-hot-toast'
import ApiKeysTable from '@/components/dashboard/ApiKeysTable'
import CreateKeyModal from '@/components/dashboard/CreateKeyModal'
import { useApiKeys } from '@/hooks/useApiKeys'
import { DashboardLayout } from "@/components/layout/DashboardLayout"

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin')
    },
  })

  const [showCreateModal, setShowCreateModal] = useState(false)
  const { apiKeys, loading, createKey, deleteKey, updateKeyName } = useApiKeys()

  if (status === "loading" || loading) {
    return <div>Loading...</div>
  }

  const handleCreateKey = async (name: string, limit: string, limitEnabled: boolean): Promise<boolean> => {
    try {
      const success = await createKey(name, limit, limitEnabled)
      if (success) {
        setShowCreateModal(false)
        return true
      }
      return false
    } catch (error) {
      console.error('Error creating key:', error)
      return false
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
    <DashboardLayout
      sidebar={
        <div className="space-y-6">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-sm"
                onClick={() => router.push('/dashboard')}
              >
                <FiHome className="h-4 w-4" /> Overview
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-sm"
                onClick={() => router.push('/dashboard')}
              >
                <FiKey className="h-4 w-4" /> API Keys
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-sm"
                onClick={() => router.push('/dashboard/playground')}
              >
                <FiCode className="h-4 w-4" /> Playground
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <FiSettings className="h-4 w-4" /> Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <FiHelpCircle className="h-4 w-4" /> Help & Support
              </Button>
            </div>
          </div>

          {/* Optional: Add a section for quick actions */}
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight text-gray-500">Quick Actions</h2>
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-sm"
                onClick={() => setShowCreateModal(true)}
              >
                <FiPlus className="h-4 w-4" /> New API Key
              </Button>
            </div>
          </div>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto space-y-4">
        <Toaster position="bottom-right" />

        {/* Current Plan Card - Moved to top */}
        <Card className="bg-gradient-to-r from-purple-600 via-purple-400 to-blue-300 text-white mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
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

        {/* API Keys Section */}
        <Card>
          <CardHeader className="border-b p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>API Keys</CardTitle>
                <p className="text-gray-600 text-sm mt-2">
                  The key is used to authenticate your requests to the Research API. 
                  To learn more, see the documentation page.
                </p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 whitespace-nowrap bg-black text-white hover:bg-gray-800"
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
      </div>
    </DashboardLayout>
  )
} 