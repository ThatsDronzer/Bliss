import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

interface CloudinaryImage {
  url: string;
  public_id: string;
  [key: string]: any;
}

/**
 * Cleanup images from Cloudinary
 */
export async function cleanupImages(publicIds: string[]): Promise<void> {
  try {
    const validPublicIds = publicIds.filter(
      (id) => id && typeof id === 'string' && id.trim().length > 0
    );

    if (validPublicIds.length === 0) {
      console.log('No valid public IDs to delete');
      return;
    }

    console.log(`Deleting ${validPublicIds.length} images from Cloudinary:`, validPublicIds);

    const batchSize = 10;
    for (let i = 0; i < validPublicIds.length; i += batchSize) {
      const batch = validPublicIds.slice(i, i + batchSize);

      const deletionResults = await Promise.allSettled(
        batch.map(async (publicId: string) => {
          try {
            const result = await cloudinary.uploader.destroy(publicId);
            console.log(`Cloudinary deletion result for ${publicId}:`, result);
            return { publicId, result };
          } catch (error) {
            console.error(`Error deleting image ${publicId}:`, error);
            throw error;
          }
        })
      );

      deletionResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`Successfully deleted ${batch[index]}`);
        } else {
          console.error(`Failed to delete ${batch[index]}:`, result.reason);
        }
      });

      if (i + batchSize < validPublicIds.length) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    console.log('Image cleanup completed');
  } catch (error) {
    console.error('Error in cleanupImages:', error);
    throw error;
  }
}

export default cloudinary;

