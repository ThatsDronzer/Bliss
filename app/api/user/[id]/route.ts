import { NextResponse } from 'next/server'
import connectDB from '@/lib/config/db'
import User from '@/model/user'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const user = await User.findOne({ clerkId: params.id }).lean()
    return NextResponse.json(user || {})
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    await connectDB()
    
    // Prepare the update data with proper nested field handling
    const updateData = {
      name: data.name,
      phone: data.phone,
      'address.State': data.address?.State || '',
      'address.City': data.address?.City || '',
      'address.location': data.address?.location || '',
      'address.pinCode': data.address?.pinCode || ''
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: params.id },
      { $set: updateData }, // Use dot notation for nested fields
      { 
        new: true,
        runValidators: true
      }
    ).lean()

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update user data' },
      { status: 500 }
    )
  }
}