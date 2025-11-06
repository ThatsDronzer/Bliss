"use client"

import * as React from "react"
import { Coins } from "lucide-react"
import { CoinService } from "@/lib/coin-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface CoinRedemptionProps {
  userId: string
  bookingAmount: number
  onApplyCoins: (discountAmount: number) => void
}

export function CoinRedemption({ userId, bookingAmount, onApplyCoins }: CoinRedemptionProps) {
  const [useCoins, setUseCoins] = React.useState(false)
  const [coinsToApply, setCoinsToApply] = React.useState(0)
  const [userBalance, setUserBalance] = React.useState(0)
  const [error, setError] = React.useState("")

  const maxAllowedCoins = Math.floor(bookingAmount * 0.2) // 20% of booking amount

  React.useEffect(() => {
    const fetchBalance = async () => {
      const balance = await CoinService.getUserBalance(userId)
      setUserBalance(balance)
    }
    fetchBalance()
  }, [userId])

  const handleCoinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    setCoinsToApply(Math.min(value, maxAllowedCoins, userBalance))
    setError("")
  }

  const handleApplyCoins = async () => {
    if (coinsToApply > 0) {
      const result = await CoinService.applyCoinsToBooking(
        userId,
        'temp-booking-id',
        bookingAmount,
        coinsToApply
      )

      if (result.success) {
        onApplyCoins(result.discountAmount!)
        setUserBalance(result.remainingBalance!)
      } else {
        setError(result.message!)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          Use Coins
        </CardTitle>
        <CardDescription>
          Apply your coins for a discount on this booking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="use-coins">Use coins for discount</Label>
            <Switch
              id="use-coins"
              checked={useCoins}
              onCheckedChange={(checked) => {
                setUseCoins(checked)
                if (!checked) {
                  setCoinsToApply(0)
                  onApplyCoins(0)
                }
              }}
            />
          </div>

          {useCoins && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Available Balance</span>
                  <span>{userBalance} coins</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Maximum Allowed</span>
                  <span>{maxAllowedCoins} coins</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coin-amount">Coins to apply</Label>
                <div className="flex gap-2">
                  <Input
                    id="coin-amount"
                    type="number"
                    min={0}
                    max={Math.min(maxAllowedCoins, userBalance)}
                    value={coinsToApply}
                    onChange={handleCoinInputChange}
                    disabled={!useCoins}
                  />
                  <Button onClick={handleApplyCoins} disabled={!useCoins || coinsToApply === 0}>
                    Apply
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• 1 Coin = ₹1 discount</p>
                <p>• You can use up to 20% of the booking amount in coins</p>
                <p>• Applied coins cannot be refunded</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 