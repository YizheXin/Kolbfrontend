// app/[folderName]/[fileName]/page.tsx
import { StorageOperations } from '@/features/routes/handleStorageOperations';
import ImagePage from './ImagePageClient';
import { notFound } from 'next/navigation';

export default async function Page({ 
  params: { folderName, fileName } 
}: { 
  params: { folderName: string; fileName: string } 
}) {
  const decodedFolderName = decodeURIComponent(folderName);
  const decodedFileName = decodeURIComponent(fileName);
  
  const response = await StorageOperations.fetchFileDetails(decodedFolderName, decodedFileName);

  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <ImagePage 
      folderName={folderName}
      fileName={fileName}
      fileDetails={response.data}  // Pass just the data, not the whole response
    />
  );
}