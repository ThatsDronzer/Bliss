"use client"

import type React from "react"
import { VendorDashboardSidebar } from "@/components/vendor-dashboard/sidebar"
import { useRoleAuth } from "@/hooks/use-role-auth"

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthorized, isLoading } = useRoleAuth("vendor");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vendor dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex">
      <VendorDashboardSidebar />
      <main className="flex-1 min-h-[calc(100vh-73px)] w-full md:w-auto">{children}</main>
    </div>
  )
}
