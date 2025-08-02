import { NextResponse } from 'next/server'
import connectDB from '@/lib/config/db'
import Vendor from '@/model/vendor'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const vendor = await Vendor.findOne({ clerkId: params.id }).lean()
    return NextResponse.json(vendor || {})
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch vendor data' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    await connectDB()
    
    const updatedVendor = await Vendor.findOneAndUpdate(
      { clerkId: params.id },
      { $set: data },
      { 
        new: true,
        upsert: true,
        runValidators: true 
      }
    ).lean()

    return NextResponse.json(updatedVendor)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update vendor data' },
      { status: 500 }
    )
  }
}