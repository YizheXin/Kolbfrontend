import { StorageOperations } from '@/features/routes/handleStorageOperations';
import BucketGrid from '@/components/bucket-grid/BucketGrid';

export default async function Home() {
  const { data } = await StorageOperations.fetchBuckets();
  
  return (
    <BucketGrid initialBuckets={data?.buckets || []} />
  );
}