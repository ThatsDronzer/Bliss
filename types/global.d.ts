// types/global.d.ts
interface CloudinaryUploadWidgetInfo {
  asset_id: string;
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  [key: string]: any;
}

interface CloudinaryUploadResult {
  event: string;
  info: CloudinaryUploadWidgetInfo;
}

interface CloudinaryUploadWidget {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

interface Cloudinary {
  createUploadWidget: (
    options: Record<string, any>,
    callback: (error: any | null, result: CloudinaryUploadResult) => void
  ) => CloudinaryUploadWidget;
}

declare global {
  interface Window {
    cloudinary: Cloudinary;
  }
}

export {};