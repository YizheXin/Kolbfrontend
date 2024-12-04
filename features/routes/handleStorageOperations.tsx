  // features/routes/handleStorageOperations.ts

  import { MindMapFile,Bucket, PatternState,FileResponse } from '@/components/types/type';
  import { constructVercelURL } from '@/utils/generateURL';
  import { formatGCSUrl } from '@/utils/gcsUrl';
  export const StorageOperations = {
    async fetchBuckets() {
      try {
        const response = await fetch(constructVercelURL('/api/storage/getFolders'));
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message);
        }

        // Filter out any non-folder items and map to bucket format
        const buckets = data.folders.map((folder: { prefix: string; type: string; itemCount: number }) => ({
          name: folder.prefix,
          displayName: folder.prefix,  // Removed replace() to preserve original name
          itemCount: folder.itemCount,
          type: 'folder',
          lastModified: new Date().toISOString()
        }));
        
        return {
          success: true,
          data: {
            buckets
          }
        };
      } catch (error) {
        console.error('Error fetching buckets:', error);
        return { 
          success: false, 
          message: 'Failed to fetch buckets',
          data: {
            buckets: []
          }
        };
      }
    },
  
    async fetchFiles(folderName: string) {
      try {
        const response = await fetch(constructVercelURL(`/api/storage/getImages?folder=${encodeURIComponent(folderName)}`));
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message);
        }
        
        const updatedFiles = data.files.map((file: any) => ({
          ...file,
          url: formatGCSUrl(process.env.NEXT_PUBLIC_GCP_ICS_MINDMAPS as string , folderName, file.name),
        }));
    
        return {
          success: true,
          data: {
            files: updatedFiles,
          },
        };
      } catch (error) {
        console.error('Error fetching files:', error);
        return { 
          success: false, 
          message: 'Failed to fetch files',
          data: {
            files: [] // Provide empty array as fallback
          }
        };
      }
    },
  
    async fetchFileDetails(folderName: string, fileName: string):Promise<FileResponse> {
      try {
        const url = constructVercelURL(
          `/api/storage/getFileDetails?folder=${encodeURIComponent(folderName)}&fileName=${encodeURIComponent(fileName)}`
        );
        console.log('Fetching file details from:', url);
  
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response not OK:', response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const reformattedUrl = formatGCSUrl(
          process.env.NEXT_PUBLIC_GCP_ICS_MINDMAPS as string,
          folderName,
          fileName
        );
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message);
        }
        
        return {
          success: true,
          data: {
            file: {
              name: data.file.name,
              blobPath: data.file.blobPath,
              url: reformattedUrl,
              timeCreated: data.file.timeCreated,
              size: data.file.size,
              metadata: {
                ...data.file.metadata,
                evaluation: data.file.metadata.evaluation || {
                  patterns: [],
                  isFinished: false,
                  lastModified: new Date().toISOString()
                }
              }
            }
          }
        };
      } catch (error) {
        console.error('Error fetching file details:', error);
        return { 
          success: false, 
          message: error instanceof Error ? error.message : 'Failed to fetch file details',
          data: null
        };
      }
    },
  
    async submitEvaluation(
      bucketName: string,
      blobPath: string,
      patterns: PatternState,
      isFinished: boolean
    ) {
      try {
        const response = await fetch(constructVercelURL('/api/evaluation/submit'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bucketName,
            blobPath,
            patterns,
            isFinished
          }),
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message);
        }
        
        return { success: true, message: 'Evaluation submitted successfully' };
      } catch (error) {
        console.error('Error submitting evaluation:', error);
        return { success: false, message: 'Failed to submit evaluation' };
      }
    }
  };