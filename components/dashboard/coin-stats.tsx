import { Coins } from "lucide-react"
import { StatsCard } from "./stats-card"

interface CoinStatsProps {
  coins: number;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function CoinStats({ coins, trend }: CoinStatsProps) {
  return (
    <StatsCard
      title="Your Coins"
      value={`₹${coins.toLocaleString()}`}
      description="Available balance"
      icon={Coins}
      trend={trend}
    />
  );
} 