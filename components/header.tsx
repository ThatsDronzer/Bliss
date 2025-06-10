"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Menu, ShoppingCart, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CoinDisplay } from "@/components/ui/coin-display"
import { CoinService } from "@/lib/coin-service"

export function Header() {
  const router = useRouter()
  const { user, isAuthenticated, isVendor, isAdmin, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [userCoins, setUserCoins] = useState(0)

  // Demo cart items count
  const cartItemsCount = 3

  useEffect(() => {
    const fetchCoinBalance = async () => {
      if (isAuthenticated && user) {
        const balance = await CoinService.getUserBalance(user.id)
        setUserCoins(balance)
      }
    }
    fetchCoinBalance()
  }, [isAuthenticated, user])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getDashboardLink = () => {
    if (isAdmin) return "/admin-dashboard"
    if (isVendor) return "/vendor-dashboard"
    return "/dashboard"
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/vendors?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSignIn = () => {
    router.push("/login")
  }

  const handleSignUp = () => {
    router.push("/signup")
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
                href="/vendors"
                className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors duration-200 relative group"
              >
                Explore Vendors
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
                href="/contact"
                className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors duration-200 relative group"
              >
                Contact & Support
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
            {isAuthenticated ? (
              <>
                {/* Coin Display */}
                <Link href="/dashboard/coins">
                  <CoinDisplay balance={userCoins} className="hidden lg:flex" />
                </Link>
                
                {/* Cart Button - Only visible after login */}
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

                  {!isVendor && !isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/become-vendor")}
                      className="text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
                    >
                      Become a Vendor
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
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
              </div>
            )}

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

                  {isAuthenticated && (
                    <div className="flex items-center justify-between px-2">
                      <CoinDisplay balance={userCoins} />
                    </div>
                  )}

                  <div className="space-y-4">
                    <Link href="/vendors" className="block text-base font-medium hover:text-pink-600 transition-colors">
                      Explore Vendors
                    </Link>
                    <Link href="/home-service" className="block text-base font-medium hover:text-pink-600 transition-colors">
                      Home Services
                    </Link>
                    <Link href="/contact" className="block text-base font-medium hover:text-pink-600 transition-colors">
                      Contact & Support
                    </Link>
                    <Link href="/about" className="block text-base font-medium hover:text-pink-600 transition-colors">
                      About Us
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
