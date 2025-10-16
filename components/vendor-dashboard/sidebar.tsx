"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import {
  LayoutDashboard,
  Calendar,
  BookMarked,
  Store,
  MessageSquare,
  Star,
  BarChart,
  User,
  Settings,
  PlusCircle,
  LogOut,
  CheckCircle,
  Menu,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const navItems = [
  {
    title: "Overview",
    href: "/vendor-dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "Listings",
    href: "/vendor-dashboard/listings",
    icon: <Store className="w-5 h-5" />,
  },
  {
    title: "Bookings",
    href: "/vendor-dashboard/bookings",
    icon: <BookMarked className="w-5 h-5" />,
  },
  {
    title: "Messages",
    href: "/vendor-dashboard/messages",
    icon: <MessageSquare className="w-5 h-5" />,
    badge: 2,
  },
  {
    title: "Reviews",
    href: "/vendor-dashboard/reviews",
    icon: <Star className="w-5 h-5" />,
  },
  {
    title: "Verification",
    href: "/vendor-dashboard/verification",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  {
    title: "Profile",
    href: "/vendor-dashboard/profile",
    icon: <User className="w-5 h-5" />,
  },
]

export function VendorDashboardSidebar() {
  const pathname = usePathname()
  const { signOut } = useClerk()
  const router = useRouter()
  const { user } = useUser()
  const [isVerified, setIsVerified] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Check verification status
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/vendor-verification?clerkId=${user.id}`)
          const data = await response.json()
          if (response.ok) {
            setIsVerified(data.isVerified)
          }
        } catch (error) {
          console.error('Error checking verification status:', error)
        }
      }
    }

    checkVerificationStatus()
  }, [user?.id])

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

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

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
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex flex-col gap-2 p-4 flex-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  className={cn("w-full justify-start", pathname === item.href ? "" : "hover:bg-gray-100")}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Button>
              </Link>
            ))}

            {/* Only show Add New Listing button if vendor is verified */}
            {isVerified && (
              <div className="mt-4 pt-4 border-t">
                <Link href="/vendor-dashboard/listings/new">
                  <Button className="w-full justify-start" variant="outline">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add New Listing
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="p-4 border-t">
            <Button variant="destructive" className="w-full" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
