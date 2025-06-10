import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 min-h-[calc(100vh-73px)]">{children}</main>
      <Toaster />
    </div>
  )
}
