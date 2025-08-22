"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Menu, ShoppingCart, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CoinDisplay } from "@/components/ui/coin-display"
import { CoinService } from "@/lib/coin-service"
import { SignedIn, SignedOut, useClerk, UserButton, useAuth, useUser } from "@clerk/nextjs"
import { updateUserToVendor } from "@/app/role-handler/action"

export function Header() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [userCoins, setUserCoins] = useState(0)
  const { signOut } = useClerk();

  // Demo cart items count
  const cartItemsCount = 3

  // Get user role from Clerk metadata
  const userRole = user?.unsafeMetadata?.role as string || "user"

  useEffect(() => {
    const fetchCoinBalance = async () => {
      if (isSignedIn && user) {
        // For demo purposes, set a default coin balance
        setUserCoins(1250)
      }
    }
    fetchCoinBalance()
  }, [isSignedIn, user])

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  const getDashboardLink = () => {
    // Route to appropriate dashboard based on user role
    if (userRole === "vendor") {
      return "/vendor-dashboard"
    } else if (userRole === "admin") {
      return "/admin-dashboard"
    } else {
      return "/dashboard"
    }
  }

  const handleBecomeVendor = async () => {
    await signOut(); // logs out current user
    router.push("/sign-up?role=vendor"); // redirect to vendor sign up
  };

  const handleSignIn = async () => {
    await signOut();
    router.push("/sign-in?role=user")
  }

  const handleSignUp = async () => {
    await signOut();
    router.push("/sign-up?role=user")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Check if the search query looks like a service search
      const serviceKeywords = ['photography', 'catering', 'decoration', 'dj', 'makeup', 'venue', 'music', 'lighting', 'tent', 'furniture', 'planning', 'transport', 'beauty', 'florist', 'entertainment']
      const isServiceSearch = serviceKeywords.some(keyword => 
        searchQuery.toLowerCase().includes(keyword)
      )
      
      if (isServiceSearch) {
        router.push(`/explore-services?service=${encodeURIComponent(searchQuery)}`)
      } else {
        router.push(`/vendors?search=${encodeURIComponent(searchQuery)}`)
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Logo + Brand Name + Navigation Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-2xl text-gray-900">Blissmet</span>
            </Link>

            {/* Navigation Links - Now part of left side */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/explore-services"
                className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors duration-200 relative group"
              >
                Explore Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/home-service"
                className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors duration-200 relative group"
              >
                Home Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors duration-200 relative group"
              >
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>
          </div>

          {/* Right Side - User Actions */}
          <div className="flex items-center gap-3">
            <SignedIn>
              <>
                {/* Coin Display - Only show for regular users */}
                {userRole === "user" && (
                  <Link href="/dashboard/coins">
                    <CoinDisplay balance={userCoins} className="hidden lg:flex" />
                  </Link>
                )}
                
                {/* Cart Button - Only visible for regular users */}
                {userRole === "user" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-pink-50 transition-all duration-200 rounded-full"
                    onClick={() => router.push("/cart")}
                  >
                    <ShoppingCart className="h-5 w-5 text-gray-700" />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-pink-500 border-2 border-white">
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                )}

                {/* Desktop Action Buttons */}
                <div className="hidden lg:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(getDashboardLink())}
                    className="text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
                  >
                    Dashboard
                  </Button>

                  {/* Only show "Become a Vendor" button for regular users */}
                  {userRole === "user" && (
                    // <Button
                    //   variant="ghost"
                    //   size="sm"
                    //   onClick={handleBecomeVendor}
                    //   className="text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
                    // >
                    //   Become a Vendor
                    // </Button>
                    <form action={updateUserToVendor} className="mt-8">
                      <button 
                        type="submit" 
                        className="px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        Become a Vendor
                      </button>
                    </form>
                  )}

                  {/* Removed Vendor Dashboard button for vendors */}
                </div>

                {/* User Button */}
                <UserButton />
              </>
            </SignedIn>

            <SignedOut>
              <div className="hidden lg:flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignIn}
                  className="border-pink-200 text-pink-600 hover:bg-pink-50 transition-all duration-200"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={handleSignUp}
                  className="bg-pink-600 hover:bg-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Sign Up
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBecomeVendor}
                  className="text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
                >
                  Vendor Login
                </Button>
              </div>
            </SignedOut>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:bg-pink-50 transition-colors rounded-full"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col gap-6 mt-8">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search vendors..."
                      className="w-full pl-10 rounded-full border-pink-200 focus:border-pink-400 focus:ring-pink-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-4">
                    <Link
                      href="/explore-services"
                      className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
                    >
                      Explore Services
                    </Link>
                    <Link
                      href="/home-service"
                      className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
                    >
                      Home Services
                    </Link>
                    <Link
                      href="/about"
                      className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
                    >
                      About Us
                    </Link>
                  </nav>

                  {/* Mobile User Actions */}
                  <SignedIn>
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => router.push(getDashboardLink())}
                        className="justify-start text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                      >
                        Dashboard
                      </Button>
                      
                      {/* Only show cart for regular users */}
                      {userRole === "user" && (
                        <Button
                          variant="ghost"
                          onClick={() => router.push("/cart")}
                          className="justify-start text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                        >
                          Cart ({cartItemsCount})
                        </Button>
                      )}
                      
                      {/* Only show "Become a Vendor" for regular users */}
                      {userRole === "user" && (
                        <Button
                          variant="ghost"
                          onClick={handleBecomeVendor}
                          className="justify-start text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                        >
                          Become a Vendor
                        </Button>
                      )}

                      {/* Removed Vendor Dashboard button for vendors in mobile */}
                      
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </SignedIn>

                  <SignedOut>
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        onClick={handleSignIn}
                        className="border-pink-200 text-pink-600 hover:bg-pink-50"
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={handleSignUp}
                        className="bg-pink-600 hover:bg-pink-700 text-white"
                      >
                        Sign Up
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={handleBecomeVendor}
                        className="text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                      >
                        Vendor Login
                      </Button>
                    </div>
                  </SignedOut>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
