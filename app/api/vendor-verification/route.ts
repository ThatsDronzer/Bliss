// /app/api/vendor-verification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Vendor from '@/model/vendor'; // adjust path as per your structure
import connectDB from '@/lib/config/db'; // your MongoDB connection util

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // connect to DB
    const body = await req.json();
    const {
      clerkId,
      owner_contactNo,
      ownerEmail,
      ownerImage,
      owner_address,
      ownerAadhar,
      service_name,
      service_email,
      service_phone,
      service_address,
      service_description,
      establishedYear,
      service_type,
      gstNumber,
      panNumber,
      bankName,
      accountNumber,
      ifscCode,
      accountHolderName
    } = body;

    if (!clerkId) {
      return NextResponse.json({ error: 'clerkId is required' }, { status: 400 });
    }

    const updatedVendor = await Vendor.findOneAndUpdate(
      { clerkId },
      {
        $set: {
          owner_contactNo,
          ownerEmail,
          ownerImage,
          owner_address,
          ownerAadhar,
          service_name,
          service_email,
          service_phone,
          service_address,
          service_description,
          establishedYear,
          service_type,
          gstNumber,
          panNumber,
          bankName,
          accountNumber,
          ifscCode,
          accountHolderName,
          isVerified: true,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedVendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, vendor: updatedVendor }, { status: 200 });

  } catch (error) {
    console.error('[VERIFY_VENDOR_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
