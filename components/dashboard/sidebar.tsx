"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  BookMarked,
  Heart,
  MessageSquare,
  CheckSquare,
  CreditCard,
  User,
  Settings,
  LogOut,
  Coins,
  Gift,
  Mail,
  Menu,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "My Bookings",
    href: "/dashboard/bookings",
    icon: <BookMarked className="w-5 h-5" />,
  },
  {
    title: "My Coins",
    href: "/dashboard/coins",
    icon: <Coins className="w-5 h-5" />,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: <Mail className="w-5 h-5" />,
  },
  {
    title: "Favorites",
    href: "/dashboard/favorites",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    title: "Contact & Support",
    href: "/dashboard/contact-support",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: <User className="w-5 h-5" />,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = () => {
    router.push("/")
  }

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
          "fixed md:sticky top-[73px] h-[calc(100vh-73px)] bg-white border-r z-40 transition-transform duration-300 ease-in-out",
          "w-64 md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col gap-2 p-4 h-full overflow-y-auto">
          <div className="flex-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  className={cn("w-full justify-start mb-1", pathname === item.href ? "" : "hover:bg-gray-100")}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </Button>
              </Link>
            ))}
          </div>
          <div className="mt-auto pt-4 border-t">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </>
  )
}
