import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  className?: string
}

export function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("bg-white shadow-md hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
          <Icon className="h-4 w-4 text-pink-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && <p className="text-xs text-gray-500">{description}</p>}
        {trend && (
          <div className="flex items-center mt-1">
            <span 
              className={cn(
                "text-xs font-medium flex items-center gap-1",
                trend.positive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
