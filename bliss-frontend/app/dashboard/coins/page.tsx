"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Coins, AlertCircle } from "lucide-react"
import { useAuth, useUser } from "@clerk/nextjs"
import { CoinService } from "@/lib/coin-service"
import type { CoinTransaction } from "@/lib/types"
import { CoinDisplay } from "@/components/ui/coin-display"
import { CoinHistory } from "@/components/coin-history"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CoinsPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<CoinTransaction[]>([])

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
      return
    }

    const fetchCoinData = async () => {
      if (isLoaded && isSignedIn && user) {
        // Handle coin expiry first
        await CoinService.handleCoinExpiry(user.id)
        
        // Then fetch updated balance and transactions
        const [currentBalance, transactionHistory] = await Promise.all([
          CoinService.getUserBalance(user.id),
          CoinService.getUserTransactions(user.id),
        ])
        
        setBalance(currentBalance)
        setTransactions(transactionHistory)
      }
    }

    fetchCoinData()
  }, [isLoaded, isSignedIn, user, router])

  if (!isSignedIn || !user) {
    return null
  }

  const totalEarned = transactions
    .filter(t => t.type === 'earn')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalSpent = transactions
    .filter(t => t.type === 'spend')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const totalExpired = transactions
    .filter(t => t.type === 'expire')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        {/* Balance Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-yellow-500" />
              Your Coins
            </CardTitle>
            <CardDescription>
              Use your coins for discounts on bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">{balance}</div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Earned</div>
                <div className="font-medium text-green-600">+{totalEarned}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Spent</div>
                <div className="font-medium text-blue-600">{totalSpent}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Expired</div>
                <div className="font-medium text-red-600">{totalExpired}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>How Coins Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Earning Coins</h4>
              <p className="text-sm text-muted-foreground">
                • Earn 5% of your booking value as coins
              </p>
              <p className="text-sm text-muted-foreground">
                • Coins are awarded after successful completion of service
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Using Coins</h4>
              <p className="text-sm text-muted-foreground">
                • 1 Coin = ₹1 discount
              </p>
              <p className="text-sm text-muted-foreground">
                • Use up to 20% of booking value in coins
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Important Notes</h4>
              <p className="text-sm text-muted-foreground">
                • Coins expire 6 months after being issued
              </p>
              <p className="text-sm text-muted-foreground">
                • Coins cannot be transferred or exchanged for cash
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <CoinHistory transactions={transactions} />

      {/* Expiring Coins Alert */}
      {transactions.some(t => 
        t.type === 'earn' && 
        t.expiryDate && 
        t.expiryDate > new Date() &&
        t.expiryDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      ) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Coins Expiring Soon</AlertTitle>
          <AlertDescription>
            Some of your coins will expire in the next 30 days. Use them before they expire!
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 