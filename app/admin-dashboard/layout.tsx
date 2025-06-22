"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { AdminDashboardSidebar } from "@/components/admin-dashboard/sidebar"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin-login")
      return
    }
    if (!isAdmin) {
      router.push("/")
      return
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <AdminDashboardSidebar />
        <main className="flex-1 p-6 bg-gray-50 ml-64">{children}</main>
      </div>
    </div>
  )
}
