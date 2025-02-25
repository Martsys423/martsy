import type { ReactNode } from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { metadata } from "./metadata"

const inter = Inter({ subsets: ["latin"] })

export { metadata }

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

