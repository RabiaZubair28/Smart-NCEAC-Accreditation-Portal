import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import OrderStatus3 from "./OrderStatus3";
const chartColors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#ffc0cb",
];

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [cloList, setCloList] = useState([]);
  const { id: instructorId } = useParams();

  useEffect(() => {
    if (!instructorId) return;
    fetchCourses();
  }, [instructorId]);

  useEffect(() => {
    if (courses.length === 0) return;
    const courseIds = courses.map((c) => c._id);
    fetchStudents(courseIds);
  }, [courses]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        `http://localhost:1234/api/dashboard/${instructorId}`
      );
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchStudents = async (courseIds) => {
    try {
      const res = await axios.post(
        "http://localhost:1234/api/dashboard/students/by-courses",
        { courseIds }
      );
      setStudents(res.data);

      // Collect all unique CLO ids for columns
      const cloSet = new Set();
      res.data.forEach((student) => {
        student.courses.forEach((courseObj) => {
          courseObj.assessments?.forEach((assessment) => {
            assessment.questions?.forEach((q) => {
              q.clos?.forEach(({ cloId }) => {
                if (cloId) cloSet.add(cloId);
              });
            });
          });
        });
      });
      setCloList(Array.from(cloSet).sort());
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Calculate total max weighted marks possible for a course and clo
  const calculateCourseCLOMaxWeight = (courseId, cloId) => {
    let totalWeight = 0;
    const course = courses.find((c) => c._id === courseId);
    if (!course) return 0;

    course.assessments?.forEach((assessment) => {
      assessment.questions?.forEach((q) => {
        q.clos?.forEach(({ cloId: qCloId, cloWeight }) => {
          if (qCloId === cloId) {
            totalWeight += cloWeight * (q.totalQuestionMarks || 1);
          }
        });
      });
    });

    return totalWeight;
  };

  // Calculate weighted CLO achievement for a student/course/clo
  const calculateStudentCLOAchievement = (student, courseId, cloId) => {
    let weightedObtained = 0;

    const courseObj = student.courses.find((c) => {
      const cId =
        typeof c.courseId === "object" ? c.courseId.toString() : c.courseId;
      return cId === courseId;
    });

    if (!courseObj) return 0;

    courseObj.assessments?.forEach((assessment) => {
      assessment.questions?.forEach((q) => {
        q.clos?.forEach(({ cloId: qCloId, cloWeight }) => {
          if (qCloId === cloId) {
            const obtained = q.obtainedMarks || 0;
            weightedObtained += cloWeight * obtained;
          }
        });
      });
    });

    return weightedObtained * 100;
  };

  // Average CLO achievement for course and clo in percentage
  const calculateCourseCLOAverage = (courseId, cloId) => {
    const maxWeight = calculateCourseCLOMaxWeight(courseId, cloId);
    if (maxWeight === 0) return 0;

    let totalObtained = 0;
    let count = 0;

    students.forEach((student) => {
      const enrolled = student.courses.some((c) => {
        const cId =
          typeof c.courseId === "object" ? c.courseId.toString() : c.courseId;
        return cId === courseId;
      });

      if (!enrolled) return;

      const obtained = calculateStudentCLOAchievement(student, courseId, cloId);
      if (obtained > 0) {
        totalObtained += obtained;
        count++;
      }
    });

    if (count === 0) return 0;

    return Number((totalObtained / (count * maxWeight)).toFixed(2));
  };

  // Data for bar chart per course (avg CLO percentages)
  const getCourseBarChartData = (courseId) => {
    return cloList.map((cloId, index) => ({
      name: `${cloId}`,
      value: calculateCourseCLOAverage(courseId, cloId),
      fill: chartColors[index % chartColors.length],
    }));
  };

  // Data for pie chart per CLO (percentage of courses achieving that CLO)
  // This will show distribution of average CLO achievement across courses
  const getCLOPieChartData = (cloId) => {
    const data = courses.map((course, index) => {
      return {
        name: course.courseCode || course._id,
        value: calculateCourseCLOAverage(course._id, cloId),
        color: chartColors[index % chartColors.length],
      };
    });

    // Filter out zero values to clean up chart
    return data.filter((d) => d.value > 0);
  };

  return (
    <div className=" px-2 py-2 md:px-12 md:py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[#1F2C73] font-bold px-2 text-lg md:text-2xl mb-4 mt-2 md:mb-6">
          Course-wise Average CLO Achievement
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-gray-50 rounded-lg p-2 md:p-4 shadow border border-gray-100"
            >
              <h3 className="text-lg md:text-xl  font-semibold mb-4 text-gray-800">
                {course.courseCode || "Course"} - {course.courseName || ""}
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getCourseBarChartData(course._id)}>
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis
                    domain={[0, 100]}
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    name="Avg CLO Achievement"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                  >
                    {getCourseBarChartData(course._id).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-[#1F2C73] font-bold  text-lg md:text-2xl mt-2 md:my-2">
            CLO-wise Achievement Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8"></div>
        </div>
      </div>
      <div className="w-full">
        <OrderStatus3 />
      </div>
    </div>
  );
};

export default InstructorDashboard;
