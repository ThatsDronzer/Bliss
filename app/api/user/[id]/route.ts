import { NextResponse } from 'next/server'
import connectDB from '@/lib/config/db'
import User from '@/model/user'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const user = await User.findOne({ clerkId: params.id }).lean()
   
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
   
    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    await connectDB();

    // Build the complete update object
    const updateData: any = {
      ...(data.name && { name: data.name }),
      ...(data.phone && { phone: data.phone }),
    };

    // Handle address updates - ensure all fields are included
    if (data.address) {
      updateData.address = {
        houseNo: data.address.houseNo || "",
        areaName: data.address.areaName || "",
        landmark: data.address.landmark || "",
        postOffice: data.address.postOffice || "",
        state: data.address.state || "",
        pin: data.address.pin || ""
      };
    }

    // Update the user with the complete address object
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: params.id },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser.toObject());
} catch (error: any) {
  console.error('Failed to update user data:', error.message, error);
  return NextResponse.json(
    { error: error.message || 'Failed to update user data' },
    { status: 500 }
  );
 }
}