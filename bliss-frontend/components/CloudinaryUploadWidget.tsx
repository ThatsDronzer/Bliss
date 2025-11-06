'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define TypeScript interfaces for Cloudinary
export interface CloudinaryUploadWidgetInfo {
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

// Extend the Window interface
declare global {
  interface Window {
    cloudinary: Cloudinary;
  }
}

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (imageInfo: CloudinaryUploadWidgetInfo) => void;
  onUploadError?: (error: any) => void;
  multiple?: boolean;
  maxFiles?: number;
  folder?: string;
  className?: string;
  children?: React.ReactNode;
}

const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  onUploadSuccess,
  onUploadError,
  multiple = true,
  maxFiles = 10,
  folder = 'listings',
  className = '',
  children
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const widgetRef = useRef<CloudinaryUploadWidget | null>(null);

  useEffect(() => {
    // Check if script is already loaded
    if (window.cloudinary) {
      setIsScriptLoaded(true);
      initializeWidget();
      return;
    }

    // Load Cloudinary widget script
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
      initializeWidget();
    };
    
    script.onerror = () => {
      console.error('Failed to load Cloudinary script');
      if (onUploadError) {
        onUploadError(new Error('Failed to load upload functionality'));
      }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initializeWidget = () => {
    if (!window.cloudinary) {
      console.error('Cloudinary not available');
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error('Cloudinary configuration missing');
      if (onUploadError) {
        onUploadError(new Error('Upload service not configured properly'));
      }
      return;
    }

    try {
      const newWidget = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          folder,
          cropping: true,
          croppingAspectRatio: 1,
          croppingDefaultSelectionRatio: 1,
          croppingShowDimensions: true,
          multiple,
          maxFiles,
          maxFileSize: 5000000, // 5MB
          sources: ['local', 'url', 'camera'],
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#90A0B3',
              tabIcon: '#0078FF',
              menuIcons: '#5A616A',
              textDark: '#000000',
              textLight: '#FFFFFF',
              link: '#0078FF',
              action: '#FF620C',
              inactiveTabIcon: '#0E2F5A',
              error: '#F44235',
              inProgress: '#0078FF',
              complete: '#20B832',
              sourceBg: '#E4EBF1'
            }
          }
        },
        (error: any | null, result: CloudinaryUploadResult) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            if (onUploadError) {
              onUploadError(error);
            }
            return;
          }

          if (result && result.event === 'success') {
            onUploadSuccess(result.info);
          } else if (result && result.event === 'close') {
            // Widget was closed
            console.log('Upload widget closed');
          }
        }
      );
      
      widgetRef.current = newWidget;
      setIsInitialized(true);
    } catch (error) {
      console.error('Error creating upload widget:', error);
      if (onUploadError) {
        onUploadError(error);
      }
    }
  };

  const openWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else if (!isScriptLoaded) {
      console.error('Cloudinary script not loaded yet');
    } else {
      console.error('Upload widget not initialized');
    }
  };

  return (
    <Button
      type="button"
      onClick={openWidget}
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
      disabled={!isScriptLoaded || !isInitialized}
    >
      <Upload className="h-4 w-4" />
      {children || 'Upload Images'}
    </Button>
  );
};

export default CloudinaryUploadWidget;