import React from 'react';

const QuestionBlock = ({ questionNumber, percentages }) => (
  <div>
    <h2 className="text-xl font-semibold text-[#1F2C73] mb-6">Question {String(questionNumber).padStart(2, '0')}</h2>
  <div className="grid grid-cols-3 gap-x-3 mt-8 ">
    {[1, 2, 3, 4, 5].map((num) => (
      <div key={num} className=" mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Percentage % in CLO {num}</label>
          {/**/}
        </div>
        <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
          {percentages[num - 1]}%
        </div>
        <span className="text-sm text-red-500">
            {percentages[num - 1] === 0 && '% for CLO ' + num + ' should be less than or equal to 100%'}
          </span> 
      </div>
     ) )} </div>
  </div>
);

export default QuestionBlock;