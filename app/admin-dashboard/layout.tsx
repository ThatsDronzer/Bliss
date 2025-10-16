"use client"

import type React from "react"
import { useRoleAuth } from "@/hooks/use-role-auth"
import { AdminDashboardSidebar } from "@/components/admin-dashboard/sidebar"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthorized, isLoading } = useRoleAuth("admin")

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  // Return null if not authorized (will redirect via useRoleAuth hook)
  if (!isAuthorized) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <AdminDashboardSidebar />
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 w-full md:ml-64">{children}</main>
      </div>
    </div>
  )
}
