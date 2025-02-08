'use client'

import Sidebar from '../components/Sidebar'

export default function ProtectedPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Protected Route</h1>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Welcome to the Protected Area
            </h2>
            <p className="text-gray-600">
              This page is only accessible with a valid API key. You can now make API calls
              using your validated key.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 