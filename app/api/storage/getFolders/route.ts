import { NextRequest } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { FolderItem } from '@/components/types/type';

const storage = new Storage();
const mindmapBucketName = process.env.GCP_ICS_MINDMAPS || 'ics-analysis-dev-mindmaps';

// Helper function to check if file is a valid image
const isValidImageFile = (filename: string): boolean => {
  // List of valid image extensions
  const validExtensions = ['.png', '.jpg', '.jpeg', '.JPG','.PNG','.JPEG']; //'.gif', '.webp'
  const ext = filename.toLowerCase().split('.').pop();
  return ext ? validExtensions.includes(`.${ext}`) : false;
};

export async function GET(request: NextRequest) {
  try {
    
    const bucket = storage.bucket(mindmapBucketName);
    const [files] = await bucket.getFiles();
    
    // Create a Map to store folder information
    const folderMap = new Map<string, Set<string>>();

    // Process each file
    files.forEach(file => {
      const name = file.name;
      // Skip hidden files
      if (name.startsWith('.') || name.includes('/.')) {
        return;
      }

      const segments = name.split('/');
      
      if (segments.length > 0) {
        const folderName = segments[0];
        const fileName = segments[segments.length - 1];
        
        // Only count if it's a folder and contains valid image
        if (folderName && !folderName.includes('.') && isValidImageFile(fileName)) {
          if (!folderMap.has(folderName)) {
            folderMap.set(folderName, new Set());
          }
          folderMap.get(folderName)?.add(name);
        }
      }
    });

    // Convert to FolderItem array
    const folders: FolderItem[] = Array.from(folderMap.entries())
      .map(([prefix, files]) => ({
        prefix,
        type: 'folder' as const,
        itemCount: files.size
      }))
      .filter(folder => folder.prefix);

    console.log('API: Final folders found:', folders);

    return Response.json({
      success: true,
      folders,
      message: "Folders retrieved successfully."
    });
  } catch (err: any) {
    console.error('API Error:', err);
    return Response.json({
      success: false,
      message: "Failed to retrieve folders.",
      error: err.message
    }, { status: 500 });
  }
}