import { StorageOperations } from '@/features/routes/handleStorageOperations';
import FileGrid from '@/components/file-grid/FileGrid';
import { notFound } from 'next/navigation';

export default async function BucketPage({
  params: { folderName }
}: {
  params: { folderName: string }
}) {
  // URL decode the bucket name
  const decodedFolderName = decodeURIComponent(folderName);
  const { data } = await StorageOperations.fetchFiles(decodedFolderName);
  console.log("checking data on file grid",data.files.slice(-10))
  if (!data) {
    notFound();
  }

  return (
    <FileGrid 
      bucketName={decodedFolderName}
      initialFiles={data.files} 
    />
  );
}
