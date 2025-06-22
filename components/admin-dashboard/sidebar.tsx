"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Store,
  BookMarked,
  CreditCard,
  MessageSquare,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const navItems = [
  {
    title: "Overview",
    href: "/admin-dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "Users",
    href: "/admin-dashboard/users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Vendors",
    href: "/admin-dashboard/vendors",
    icon: <Store className="w-5 h-5" />,
  },
  {
    title: "Bookings",
    href: "/admin-dashboard/bookings",
    icon: <BookMarked className="w-5 h-5" />,
  },
  {
    title: "Payments",
    href: "/admin-dashboard/payments",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    title: "Messages",
    href: "/admin-dashboard/messages",
    icon: <MessageSquare className="w-5 h-5" />,
  },
]

export function AdminDashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r h-[calc(100vh-64px)] bg-white fixed top-16 left-0 z-30">
      <ScrollArea className="h-full py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Admin Dashboard</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  className={cn("w-full justify-start", pathname === item.href ? "" : "hover:bg-gray-100")}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
