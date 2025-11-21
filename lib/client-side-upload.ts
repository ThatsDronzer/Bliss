
export const uploadImagesOnSubmit = async (files: File[]): Promise<any[]> => {
  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'nextjs_unsigned_upload');
    formData.append('folder', 'listings');
    formData.append('tags', 'temporary');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    return response.json();
  });

  return Promise.all(uploadPromises);
};

export const deleteUploadedImage = async (publicId: string): Promise<void> => {
  try {
    await fetch('/api/delete-image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });
  } catch (error) {
    console.error('Failed to delete image:', error);
  }
};