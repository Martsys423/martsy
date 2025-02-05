'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HiHome, HiMenuAlt1 } from 'react-icons/hi'
import { BiBrain } from 'react-icons/bi'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { VscCode } from 'react-icons/vsc'
import { IoDocumentTextOutline } from 'react-icons/io5'

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  const isActive = (path) => {
    return pathname === path ? 'bg-gray-100' : ''
  }

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 ${isOpen ? 'left-64' : 'left-4'} z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300`}
      >
        <HiMenuAlt1 className="w-6 h-6 text-gray-600" />
      </button>

      {/* Sidebar */}
      <div className={`w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-purple-600">Martsy</h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          <Link 
            href="/dashboards" 
            className={`flex items-center space-x-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${isActive('/dashboards')}`}
          >
            <HiHome className="w-5 h-5" />
            <span>Overview</span>
          </Link>

          <Link 
            href="/research-assistant" 
            className={`flex items-center space-x-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${isActive('/research-assistant')}`}
          >
            <BiBrain className="w-5 h-5" />
            <span>Research Assistant</span>
          </Link>

          <Link 
            href="/research-reports" 
            className={`flex items-center space-x-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${isActive('/research-reports')}`}
          >
            <HiOutlineDocumentText className="w-5 h-5" />
            <span>Research Reports</span>
          </Link>

          <Link 
            href="/api-playground" 
            className={`flex items-center space-x-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${isActive('/api-playground')}`}
          >
            <VscCode className="w-5 h-5" />
            <span>API Playground</span>
          </Link>

          <Link 
            href="/documentation" 
            className={`flex items-center space-x-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${isActive('/documentation')}`}
          >
            <IoDocumentTextOutline className="w-5 h-5" />
            <span>Documentation</span>
            <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </nav>
      </div>
    </>
  )
}
