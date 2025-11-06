import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const { imageIds } = await req.json();

    if (!imageIds || !Array.isArray(imageIds)) {
      return NextResponse.json(
        { message: 'Image IDs array required' },
        { status: 400 }
      );
    }

    await Promise.all(
      imageIds.map(async (publicId: string) => {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error(`Error deleting image ${publicId}:`, error);
        }
      })
    );

    return NextResponse.json(
      { message: 'Images cleaned up successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in cleanup:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}