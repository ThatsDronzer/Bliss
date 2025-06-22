import { vendors } from "@/lib/data"
import { VendorClient } from "./VendorClient"
import { notFound } from "next/navigation"

export default function VendorDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  // Find the vendor from the actual vendors data
  const vendor = vendors.find(v => v.id === params.id)

  if (!vendor) {
    notFound()
  }

  return <VendorClient vendor={vendor} />
} 