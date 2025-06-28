"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, AlertCircle, Store, Phone, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function VendorLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [identifierType, setIdentifierType] = useState<"email" | "phone">("email")

  useEffect(() => {
    const message = searchParams?.get("message")
    if (message) {
      setSuccessMessage(message)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(identifier, password, "vendor")
      if (result.success) {
        router.push("/vendor-dashboard")
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const setDemoCredentials = () => {
    setIdentifier("info@royalweddingpalace.in")
    setPassword("password123")
  }

  // Set default credentials on component mount
  useEffect(() => {
    setDemoCredentials()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <p className="text-gray-600">Sign in to your vendor account</p>
        </div> */}

        <Card className="shadow-2xl border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-center">Vendor Sign In</CardTitle>
            <CardDescription className="text-center">
            Sign in to your vendor account
            </CardDescription>
          </CardHeader>

          <CardContent>
            {successMessage && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}

            

           

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Login Using</Label>
                <Select value={identifierType} onValueChange={(value) => setIdentifierType(value as "email" | "phone")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select login method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="identifier">{identifierType === "email" ? "Email Address" : "Phone Number"}</Label>
                <div className="relative">
                  {identifierType === "email" ? (
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  ) : (
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  )}
                  <Input
                    id="identifier"
                    type={identifierType === "email" ? "email" : "tel"}
                    className="pl-10"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={identifierType === "email" ? "business@example.com" : "+91 98765 43210"}
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

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={setDemoCredentials}
              >
                Use Demo Credentials
              </Button>

              <p className="text-center text-sm text-gray-500 mt-6">
                Don't have a vendor account?{" "}
                <Link href="/become-vendor" className="text-pink-600 hover:underline font-medium">
                  Apply to become a vendor
                </Link>
              </p>

              
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 