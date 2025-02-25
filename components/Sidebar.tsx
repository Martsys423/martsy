'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiKey, FiSettings, FiMenu, FiX, FiGrid, FiGithub, FiBook } from 'react-icons/fi'
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
}

export default function Sidebar({ isOpen = true, setIsOpen }: SidebarProps) {
  const pathname = usePathname()

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: FiHome },
    { name: 'API Keys', href: '/dashboard/api-keys', icon: FiKey },
    { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
    { 
      name: 'Playground', 
      href: '/playground', 
      icon: FiGrid,
      subItems: [
        { name: 'Cheat Sheets', href: '/cheat-sheets', icon: FiBook },
        { name: 'GitHub', href: 'https://github.com', icon: FiGithub },
        { name: 'Tutorials', href: '/tutorials', icon: FiBook },
      ]
    },
  ]

  const toggleSidebar = () => {
    if (setIsOpen) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-lg p-2 shadow-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <FiX className="h-6 w-6" />
        ) : (
          <FiMenu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-white border-r transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-20",
          "md:w-64 md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b px-4 py-6">
            <Link href="/" className={cn(
              "font-bold transition-all duration-300",
              isOpen ? "text-2xl" : "text-xl"
            )}>
              {isOpen ? 'Martsy' : 'M'}
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-purple-50 text-purple-600"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5",
                          isActive ? "text-purple-600" : "text-gray-400",
                          isOpen ? "mr-3" : "mx-auto"
                        )}
                      />
                      {isOpen && <span>{item.name}</span>}
                    </Link>
                    {isOpen && item.subItems && pathname.startsWith('/playground') && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
                          >
                            <subItem.icon className="mr-3 h-4 w-4 text-gray-400" />
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0" />
              {isOpen && (
                <div className="flex-1">
                  <p className="text-sm font-medium">User Name</p>
                  <p className="text-xs text-gray-500">user@example.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
} 