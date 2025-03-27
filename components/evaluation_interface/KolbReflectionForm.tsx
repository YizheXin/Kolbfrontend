import React, { useState } from 'react';
import { Table, TextInput, Textarea } from 'flowbite-react';

interface FormData {
  testCaseId: string;
  tester: string;
  stage: string;
  isKolbCycleReflection: string;
  experienceToReflect: string;
  marginalGain: string;
  sequenceOfEvents: string;
  feelingsAboutExperience: string;
  processAspects: string;
  challengeResponse: string;
  feelingTriggers: string;
  actionReasons: string;
  habitsAndBeliefs: string;
  similarResponses: string;
  potentialSolutions: string;
}

interface KolbReflectionFormProps {
  onSubmitData: (data: FormData) => void;
  isSubmitting: boolean;
}

interface Question {
  field: keyof FormData;
  label: string;
}

const KolbReflectionForm: React.FC<KolbReflectionFormProps> = ({ onSubmitData, isSubmitting }) => {
  const [formData, setFormData] = useState<FormData>({
    testCaseId: '',
    tester: '',
    stage: '',
    isKolbCycleReflection: '',
    experienceToReflect: '',
    marginalGain: '',
    sequenceOfEvents: '',
    feelingsAboutExperience: '',
    processAspects: '',
    challengeResponse: '',
    feelingTriggers: '',
    actionReasons: '',
    habitsAndBeliefs: '',
    similarResponses: '',
    potentialSolutions: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const questions: Question[] = [
    { field: 'testCaseId', label: 'Test case ID' },
    { field: 'tester', label: 'Tester' },
    { field: 'stage', label: 'Stage' },
    { field: 'isKolbCycleReflection', label: "Experience: Is this Kolb's cycle reflecting on an experiment from a previous Kolb's?" },
    { field: 'experienceToReflect', label: 'What experience do you want to reflect on?' },
    { field: 'marginalGain', label: 'What would a marginal gain look like?' },
    { field: 'sequenceOfEvents', label: 'Reflection: List and describe the sequence of events, in chronological order' },
    { field: 'feelingsAboutExperience', label: 'How did you feel about the experience?' },
    { field: 'processAspects', label: 'Which aspects (if any) of the process felt especially difficult? Which aspects felt like they went well?' },
    { field: 'challengeResponse', label: 'How did you respond to challenges and difficulties during this process?' },
    { field: 'feelingTriggers', label: 'What were the triggers to you feeling the way you did?' },
    { field: 'actionReasons', label: 'Why do you think you acted the way you did during this experience?' },
    { field: 'habitsAndBeliefs', label: 'Abstraction: What habits, beliefs, and tendencies can you identify from your reflection that explains why you acted the way you did?' },
    { field: 'similarResponses', label: 'Do you act or respond in similar ways in other parts of your life?' },
    { field: 'potentialSolutions', label: 'Experiment: List some potential solutions and actions to experiment on.' }
  ];

  return (
    <div className="overflow-y-auto max-h-full">
      <table className="w-full">
        <tbody className="divide-y divide-gray-700">
          {questions.map((question) => (
            <tr key={question.field} className="bg-gray-800 hover:bg-gray-700">
              <td className="whitespace-normal font-medium text-white p-4" style={{ width: '50%' }}>
                {question.label}
              </td>
              <td className="p-4">
                {question.field === 'sequenceOfEvents' || 
                 question.field === 'processAspects' || 
                 question.field === 'potentialSolutions' ? (
                  <textarea
                    value={formData[question.field]}
                    onChange={(e) => handleInputChange(question.field, e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData[question.field]}
                    onChange={(e) => handleInputChange(question.field, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KolbReflectionForm;