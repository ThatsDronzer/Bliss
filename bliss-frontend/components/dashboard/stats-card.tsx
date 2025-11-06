import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  } | string
  change?: number
  className?: string
}

export function StatsCard({ title, value, description, icon: Icon, trend, change, className }: StatsCardProps) {
  // Handle trend prop being either an object or string
  const trendObj = typeof trend === 'string' 
    ? { value: trend, positive: trend === 'up' || change && change > 0 }
    : trend

  return (
    <Card className={cn("bg-white shadow-md hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="text-xl sm:text-2xl font-bold text-gray-900">{value}</div>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        {(trendObj || change !== undefined) && (
          <div className="flex items-center mt-1">
            <span 
              className={cn(
                "text-xs font-medium flex items-center gap-1",
                (trendObj?.positive || (change && change > 0)) ? "text-green-600" : "text-red-600"
              )}
            >
              {(trendObj?.positive || (change && change > 0)) ? "↑" : "↓"} 
              {trendObj?.value || (change !== undefined ? `${Math.abs(change)}%` : '')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
