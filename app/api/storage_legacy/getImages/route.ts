// app/api/storage/getFiles/route.ts
import { NextRequest } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { formatGCSUrl } from '@/utils/gcsUrl';
import { parseSize } from '@/utils/getSize';
// Initialize storage using ADC (Application Default Credentials)
const storage = new Storage();
// const storage = new Storage({
//   projectId: process.env.GCP_PROJECT_ID,
//   credentials: {
//     client_email: process.env.GCP_CLIENT_EMAIL,
//     private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//   },
// });
const mindmapBucketName = process.env.GCP_ICS_MINDMAPS || 'ics-analysis-dev-mindmaps';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');

    if (!folder) {
      return Response.json({
        success: false,
        files: [],
        message: "Folder parameter is required"
      }, { status: 400 });
    }
    console.log("Files retrieved from bucket:",folder);
    const bucket = storage.bucket(mindmapBucketName);
    const [files] = await bucket.getFiles({
      prefix: `${folder}/`,
      delimiter: '/'
    });
   
    const fileList = await Promise.all(
      files
        .filter(file => {
          const isNotFolder = !file.name.endsWith('/');
          const isImage = /\.(jpg|jpeg|png|webp|pneg)$/i.test(file.name);
          return isNotFolder && isImage;
        })
        .map(async file => {
          try {
            const [metadata] = await file.getMetadata();
            const sizeInBytes = parseSize(metadata.size);
            const url = formatGCSUrl(mindmapBucketName, folder, file.name);
            return {
              name: file.name.split('/').pop() || '',
              timeCreated: metadata.timeCreated || 'N/A',
              size: formatFileSize(sizeInBytes),
              type: getFileType(file.name),
              url,
              metadata: {
                contentType: metadata.contentType,
                updated: metadata.updated,
                evaluation: metadata.metadata?.evaluation
              }
            };
          } catch (error) {
            console.error("Error fetching metadata for file:", file.name, error);
            return null;
          }
        })
    );

    return Response.json({
      success: true,
      files: fileList,
      message: "Files retrieved successfully."
    });

  } catch (err: any) {
    console.error('Error retrieving files:', err);
    return Response.json({
      success: false,
      files: [],
      message: "Failed to retrieve files.",
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

function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const imageExts = ['jpg', 'jpeg', 'png'];
  return imageExts.includes(ext) ? 'image' : 'unknown';
}
