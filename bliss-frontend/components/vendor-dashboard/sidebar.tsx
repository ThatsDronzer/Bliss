"use client"

import { useAuth, useClerk, useUser } from "@clerk/nextjs"
import {
    BookMarked,
    CheckCircle,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    PlusCircle,
    Star,
    Store,
    User,
    X
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  const { getToken } = useAuth()
  const [isVerified, setIsVerified] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [messageCount, setMessageCount] = useState(0)

  // Check verification status
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (user?.id) {
        try {
          const token = await getToken();
          console.log('Token retrieved:', token ? 'Yes' : 'No');
          
          if (!token) {
            console.error('No auth token available');
            return;
          }

          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
          const url = `${apiUrl}/api/vendor-verification?clerkId=${user.id}`;
          console.log('Fetching verification status from:', url);

          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
          
          console.log('Verification response status:', response.status);
          const data = await response.json()
          console.log('Verification response data:', data);
          
          if (response.ok) {
            setIsVerified(data.isVerified)
          } else {
            console.error('Verification check failed:', data);
          }
        } catch (error) {
          console.error('Error checking verification status:', error)
        }
      }
    }

    checkVerificationStatus()
  }, [user?.id, getToken])

  // Fetch message count
  useEffect(() => {
    const fetchMessageCount = async () => {
      try {
        const token = await getToken();
        console.log('Message count - Token retrieved:', token ? 'Yes' : 'No');
        
        if (!token) {
          console.error('No auth token available for message count');
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
        const url = `${apiUrl}/api/vendor/booking-requests?page=1&limit=1000`;
        console.log('Fetching messages from:', url);

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Message response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Message fetch failed:', errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: any = await response.json();
        console.log('Message data received:', data);
        
        if (Array.isArray(data.messages)) {
          // Count only pending messages for the badge
          const pendingCount = data.messages.filter((msg: any) => 
            msg.bookingDetails?.status === 'pending'
          ).length
          setMessageCount(pendingCount)
          console.log('Pending message count:', pendingCount);
        }
      } catch (error) {
        console.error('Error fetching message count:', error)
      }
    }

    if (user?.id) {
      fetchMessageCount()
      // Optionally refresh count every 30 seconds
      const interval = setInterval(fetchMessageCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user?.id, getToken])

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
                  {item.href === "/vendor-dashboard/messages" && messageCount > 0 && (
                    <span className="ml-auto bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {messageCount}
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
