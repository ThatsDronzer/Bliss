"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Download, Filter, Calendar } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

export default function AdminReportsPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuth()
  const [reportType, setReportType] = useState("revenue")
  const [timeRange, setTimeRange] = useState("30")

  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/")
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  const handleGenerateReport = () => {
    toast({
      title: "Report Generation Started",
      description: "Your report is being generated. You'll receive a download link shortly.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button onClick={handleGenerateReport}>
          <Download className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue Report</SelectItem>
              <SelectItem value="users">User Growth Report</SelectItem>
              <SelectItem value="vendors">Vendor Performance Report</SelectItem>
              <SelectItem value="bookings">Booking Analytics Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-64">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Reports</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Reports</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Saved templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active schedules</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Generated On</TableHead>
                <TableHead>Time Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  id: "1",
                  name: "Monthly Revenue Report",
                  type: "Revenue",
                  generatedOn: "2024-03-15",
                  timeRange: "Last 30 days",
                  status: "Completed",
                },
                {
                  id: "2",
                  name: "User Growth Analysis",
                  type: "Users",
                  generatedOn: "2024-03-14",
                  timeRange: "Last 90 days",
                  status: "Completed",
                },
                {
                  id: "3",
                  name: "Vendor Performance Report",
                  type: "Vendors",
                  generatedOn: "2024-03-13",
                  timeRange: "Last 30 days",
                  status: "Completed",
                },
              ].map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{new Date(report.generatedOn).toLocaleDateString()}</TableCell>
                  <TableCell>{report.timeRange}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 