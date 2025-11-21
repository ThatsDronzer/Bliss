"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, ShoppingCart, Search, User, Trash2, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CoinDisplay } from "@/components/ui/coin-display"
import { CoinService } from "@/lib/coin-service"
import { SignedIn, SignedOut, useClerk, useAuth, useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { updateUserToVendor } from "@/app/role-handler/action"

export function Header() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [userCoins, setUserCoins] = useState(0)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
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
    setIsLoggingOut(true)
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error('Failed to sign out:', error)
      toast.error('Failed to sign out')
      setIsLoggingOut(false)
    }
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

  // State for Become Vendor confirmation dialog
  const [showBecomeVendorDialog, setShowBecomeVendorDialog] = useState(false);
  const [isBecomingVendor, setIsBecomingVendor] = useState(false);

  const handleBecomeVendor = () => {
    setShowBecomeVendorDialog(true);
  };

  const handleConfirmBecomeVendor = async () => {
    setIsBecomingVendor(true);
    try {
      await updateUserToVendor();
      toast.success("Your account is now a vendor!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update account. Please try again.");
    } finally {
      setIsBecomingVendor(false);
      setShowBecomeVendorDialog(false);
    }
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

                  {/* Only show "Become a Vendor" button for regular users, with confirmation dialog */}
                  {userRole === "user" && (
                    <>
                      <Button
                        type="button"
                        className="px-4 py-2 font-semibold text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
                        onClick={handleBecomeVendor}
                      >
                        Become a Vendor
                      </Button>
                      <AlertDialog open={showBecomeVendorDialog} onOpenChange={setShowBecomeVendorDialog}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-pink-600" />
                              Change Account to Vendor?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will change your account from <span className="font-semibold text-pink-600">User</span> to <span className="font-semibold text-pink-600">Vendor</span>.<br />
                              You will be able to list your services, but some user features may be restricted.<br />
                              Are you sure you want to continue?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isBecomingVendor}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleConfirmBecomeVendor}
                              disabled={isBecomingVendor}
                              className="bg-pink-600 hover:bg-pink-700"
                            >
                              {isBecomingVendor ? "Changing..." : "Confirm"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}

                  {/* Removed Vendor Dashboard button for vendors */}
                </div>

                {/* Custom User Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                        <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                      <LogOut className={`mr-2 h-4 w-4 ${isLoggingOut ? "animate-pulse" : ""}`} />
                      <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  )
}
