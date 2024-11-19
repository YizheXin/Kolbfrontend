// app/api/storage/getFolders/route.ts
import { NextRequest } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { FolderItem } from '@/components/types/type';

const storage = new Storage();
const mindmapBucketName = process.env.GCP_ICS_MINDMAPS || 'ics-analysis-dev-mindmaps';

export async function GET(request: NextRequest) {
  try {
    const bucket = storage.bucket(mindmapBucketName);
    
    // Get all files first
    const [files] = await bucket.getFiles();
    
    // Create a Map to store folder information
    const folderMap = new Map<string, Set<string>>();

    // Process each file to extract folders and their contents
    files.forEach(file => {
      const pathParts = file.name.split('/');
      if (pathParts.length > 1 && pathParts[0]) {
        const folderName = pathParts[0];
        if (!folderMap.has(folderName)) {
          folderMap.set(folderName, new Set());
        }
        folderMap.get(folderName)?.add(file.name);
      }
    });

    // Convert to FolderItem array
    const folders: FolderItem[] = Array.from(folderMap.entries())
      .map(([prefix, files]) => ({
        prefix,
        type: 'folder' as const,
        itemCount: files.size
      }));

    console.log('Found folders:', folders);

    return Response.json({
      success: true,
      folders,
      message: "Folders retrieved successfully."
    });
  } catch (err: any) {
    console.error('Error retrieving folders:', err);
    return Response.json({
      success: false,
      message: "Failed to retrieve folders.",
      error: err.message
    }, { status: 500 });
  }
}