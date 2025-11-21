import Link from "next/link"
import { Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function ReferralBanner() {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-none">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-purple-500" />
            <div>
              <h3 className="font-semibold text-lg">Invite Friends & Earn Rewards</h3>
              <p className="text-sm text-gray-600">Get 100 coins for every successful referral</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/dashboard/referral">
              Join Referral Program
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
} 