import type React from "react"
import { VendorDashboardSidebar } from "@/components/vendor-dashboard/sidebar"

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <VendorDashboardSidebar />
      <main className="flex-1 min-h-[calc(100vh-73px)]">{children}</main>
    </div>
  )
}
