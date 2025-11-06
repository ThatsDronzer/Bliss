"use client"

import * as React from "react"
import { format } from "date-fns"
import { ArrowUpCircle, ArrowDownCircle, XCircle } from "lucide-react"
import type { CoinTransaction } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CoinHistoryProps {
  transactions: CoinTransaction[]
}

export function CoinHistory({ transactions }: CoinHistoryProps) {
  const getTransactionIcon = (type: CoinTransaction['type']) => {
    switch (type) {
      case 'earn':
        return <ArrowUpCircle className="w-4 h-4 text-green-500" />
      case 'spend':
        return <ArrowDownCircle className="w-4 h-4 text-blue-500" />
      case 'expire':
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getTransactionBadge = (type: CoinTransaction['type']) => {
    switch (type) {
      case 'earn':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Earned</Badge>
      case 'spend':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Spent</Badge>
      case 'expire':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Expired</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coin History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(transaction.timestamp, 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTransactionIcon(transaction.type)}
                    {getTransactionBadge(transaction.type)}
                  </div>
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="text-right font-medium">
                  <span className={transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'earn' ? '+' : '-'}{Math.abs(transaction.amount)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 