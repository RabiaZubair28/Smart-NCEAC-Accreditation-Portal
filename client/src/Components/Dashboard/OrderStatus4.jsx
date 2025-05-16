import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function OrderStatus4() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [cloList, setCloList] = useState([]);
  const { insid: instructorId } = useParams();

  // Fetch courses taught by the instructor
  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        `https://iba-nceac.site/api/dashboard/${instructorId}`
      );
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Fetch students enrolled in the given course IDs
  const fetchStudents = async (courseIds) => {
    try {
      const res = await axios.post(
        "https://iba-nceac.site/api/dashboard/students/by-courses",
        {
          courseIds,
        }
      );
      setStudents(res.data);

      // Collect all unique CLO ids across students for columns
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

  useEffect(() => {
    if (!instructorId) return;
    fetchCourses();
  }, [instructorId]);

  useEffect(() => {
    if (courses.length === 0) return;
    const courseIds = courses.map((c) => c._id);
    fetchStudents(courseIds);
  }, [courses]);

  // Calculate weighted CLO achievement for a student in a course for a particular CLO
  const calculateStudentCLOAchievement = (student, courseId, cloId) => {
    let cloScore = 0;

    // Find course object for student matching courseId
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
            const total = q.totalQuestionMarks || 1;
            const achievedRatio = obtained / total;
            cloScore += cloWeight * achievedRatio;
          }
        });
      });
    });

    return cloScore;
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-lg p-2 md:p-8">
      <div className="overflow-x-auto  ">
        {courses.map((course) => (
          <div key={course._id} className="mb-6 ">
            <h3 className="font-semibold mb-6 text-lg md:text-xl   text-gray-700">
              {course.courseName} ({course.courseCode})
            </h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-4">Student</th>
                  {cloList.map((cloId) => (
                    <th key={cloId} className="pb-4">
                      {cloId}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students
                  .filter((student) =>
                    student.courses.some((c) => {
                      const cId =
                        typeof c.courseId === "object"
                          ? c.courseId.toString()
                          : c.courseId;
                      return cId === course._id;
                    })
                  )
                  .map((student) => (
                    <tr key={student._id} className="border-t">
                      <td className="py-4 font-medium">
                        {student.firstName} {student.lastName}
                      </td>
                      {cloList.map((cloId) => {
                        const achievement = calculateStudentCLOAchievement(
                          student,
                          course._id,
                          cloId
                        );
                        const achieved = achievement > 0;
                        return (
                          <td key={cloId} className="py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                achieved
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {achievement.toFixed(2)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderStatus4;
