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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

