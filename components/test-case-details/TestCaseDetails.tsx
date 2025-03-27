import React, { useState, useEffect } from 'react';

interface TestCaseDetailsProps {
  data: Record<string, any>;
}

const patterns = [
  '',
  'Outcome as experience',
  'Behaviour over antecedents',
  'Studying over learning',
  'Long prestudy syndrome',
  'Brief reflection',
  'Superficial reflection',
  'Theoretical abstraction',
  'Random experimentation',
  'Reversion response to fear',
] as const;

type Pattern = typeof patterns[number];

const TestCaseDetails: React.FC<TestCaseDetailsProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div className="text-white">Test Case Not Found</div>;
  }

  // 初始化 pattern 状态
  const initialPatternState = Object.fromEntries(patterns.map((p) => [p, false])) as Record<Pattern, boolean>;
  const [selectedPatterns, setSelectedPatterns] = useState<Record<Pattern, boolean>>(initialPatternState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 从后端加载已存的 patterns
  useEffect(() => {
    async function fetchPatterns() {
      try {
        const response = await fetch(`/api/getPatterns?testCaseId=${encodeURIComponent(data['Test case ID'])}`);
        if (!response.ok) throw new Error('Failed to fetch patterns');
        const result = await response.json();
        setSelectedPatterns(result.patterns || initialPatternState);
      } catch (error) {
        console.error('Error loading patterns:', error);
      }
    }
    fetchPatterns();
  }, [data]);

  // 切换 pattern 选项
  const handlePatternToggle = (pattern: Pattern) => {
    setSelectedPatterns((prev) => ({
      ...prev,
      [pattern]: !prev[pattern],
    }));
  };

  // 提交 patterns 到后端
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submitPatterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCaseId: data['Test case ID'],
          patterns: selectedPatterns,
        }),
      });

      if (!response.ok) throw new Error('Submission failed');
      alert('Patterns submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-4">Test Case: {data['Test case ID']}</h1>

      {/* 数据展示表格 */}
      <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            <th className="py-3 px-4 text-sm font-semibold text-gray-200 text-left border-b border-gray-600">
              Field
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-200 text-left border-b border-gray-600">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, value], index) => (
            <tr
              key={key}
              className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}
            >
              <td className="py-3 px-4 text-gray-100 border-b border-gray-600">
                {key}
              </td>
              <td className="py-3 px-4 text-gray-100 border-b border-gray-600 whitespace-pre-wrap">
                {typeof value === 'string'
                  ? value
                  : JSON.stringify(value, null, 2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Patterns 选择部分 */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Select Patterns</h2>
        <div className="grid grid-cols-2 gap-3">
          {patterns.map((pattern) => (
            <label key={pattern} className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={selectedPatterns[pattern] || false}
                onChange={() => handlePatternToggle(pattern)}
                className="form-checkbox h-5 w-5 text-blue-500 rounded bg-gray-700 border-gray-600"
              />
              <span>{pattern.replace(/_/g, ' ')}</span>
            </label>
          ))}
        </div>

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Selected Patterns'}
        </button>
      </div>
    </div>
  );
};

export default TestCaseDetails;
