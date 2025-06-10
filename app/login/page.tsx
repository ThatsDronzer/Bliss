"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, AlertCircle, User, Store, ShieldCheck, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [email, setEmail] = useState("priya.sharma@example.com")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginType, setLoginType] = useState<"user" | "vendor" | "admin">("user")

  useEffect(() => {
    const message = searchParams.get("message")
    if (message) {
      setSuccessMessage(message)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(email, password, loginType)
      if (result.success) {
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="font-bold text-3xl text-gray-900">Blissmet</span>
          </Link> */}
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1> */}
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your account type and enter your credentials
            </CardDescription>
          </CardHeader>

          <CardContent>
            {successMessage && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}

            <Tabs value={loginType} onValueChange={(value) => setLoginType(value as "user" | "vendor" | "admin")}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger
                  value="user"
                  className="flex items-center gap-2"
                  onClick={() => setDemoCredentials("user")}
                >
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
                <TabsTrigger
                  value="admin"
                  className="flex items-center gap-2"
                  onClick={() => setDemoCredentials("admin")}
                >
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
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
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

              <div className="space-y-2">
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 text-lg font-semibold"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-pink-600 hover:underline font-semibold">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
