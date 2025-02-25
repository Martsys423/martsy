'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

interface DashboardLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
}

export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white shadow-sm"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
            fixed top-0 left-0 h-full bg-white w-64 shadow-lg transform transition-transform duration-200 ease-in-out z-40
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="h-full overflow-y-auto p-4 pt-16">
            {/* Martsys Logo */}
            <div className="mb-6">
              <Link 
                href="/"
                className="inline-block text-2xl font-bold bg-gradient-to-r from-purple-600 via-purple-400 to-blue-300 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Martsys
              </Link>
            </div>
            {sidebar}
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-200 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-4 sm:p-6 lg:p-8 pt-16">
            {children}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
} 