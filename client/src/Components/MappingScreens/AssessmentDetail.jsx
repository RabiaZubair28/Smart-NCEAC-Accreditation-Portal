import React from 'react';

const AssessmentDetail = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">{value}</div>
  </div>
);

export default AssessmentDetail;