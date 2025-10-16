"use client"

import { usePathname, useRouter } from "next/navigation"
import { Compass, Home, Info, LayoutDashboard, LogOut } from "lucide-react"
import { useClerk, useUser } from "@clerk/nextjs"
import { toast } from "sonner"

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()

  // Get user role from Clerk metadata
  const userRole = user?.unsafeMetadata?.role as string || "user"

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error('Failed to sign out:', error)
      toast.error('Failed to sign out')
    }
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

  const navItems = [
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
    },
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: getDashboardLink(),
      isActive: pathname.includes("/dashboard")
    }
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-lg">
      <div className="grid grid-cols-5 gap-1 px-2 py-2 max-w-screen-sm mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                item.isActive
                  ? "text-pink-600 bg-pink-50"
                  : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
              }`}
            >
              <Icon className={`h-6 w-6 ${item.isActive ? "stroke-[2.5]" : "stroke-2"}`} />
              <span className={`text-[10px] leading-tight font-medium ${item.isActive ? "font-semibold" : ""}`}>
                {item.name}
              </span>
            </button>
          )
        })}
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 active:scale-95"
        >
          <LogOut className="h-6 w-6 stroke-2" />
          <span className="text-[10px] leading-tight font-medium">Logout</span>
        </button>
      </div>
    </nav>
  )
}
