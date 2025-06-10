import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ChatLayout } from "@/components/layouts/chat-layout"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Blissmet: Your Event Our Dream",
  description: "Transform your events into unforgettable experiences with Blissmet - India's premier event planning platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChatLayout>
          <Header />
          {children}
          <Toaster />
        </ChatLayout>
      </body>
    </html>
  )
}
