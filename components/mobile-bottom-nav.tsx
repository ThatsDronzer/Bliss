"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Compass, Home, Info, LayoutDashboard, LogOut, LogIn } from "lucide-react"
import { useClerk, useUser, useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()
  const { isSignedIn, isLoaded } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  // Get user role from Clerk metadata
  const userRole = user?.unsafeMetadata?.role as string || "user"

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error('Failed to sign out:', error)
      toast.error('Failed to sign out')
      setIsLoggingOut(false)
    } finally {
      setShowLogoutDialog(false)
    }
  }

  const handleLogin = () => {
    router.push("/sign-in")
  }

  const getDashboardLink = () => {
    if (userRole === "vendor") {
      return "/vendor-dashboard"
    } else if (userRole === "admin") {
      return "/admin-dashboard"
    } else {
      return "/dashboard"
    }
  }

  // Base nav items that always show
  const baseNavItems = [
    {
      name: "Explore",
      icon: Compass,
      href: "/explore-services",
      isActive: pathname === "/explore-services"
    },
    {
      name: "Home Service",
      icon: Home,
      href: "/home-service",
      isActive: pathname === "/home-service"
    },
    {
      name: "About",
      icon: Info,
      href: "/about",
      isActive: pathname === "/about"
    }
  ]

  // Add Dashboard only if user is signed in
  const navItems = isSignedIn && isLoaded
    ? [
        ...baseNavItems,
        {
          name: "Dashboard",
          icon: LayoutDashboard,
          href: getDashboardLink(),
          isActive: pathname.includes("/dashboard")
        }
      ]
    : baseNavItems

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-lg">
        <div className={`grid ${isSignedIn && isLoaded ? 'grid-cols-5' : 'grid-cols-4'} gap-1 px-2 py-2 max-w-screen-sm mx-auto`}>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                disabled={isLoggingOut}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                  item.isActive
                    ? "text-pink-600 bg-pink-50"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                } ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon className={`h-6 w-6 ${item.isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className={`text-[10px] leading-tight font-medium ${item.isActive ? "font-semibold" : ""}`}>
                  {item.name}
                </span>
              </button>
            )
          })}
          
          {/* Login/Logout Button */}
          {isSignedIn && isLoaded ? (
            <button
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 active:scale-95 ${
                isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <LogOut className={`h-6 w-6 stroke-2 ${isLoggingOut ? "animate-pulse" : ""}`} />
              <span className="text-[10px] leading-tight font-medium">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-xl text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 active:scale-95"
            >
              <LogIn className="h-6 w-6 stroke-2" />
              <span className="text-[10px] leading-tight font-medium">Login</span>
            </button>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
