'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface TestCase {
  'Test case ID': string;
  Tester: string;
  Stage: string;
}

interface TestGridProps {
  data: any;
  folderName: string;
  fileName: string;
}

const TestGrid: React.FC<TestGridProps> = ({ data, folderName, fileName }) => {
  const router = useRouter();
  const testCases: TestCase[] = data?.data?.data || [];

  const handleClick = (testCaseID: string) => {
    router.push(`/${folderName}/${fileName}/${testCaseID}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testCases.map((testCase) => (
          <div 
            key={testCase['Test case ID']} 
            onClick={() => handleClick(testCase['Test case ID'])}
            className="cursor-pointer bg-gray-800 text-white rounded-lg p-4 shadow-md hover:bg-gray-700 transition-colors"
          >
            <div className="text-center font-bold text-lg">
              {testCase['Test case ID']}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestGrid;
