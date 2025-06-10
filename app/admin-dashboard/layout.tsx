import type React from "react"
import { AdminDashboardSidebar } from "@/components/admin-dashboard/sidebar"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <AdminDashboardSidebar />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
