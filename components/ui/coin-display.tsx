"use client"

import * as React from "react"
import { Coins } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface CoinDisplayProps {
  balance: number
  className?: string
}

export function CoinDisplay({ balance, className }: CoinDisplayProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className={`flex items-center gap-2 cursor-pointer ${className}`}>
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="font-medium">{balance}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Your Coin Balance</h4>
          <p className="text-sm text-muted-foreground">
            You have {balance} coins. Use them for discounts on your next booking!
          </p>
          <div className="text-xs text-muted-foreground mt-2">
            <p>• 1 Coin = ₹1 discount</p>
            <p>• Coins expire 6 months after being issued</p>
            <p>• Use up to 20% of booking value in coins</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
} 