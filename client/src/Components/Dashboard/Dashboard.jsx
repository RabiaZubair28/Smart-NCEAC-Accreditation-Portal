import React from "react";

import { useState, useEffect } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import RecentActivities from "./RecentActivities.jsx";
import OrderStatus from "./OrderStatus.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import cloPloMap from "../../Pages/Data.json";

// Mocked PLO data — this would ideally be dynamic
const chartColors = {
  "Batch: Fall 2021": "#3b82f6",
  "Batch: Fall 2022": "#10b981",
  "Batch: Spring 2022": "#8b5cf6",
  "Batch: Fall 2023": "#f59e0b",
};

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [dynamicPieData, setDynamicPieData] = useState([]);

  var totalPL01 = 0;
  var totalPL02 = 0;
  var totalPL03 = 0;

  const [data, setData] = useState(null);

  const params = useParams();
  const departmentId = params.id;

  const [departmentInfo, setDepartmentInfo] = useState({});
  const getDepartmentInfo = async () => {
    try {
      const response = await fetch(
        `https://iba-nceac.site/api/data/department/${params.id}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDepartmentInfo(data);
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
      .get(`https://iba-nceac.site/api/students/allStudents/${departmentId}`)
      .then((res) => {
        setStudents(res.data);
        console.log("Fetched students:", res.data);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
      });
  }, []);

  useEffect(() => {
    const fetchAccreditation = async () => {
      try {
        const res = await axios.get(
          `https://iba-nceac.site/api/accreditation/getAccreditation/${departmentId}`
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching accreditation data:", err);
      }
    };

    if (departmentId) {
      fetchAccreditation();
    }
  }, [departmentId]);

  console.log(students);
  console.log(data);

  const generatePieDataForPLOs = () => {
    if (!departmentInfo.PLO || students.length === 0) return;

    const pieDataArray = departmentInfo.PLO.map((plo, index) => {
      let achieved = 0;

      students.forEach((student) => {
        if (student.achievedPLOs[index] === 1) {
          achieved++;
        }
      });

      return {
        name: `PLO${index + 1}`,
        data: [
          {
            name: `PLO${index + 1} Achieved`,
            value: achieved,
            color: "#3b82f6",
          },
          {
            name: `PLO${index + 1} Dismissed`,
            value: students.length - achieved,
            color: "#ef4444",
          },
        ],
      };
    });

    setDynamicPieData(pieDataArray);
  };

  useEffect(() => {
    generatePieDataForPLOs();
  }, [students, departmentInfo]);

  const calculateBatchPLO = (batchName, ploIndex) => {
    let count = 0;
    for (let i = 0; i < students.length; i++) {
      if (
        students[i].studentBatch === batchName &&
        students[i].achievedPLOs[ploIndex] === 1
      ) {
        count++;
      }
    }
    return count;
  };

  const uniqueBatches = [
    ...new Set(students.map((student) => student.studentBatch)),
  ];

  // uniqueBatches.forEach((batchName) => {
  //   console.log(`--- PLO Averages for Batch: ${batchName} ---`);
  //   console.log("PLO1:", calculatePLO1(batchName));
  // });

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-5 ">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-black font-bold text-start text-xl ">
                Overview of Department's Academic Progress
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 xxl:grid-cols-2 gap-4 mb-3">
            {uniqueBatches.map((batchName) => {
              const batchPLOData =
                departmentInfo.PLO?.map((plo, index) => ({
                  name: `PLO${index + 1}`,
                  value: calculateBatchPLO(batchName, index),
                })) || [];

              return (
                <div
                  key={batchName}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                >
                  <h3 className="text-sm font-semibold mb-2 text-gray-800">
                    Batch: {batchName}
                  </h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={batchPLOData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" fontSize={10} />
                        <YAxis fontSize={10} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          name="Achieved"
                          fill={chartColors[batchName] || "#8884d8"}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}

            {/* Left: Batch-wise Bar Charts */}
            {/* <div className="w-full">
              <h2 className="text-lg font-bold mb-4 text-gray-800">
                Overall PLO Achievement Batch-Wise
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {uniqueBatches.map((batchName) => {
                  const batchPLOData = [
                    { name: "PLO1", value: calculatePLO1(batchName) },
                    { name: "PLO2", value: calculatePLO2(batchName) },
                    { name: "PLO3", value: calculatePLO3(batchName) },
                  ];

                  return (
                    <div
                      key={batchName}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                    >
                      <h3 className="text-sm font-semibold mb-2 text-gray-800">
                        Batch: {batchName}
                      </h3>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={batchPLOData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0f0f0"
                            />
                            <XAxis dataKey="name" fontSize={10} />
                            <YAxis fontSize={10} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                              }}
                            />
                            <Bar
                              dataKey="value"
                              name="Achievement %"
                              fill={chartColors[batchName] || "#8884d8"}
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div> */}
          </div>
        </div>

        <div className="w-full bg-white rounded-lg shadow-lg p-5">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-black font-bold text-start text-xl ">
                Overview of Department's Academic Progress
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {dynamicPieData.map((plo, index) => (
              <div key={index} className="w-full">
                <h3 className="text-sm font-semibold mb-4 text-gray-800">
                  Overall {plo.name} Achievement
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={plo.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {plo.data.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col xs:flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row xxl:flex-row gap-5 mb-8 mt-4">
          <RecentActivities />
          <OrderStatus />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
