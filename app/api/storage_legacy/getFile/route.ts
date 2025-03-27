// app/api/storage/getFileDetails/route.ts
import { NextRequest } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { parseSize } from '@/utils/getSize';
import { formatGCSUrl } from '@/utils/gcsUrl';
const storage = new Storage();
const mindmapBucketName = process.env.GCP_ICS_MINDMAPS || 'ics-analysis-dev-mindmaps';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const fileName = searchParams.get('fileName');
    if (!folder || !fileName) {
      return Response.json({
        success: false,
        message: "Folder and fileName parameters are required"
      }, { status: 400 });
    }

    const bucket = storage.bucket(mindmapBucketName);
    const filePath = `${folder}/${fileName}`;
    const file = bucket.file(filePath);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      return Response.json({
        success: false,
        message: "File not found"
      }, { status: 404 });
    }

    // Get file metadata
    const [metadata] = await file.getMetadata();
    const sizeInBytes = parseSize(metadata.size);
    // Create GCS web URL
    const url = formatGCSUrl(mindmapBucketName, folder,fileName);
    const fileDetails = {
      name: fileName,
      blobPath: filePath,
      url: url,
      timeCreated: metadata.timeCreated || 'N/A',
      size: parseSize(sizeInBytes),
      metadata: {
        contentType: metadata.contentType,
        updated: metadata.updated,
        evaluation: metadata.metadata?.evaluation || {
          patterns: [],
          isFinished: false,
          lastModified: new Date().toISOString()
        }
      }
    };

    console.log(fileDetails)

    return Response.json({
      success: true,
      file: fileDetails,
      message: "File details retrieved successfully."
    });

  } catch (err: any) {
    console.error('Error retrieving file details:', err);
    return Response.json({
      success: false,
      message: "Failed to retrieve file details.",
      error: err.message
    }, { status: 500 });
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}