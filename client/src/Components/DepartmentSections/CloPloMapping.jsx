import React from "react";
import mappingData from "../../Pages/Data.json";
import mappingData2 from "../../Pages/Data2.json";
import { useParams } from "react-router-dom";

const CloPloMapping = () => {
  const params = useParams();
  console.log(params.id);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#1F2C73] mb-2">CLO PLO Mapping</h2>

      {params.id === "67449e0a668ba5ffa0ac4036" && (
        <>
          {mappingData.map((course, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Course Name:</span>{" "}
                  {course.courseName}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Course Code:</span>{" "}
                  {course.courseCode}
                </p>
              </div>

              <div className="space-y-1">
                {course.clos.map((clo, cloIdx) => (
                  <p key={cloIdx} className="text-gray-600">
                    {clo.cloId} is contributing{" "}
                    <span className="font-semibold">{clo.weight}%</span> to{" "}
                    {clo.ploId}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
      {params.id === "67f61f2694cf3a16726ae3f0" && (
        <>
          {mappingData2.map((course, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Course Name:</span>{" "}
                  {course.courseName}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Course Code:</span>{" "}
                  {course.courseCode}
                </p>
              </div>

              <div className="space-y-1">
                {course.clos.map((clo, cloIdx) => (
                  <p key={cloIdx} className="text-gray-600">
                    {clo.cloId} is contributing{" "}
                    <span className="font-semibold">{clo.weight}%</span> to{" "}
                    {clo.ploId}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CloPloMapping;
