'use client';

import { useEffect, useState } from 'react';
import { StorageOperations } from '@/features/routes/handleStorageOperations';
import BucketGrid from '@/components/bucket-grid/BucketGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Bucket } from '@/components/types/type';

export default function Home() {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const { data } = await StorageOperations.fetchBuckets();
        if (data?.buckets) {
          setBuckets(data.buckets);
        }
      } catch (error) {
        console.error('Error fetching buckets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuckets();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <BucketGrid initialBuckets={buckets} />;
}