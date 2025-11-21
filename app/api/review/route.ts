import mongoose from 'mongoose';
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing review id' }, { status: 400 });
    }
    // Only allow deletion if the review belongs to the user
    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    if (review.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await Review.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Review delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/config/db';
import Review from '@/model/review';

export async function POST(req: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { targetId, targetType, rating, comment, name, avatar } = await req.json();

    // Validate required fields
    const missingFields = [];
    if (!targetId) missingFields.push('targetId');
    if (!targetType) missingFields.push('targetType');
    if (!rating) missingFields.push('rating');
    if (!comment) missingFields.push('comment');
    if (!name) missingFields.push('name');
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        missingFields 
      }, { status: 400 });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Validate targetType
    if (!['service', 'vendor'].includes(targetType)) {
      return NextResponse.json({ error: 'Invalid targetType' }, { status: 400 });
    }

    // Check if user already reviewed this target
    const existingReview = await Review.findOne({ 
      userId, 
      targetId, 
      targetType 
    });
    //very basic rate limiting, if user already reviewed this item, return error
    // if (existingReview) {
    //   return NextResponse.json({ error: 'You have already reviewed this item' }, { status: 409 });
    // }

    // Create review with authenticated userId
    const review = new Review({ 
      userId, 
      targetId, 
      targetType, 
      rating, 
      comment, 
      name, 
      avatar 
    });
    await review.save();

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get('targetId');
    const targetType = searchParams.get('targetType');

    if (!targetId || !targetType) {
      return NextResponse.json({ error: 'Missing targetId or targetType' }, { status: 400 });
    }

    // Validate targetType
    if (!['service', 'vendor'].includes(targetType)) {
      return NextResponse.json({ error: 'Invalid targetType' }, { status: 400 });
    }

    const reviews = await Review.find({ targetId, targetType })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to prevent abuse

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Review fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
