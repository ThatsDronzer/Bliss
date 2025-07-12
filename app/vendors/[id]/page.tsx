import { vendors } from "@/lib/data"
import { VendorClient } from "./VendorClient"
import { notFound } from "next/navigation"

export default async function VendorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Find the vendor from the actual vendors data
  const { id } = await params
  const vendor = vendors.find(v => v.id === id)

  if (!vendor) {
    notFound()
  }

  return <VendorClient vendor={vendor} />
} 