import { NextResponse } from "next/server"
import connectDB from "@/lib/config/db"
import VendorVerification from "@/model/VendorVerification"

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()

  try {
    const newVendor = await VendorVerification.create(body)
    return NextResponse.json({ success: true, vendor: newVendor })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error saving data", error }, { status: 500 })
  }
}
