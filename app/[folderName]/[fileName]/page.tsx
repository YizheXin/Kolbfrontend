import { StorageOperations } from '@/features/routes/handleStorageOperations';
import ImageEvaluation from '@/components/evaluation_interface/ImageEvaluationPage';
import { notFound } from 'next/navigation';
import { FileResponse  } from '@/components/types/type';

export default async function ImagePage({
  params: { folderName, fileName }
}: {
  params: { folderName: string; fileName: string }
}) {
  try {
    console.log("checking folderName and fileName", folderName, fileName);
    const response: FileResponse = await StorageOperations.fetchFileDetails(
      decodeURIComponent(folderName),
      decodeURIComponent(fileName)
    );

    if (!response.success || !response.data) {
      notFound();
    }

    return (
      <ImageEvaluation
        bucketName={folderName}
        file={response.data.file}
      />
    );
  } catch (error) {
    console.error('Error loading image:', error);
    notFound();
  }
}