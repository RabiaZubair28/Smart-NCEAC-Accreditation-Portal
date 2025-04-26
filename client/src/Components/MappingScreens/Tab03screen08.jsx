import React from 'react';
import { Plus } from 'lucide-react';
import AssessmentDetail from './AssessmentDetail';
import QuestionBlock from './QuestionBlock';

const App = () => {
  const assessmentData = {
    assessmentType: 'Assessment Type from Database',
    assessmentName: 'Assessment Name from Database',
    submissionDate: '2024-03-20',
    assessmentCategory: 'Assessment Category from Database',
    questions: [
      {
        number: 1,
        percentages: [30, 10, 20, 5, 15]
      },
      {
        number: 2,
        percentages: [0, 0, 0, 0, 0]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F2C73]/5 to-[#1F2C73]/10 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#1F2C73]">Assessment Details</h1>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <AssessmentDetail label="Assessment Type" value={assessmentData.assessmentType} />
            <AssessmentDetail label="Assessment Name" value={assessmentData.assessmentName} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <AssessmentDetail label="Submission Date" value={assessmentData.submissionDate} />
            <AssessmentDetail label="Assessment Category" value={assessmentData.assessmentCategory} />
          </div>

          {assessmentData.questions.map((question) => (
            <QuestionBlock 
              key={question.number}
              questionNumber={question.number}
              percentages={question.percentages}
            />
          ))}

          <div className="flex justify-end mt-8">
            <button className="flex items-center px-4 py-2 bg-[#1F2C73] text-white rounded-lg hover:bg-[#1F2C73]/90 transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Add New Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;