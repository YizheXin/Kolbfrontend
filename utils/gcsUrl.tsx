export function formatGCSUrl(bucketName: string, folder: string, filePath: string): string {
    // Encode the path components properly to ensure special characters like spaces are encoded
    const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
  
    return `https://storage.cloud.google.com/${bucketName}/${folder}/${encodedPath}`;
  }
  