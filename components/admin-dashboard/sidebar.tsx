"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  Users,
  Store,
  BookMarked,
  CreditCard,
  MessageSquare,
  Menu,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-16 h-[calc(100vh-64px)] bg-white border-r z-40 transition-transform duration-300 ease-in-out",
          "w-64 md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ScrollArea className="h-full py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-base sm:text-lg font-semibold">Admin Dashboard</h2>
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
    </>
  )
}
