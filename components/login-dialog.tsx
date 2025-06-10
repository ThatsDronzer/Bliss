"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, AlertCircle, User, Store, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("priya.sharma@example.com")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginType, setLoginType] = useState<"user" | "vendor" | "admin">("user")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(email, password, loginType)
      if (result.success) {
        onOpenChange(false)
        // Redirect logic: Only vendors and admins go to dashboard, users stay on homepage
        if (loginType === "admin") {
          router.push("/admin-dashboard")
        } else if (loginType === "vendor") {
          router.push("/vendor-dashboard")
        } else {
          // Users stay on current page or go to homepage
          router.push("/")
        }
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const setDemoCredentials = (type: "user" | "vendor" | "admin") => {
    if (type === "admin") {
      setEmail("admin@blissmet.in")
    } else if (type === "vendor") {
      setEmail("info@royalweddingpalace.in")
    } else {
      setEmail("priya.sharma@example.com")
    }
    setPassword("password123")
    setLoginType(type)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login to Blissmet</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account. For demo, use password: password123
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="user" onValueChange={(value) => setLoginType(value as "user" | "vendor" | "admin")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user" className="flex items-center gap-2" onClick={() => setDemoCredentials("user")}>
              <User className="h-4 w-4" />
              <span>User</span>
            </TabsTrigger>
            <TabsTrigger
              value="vendor"
              className="flex items-center gap-2"
              onClick={() => setDemoCredentials("vendor")}
            >
              <Store className="h-4 w-4" />
              <span>Vendor</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2" onClick={() => setDemoCredentials("admin")}>
              <ShieldCheck className="h-4 w-4" />
              <span>Admin</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <p className="text-sm text-gray-500 mb-4">
              Login as a user to explore vendors, book services, and manage your events.
            </p>
          </TabsContent>

          <TabsContent value="vendor">
            <p className="text-sm text-gray-500 mb-4">
              Login as a vendor to manage your listings, bookings, and business.
            </p>
          </TabsContent>

          <TabsContent value="admin">
            <p className="text-sm text-gray-500 mb-4">
              Login as an admin to manage the platform, users, vendors, and more.
            </p>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={
                    loginType === "admin"
                      ? "admin@example.com"
                      : loginType === "vendor"
                        ? "business@example.com"
                        : "you@example.com"
                  }
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-sm text-right">
                <a href="#" className="text-pink-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-pink-600 hover:bg-pink-700">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </DialogFooter>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-pink-600 hover:underline font-semibold"
            onClick={() => onOpenChange(false)}
          >
            Sign up here
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
