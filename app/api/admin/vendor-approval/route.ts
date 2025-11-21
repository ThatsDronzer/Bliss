import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Vendor from '@/model/vendor';

/**
 * POST /api/admin/vendor-approval
 * Approve a vendor for bidding (admin only)
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

    const body = await req.json();
    const { vendorId, approved, verifyIdProof } = body;

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Update approval status
    if (approved !== undefined) {
      vendor.adminApproved = approved;
      vendor.canParticipateInBidding = approved;

      if (approved) {
        vendor.adminApprovedAt = new Date();
        vendor.adminApprovedBy = userId;
      } else {
        vendor.adminApprovedAt = undefined;
        vendor.adminApprovedBy = undefined;
      }
    }

    // Verify ID proof if requested
    if (verifyIdProof && vendor.idProof) {
      vendor.idProof.verified = true;
      vendor.idProof.verifiedAt = new Date();
      vendor.idProof.verifiedBy = userId;
    }

    await vendor.save();

    return NextResponse.json(
      {
        success: true,
        message: `Vendor ${approved ? 'approved' : 'rejected'} successfully`,
        data: {
          vendorId: vendor._id,
          adminApproved: vendor.adminApproved,
          canParticipateInBidding: vendor.canParticipateInBidding,
          idProofVerified: vendor.idProof?.verified,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error approving vendor:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/vendor-approval
 * Get list of vendors pending approval
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

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status'); // 'pending', 'approved', 'all'

    let query: any = {};

    if (status === 'pending') {
      query = {
        upiId: { $exists: true },
        'idProof.documentUrl': { $exists: true },
        adminApproved: false,
      };
    } else if (status === 'approved') {
      query = { adminApproved: true };
    } else if (status === 'all') {
      query = {};
    } else {
      // Default: pending
      query = {
        upiId: { $exists: true },
        'idProof.documentUrl': { $exists: true },
        adminApproved: false,
      };
    }

    const vendors = await Vendor.find(query)
      .select('ownerName service_name ownerEmail owner_contactNo upiId idProof adminApproved adminApprovedAt canParticipateInBidding')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: vendors,
        total: vendors.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching vendors for approval:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
