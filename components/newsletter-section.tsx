"use client"

import { useState } from "react"
import { Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStatus("success")
      setMessage("Thank you for subscribing! You'll receive our latest updates soon.")
      setEmail("")

      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 3000)
    } catch (error) {
      setStatus("error")
      setMessage("Something went wrong. Please try again later.")
    }
  }

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-2 bg-pink-100 rounded-full mb-8">
            <Mail className="w-6 h-6 text-pink-600" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Stay Updated with Blissmet
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to our newsletter for exclusive vendor updates, event planning tips, and special offers.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 px-6"
              />
            </div>
            <Button
              type="submit"
              disabled={status === "loading"}
              className="h-12 px-8 bg-pink-600 hover:bg-pink-700 text-white font-semibold"
            >
              {status === "loading" ? (
                "Subscribing..."
              ) : (
                <>
                  Subscribe
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {status !== "idle" && (
            <Alert
              className={`mt-6 ${
                status === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              <AlertDescription
                className={status === "success" ? "text-green-800" : "text-red-800"}
              >
                {message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </section>
  )
} 