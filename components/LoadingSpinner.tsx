// components/LoadingSpinner.tsx
'use client';

import { Spinner } from 'flowbite-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="[&>*]:text-blue-500">  {/* Override Flowbite's default color */}
          <Spinner 
            aria-label="Loading"
            size="xl"
            color="purple"  // Keep purple for animation but override color
            className="opacity-90"
          />
        </div>
        <p className="mt-4 text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}