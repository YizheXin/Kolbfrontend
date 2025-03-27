import { StorageOperations } from '@/features/routes/handleStorageOperations';
import { notFound } from 'next/navigation';
import TestGrid from '@/components/test-grid/TestGrid';

export default async function Page({ 
  params: { folderName, fileName } 
}: { 
  params: { folderName: string; fileName: string } 
}) {
  const decodedFolderName = decodeURIComponent(folderName);
  const decodedFileName = decodeURIComponent(fileName);

  const response = await StorageOperations.fetchFile(decodedFolderName, decodedFileName);

  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <TestGrid 
      data={response} 
      folderName={decodedFolderName} 
      fileName={decodedFileName} 
    />
  );
}
