'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FolderIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Bucket } from '../types/type';

interface BucketGridProps {
  initialBuckets: Bucket[];
}

export default function BucketGrid({ initialBuckets }: BucketGridProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [buckets] = useState<Bucket[]>(initialBuckets);

  const filteredBuckets = buckets.filter(bucket =>
    bucket.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBucketSelect = (bucket: Bucket) => {
    router.push(`/${encodeURIComponent(bucket.name)}`);
  };

  return (
    <div className="min-h-[calc(100vh-18rem)]"> {/* Adjusted minimum height */}
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search buckets..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Buckets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBuckets.map((bucket) => (
          <motion.div
            key={bucket.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleBucketSelect(bucket)}
            className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FolderIcon className="h-6 w-6 text-blue-400" />
              <div className="flex-1">
                <span className="text-white block">{bucket.displayName || bucket.name}</span>
                {bucket.itemCount !== undefined && (
                  <span className="text-gray-400 text-sm">{bucket.itemCount} items</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBuckets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No buckets found</p>
        </div>
      )}
    </div>
  );
}