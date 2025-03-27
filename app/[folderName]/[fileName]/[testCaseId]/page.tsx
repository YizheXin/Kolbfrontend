'use client';

import { useEffect, useState } from 'react';
import { StorageOperations } from '@/features/routes/handleStorageOperations';
import { useRouter } from 'next/navigation';
import TestCaseDetails from '@/components/test-case-details/TestCaseDetails';
import { notFound } from 'next/navigation';

interface TestCase {
  "Test case ID": string;
  Tester: string;
  Stage: string;
  "Experience: Is this Kolb's cycle reflecting on an experiment from a previous Kolb's?": string;
  "What experience do you want to reflect on?": string;
  "What would a marginal gain look like?": string;
  "Reflection: List and describe the sequence of events, in chronological order": string;
  "How did you feel about the experience?": string;
  "Which aspects (if any) of the process felt especially difficult? Which aspects felt like they went well?": string;
  "How did you respond to challenges and difficulties during this process?": string;
  "What were the triggers to you feeling the way you did?": string;
  "Why do you think you acted the way you did during this experience?": string;
  "Abstraction: What habits, beliefs, and tendencies can you identify from your reflection that explains why you acted the way you did?": string;
  "Do you act or respond in similar ways in other parts of your life?": string;
  "Experiment: List some potential solutions and actions to experiment on.": string;
}

export default function Page({ 
  params: { folderName, fileName, testCaseId } 
}: { 
  params: { 
    folderName: string; 
    fileName: string; 
    testCaseId: string; 
  }; 
}) {
  const decodedFolderName = decodeURIComponent(folderName);
  const decodedFileName = decodeURIComponent(fileName);

  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await StorageOperations.fetchFile(decodedFolderName, decodedFileName)


        if (!response || !response.data || !Array.isArray(response?.data?.data)) {

          notFound();
        }

        const testCases: TestCase[] = response.data.data;

        const foundTestCase = testCases.find(
          (tc: TestCase) => tc['Test case ID'] === testCaseId
        );

        if (!foundTestCase) {
          notFound();
        }

        setTestCase(foundTestCase);
      } catch (error) {
        console.error(error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [decodedFolderName, decodedFileName, testCaseId, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!testCase) {
    return null;
  }

  return <TestCaseDetails data={testCase} />;
}
