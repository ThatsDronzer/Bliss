"use client"

import { useState } from "react"
import { Copy, CheckCircle2, Gift, Users, Coins } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { referralData } from "@/lib/referral-data"

export default function ReferralPage() {
  const router = useRouter()
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralData.referralCode)
      setCopiedCode(true)
      toast({
        title: "Referral code copied!",
        description: "Share this code with your friends to earn rewards.",
      })
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy code",
        description: "Please try again or copy manually.",
        variant: "destructive",
      })
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralData.referralLink)
      setCopiedLink(true)
      toast({
        title: "Referral link copied!",
        description: "Share this link with your friends to earn rewards.",
      })
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy link",
        description: "Please try again or copy manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Invite Friends & Earn Rewards</h1>
        <p className="text-gray-600">
          Share your referral code or link with friends. When they sign up and book a service, 
          both of you will earn coins that can be used for discounts on future bookings.
        </p>
      </div>

      {/* Referral Code and Link Section */}
      <div className="max-w-3xl mx-auto mb-12">
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Referral Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Your Referral Code</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-lg">
                  {referralData.referralCode}
                </div>
                <Button
                  variant="outline"
                  className="sm:w-32"
                  onClick={handleCopyCode}
                >
                  {copiedCode ? (
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copiedCode ? "Copied!" : "Copy Code"}
                </Button>
              </div>
            </div>

            {/* Referral Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Your Referral Link</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm truncate">
                  {referralData.referralLink}
                </div>
                <Button
                  variant="outline"
                  className="sm:w-32"
                  onClick={handleCopyLink}
                >
                  {copiedLink ? (
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copiedLink ? "Copied!" : "Copy Link"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{referralData.referralsSent}</p>
                <p className="text-sm text-gray-600">Referrals Sent</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{referralData.referralsConverted}</p>
                <p className="text-sm text-gray-600">Successful Referrals</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Gift className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{referralData.coinsEarned}</p>
                <p className="text-sm text-gray-600">Coins Earned</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Coins className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{referralData.coinsAvailable}</p>
                <p className="text-sm text-gray-600">Coins Available</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="max-w-3xl mx-auto mb-12">
        <Card>
          <CardHeader>
            <CardTitle>How the Referral Program Works</CardTitle>
            <CardDescription>Follow these simple steps to earn rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {referralData.steps.map((step) => (
                <div key={step.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    {step.id}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reward Wallet Section */}
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Coins className="w-12 h-12 mx-auto text-yellow-500" />
              <div>
                <h3 className="text-xl font-bold mb-2">
                  You have {referralData.coinsAvailable} coins available
                </h3>
                <p className="text-gray-600 mb-6">
                  You can apply these coins on your next service booking to get up to 25% off.
                </p>
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/vendors")}
                >
                  Browse Services to Use Coins
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Coin redemption will apply automatically during checkout
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 