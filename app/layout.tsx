import React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ChatLayout } from "@/components/layouts/chat-layout"
import { Header } from "@/components/header"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Toaster } from "@/components/ui/sonner"
import { ClerkProvider, SignedIn } from '@clerk/nextjs'

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
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ChatLayout>
            <Header />
            <div className="pb-20 lg:pb-0">
              {children}
            </div>
            <MobileBottomNav />
          </ChatLayout>
          <Toaster/>
        </body>
      </html>
    </ClerkProvider>
  )
}