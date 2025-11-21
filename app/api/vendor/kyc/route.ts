import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Vendor from '@/model/vendor';

/**
 * POST /api/vendor/kyc
 * Submit enhanced KYC details (UPI, ID proof)
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get vendor by clerkId
    const vendor = await Vendor.findOne({ clerkId: userId });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    const body = await req.json();

    const {
      upiId,
      idProofType,
      idProofNumber,
      idProofUrl,
    } = body;

    // Validate fields
    if (!upiId) {
      return NextResponse.json(
        { error: 'UPI ID is required' },
        { status: 400 }
      );
    }

    if (!idProofType || !idProofNumber || !idProofUrl) {
      return NextResponse.json(
        { error: 'ID proof type, number, and document URL are required' },
        { status: 400 }
      );
    }

    // Validate ID proof type
    const validIdTypes = ['aadhar', 'pan', 'driving_license', 'passport', 'voter_id'];
    if (!validIdTypes.includes(idProofType)) {
      return NextResponse.json(
        { error: 'Invalid ID proof type' },
        { status: 400 }
      );
    }

    // Update vendor KYC details
    vendor.upiId = upiId;
    vendor.idProof = {
      type: idProofType,
      documentNumber: idProofNumber,
      documentUrl: idProofUrl,
      verified: false, // Admin needs to verify
    };

    await vendor.save();

    return NextResponse.json(
      {
        success: true,
        message: 'KYC details submitted successfully. Waiting for admin approval.',
        data: {
          upiId: vendor.upiId,
          idProof: vendor.idProof,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error submitting KYC:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/vendor/kyc
 * Get current KYC status
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get vendor by clerkId
    const vendor = await Vendor.findOne({ clerkId: userId });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          upiId: vendor.upiId,
          idProof: vendor.idProof,
          adminApproved: vendor.adminApproved,
          canParticipateInBidding: vendor.canParticipateInBidding,
          approvedAt: vendor.adminApprovedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching KYC status:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
