import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import cloPloMap from "../../Pages/Data.json";

function OrderStatus2() {
  const [students, setStudents] = useState([]);
  const params = useParams();
  const departmentId = params.id;

  const [departmentInfo, setDepartmentInfo] = useState({});
  const getDepartmentInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/data/department/${params.id}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDepartmentInfo(data);
        console.log(departmentInfo);
      }
    } catch (error) {
      console.log(`Services error: ${error}`);
    }
  };

  useEffect(() => {
    console.log("Department ID:", params.id);
    getDepartmentInfo();
  }, [params.id]);

  useEffect(() => {
    axios
      .get(`http://localhost:1234/api/students/allStudents/${departmentId}`)
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
      });
  }, []);

  const calculateSectionPLO = (batchName, sectionName, ploIndex) => {
    let count = 0;
    for (let i = 0; i < students.length; i++) {
      if (
        students[i].studentBatch === batchName &&
        students[i].studentSection === sectionName &&
        students[i].achievedPLOs[ploIndex] === 1
      ) {
        console.log(count);
        count++;
      }
    }
    return count;
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          Overall PLO Achievement Section-Wise
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="pb-4">Batch-Section</th>
              {Array.isArray(departmentInfo.PLO) &&
                departmentInfo.PLO.map((plo, index) => (
                  <th key={index} className="pb-4">
                    PLO {index + 1}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {(() => {
              const batchSectionSet = new Set();

              students.forEach((student) => {
                const batch = student.studentBatch;
                const section = student.studentSection;
                if (batch && section) {
                  batchSectionSet.add(`${batch}|${section}`);
                }
              });

              const sortedBatchSections = Array.from(batchSectionSet).sort();

              return sortedBatchSections.map((entry) => {
                const [batch, section] = entry.split("|");
                return (
                  <tr key={entry} className="border-t">
                    <td className="py-4 font-medium">{`${batch} (${section})`}</td>
                    {Array.isArray(departmentInfo.PLO) &&
                      departmentInfo.PLO.map((_, ploIndex) => (
                        <td key={ploIndex} className="py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              calculateSectionPLO(batch, section, ploIndex) > 0
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {calculateSectionPLO(batch, section, ploIndex)}
                          </span>
                        </td>
                      ))}
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderStatus2;
