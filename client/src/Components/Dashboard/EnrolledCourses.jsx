import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EnrolledCourses = () => {
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);

  const calculateCLOAchievement = (course, cloId) => {
    let totalWeightedMarks = 0;
    let totalWeight = 0;

    if (!course || !course.assessments) {
      return 0;
    }

    course.assessments.forEach((assessment) => {
      assessment.questions?.forEach((question) => {
        if (!question.clos || question.totalQuestionMarks === 0) return;

        question.clos.forEach((clo) => {
          if (clo.cloId === cloId) {
            const weight = clo.cloWeight || 0;
            const obtained = question.obtainedMarks || 0;
            const total = question.totalQuestionMarks || 1;

            totalWeightedMarks += weight * (obtained / total);
            totalWeight += weight;
          }
        });
      });
    });

    if (totalWeight === 0) return 0;
    return (totalWeightedMarks / totalWeight) * 100;
  };

  const getStatusColor = (achievement) => {
    return achievement >= 70
      ? "bg-gray-200 text-black"
      : achievement >= 40
      ? "bg-gray-200 text-black"
      : "bg-gray-200 text-black";
  };

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:1234/api/students/id/${id}`
      );
      setStudent(response.data);

      if (response.data.courses?.length > 0) {
        const formattedCourses = response.data.courses.map((course) => {
          return {
            ...course,
            courseName: course.courseId?.courseName || "Unknown Course",
            courseCode: course.courseId?.courseCode || "",
            courseDescription: course.courseId?.courseDescription || "",
            creditHours: course.courseId?.creditHours || 0,
            assessments: course.assessments || [],
          };
        });
        setCourses(formattedCourses);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching student data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="mt-12 md:mt-24 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-[#1F2C73]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="mt-12 md:mt-24 text-center">
          <p className="text-black text-sm md:text-base">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 py-4 md:py-8">
        <h2 className="text-xl md:text-2xl font-bold text-[#1F2C73] mb-4 md:mb-6">
          Enrolled Courses
        </h2>

        {courses.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            {courses.map((course) => {
              const cloAchievements = {};
              [1, 2, 3].forEach((cloNum) => {
                const cloId = `CLO${cloNum}`;
                cloAchievements[cloId] = calculateCLOAchievement(course, cloId);
              });

              return (
                <div
                  key={course._id}
                  className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md overflow-hidden"
                >
                  {/* Course Header */}
                  <div className="p-4 md:p-6 border-b border-gray-200">
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold text-[#1F2C73]">
                          {course.courseName} ({course.courseCode})
                        </h3>
                        <p className="text-black text-sm md:text-base mt-1">
                          {course.courseDescription}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="bg-[#1F2C73] text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium self-start">
                          {course.creditHours} Credit Hours
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3].map((cloNum) => {
                            const cloId = `CLO${cloNum}`;
                            const achievement =
                              cloAchievements[cloId].toFixed(1);
                            return (
                              <span
                                key={cloId}
                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                  achievement
                                )}`}
                                title={`${cloId} Achievement`}
                              >
                                {cloId}: {achievement}%
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assessments Section */}
                  <div className="p-4 md:p-6">
                    <h4 className="text-base md:text-lg font-bold text-[#1F2C73] mb-3 md:mb-4">
                      Assessments
                    </h4>

                    {course.assessments.length > 0 ? (
                      <div className="space-y-3 md:space-y-4">
                        {course.assessments.map((assessment) => (
                          <div
                            key={assessment._id}
                            className="border border-gray-200 rounded-lg p-3 md:p-5 bg-gray-50"
                          >
                            {/* Assessment Header */}
                            <div className="flex flex-col gap-3 mb-3 md:mb-4">
                              <div>
                                <h5 className="font-bold text-base md:text-lg text-[#1F2C73]">
                                  {assessment.assessmentName}
                                </h5>
                                <div className="flex flex-wrap gap-2 mt-2 text-xs md:text-sm">
                                  <span className="bg-gray-200 text-black px-2 py-1 rounded">
                                    Type: {assessment.assessmentType}
                                  </span>
                                  <span className="bg-gray-200 text-black px-2 py-1 rounded">
                                    Total: {assessment.totalMarks}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded bg-gray-200 text-black`}
                                  >
                                    Obtained: {assessment.obtainedMarks}
                                  </span>
                                  <span className="bg-gray-200 text-black px-2 py-1 rounded">
                                    {(
                                      (assessment.obtainedMarks /
                                        assessment.totalMarks) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Questions Section */}
                            {assessment.questions?.length > 0 && (
                              <div className="mt-3 md:mt-4">
                                <h6 className="font-medium text-black text-sm md:text-base mb-2">
                                  Questions Breakdown:
                                </h6>
                                <div className="space-y-2 md:space-y-3">
                                  {assessment.questions.map(
                                    (question, qIndex) => {
                                      const questionCloAchievements = {};
                                      question.clos?.forEach((clo) => {
                                        const cloId = clo.cloId;
                                        const obtained =
                                          question.obtainedMarks || 0;
                                        const total =
                                          question.totalQuestionMarks || 1;
                                        questionCloAchievements[cloId] =
                                          (obtained / total) * 100;
                                      });

                                      return (
                                        <div
                                          key={question._id}
                                          className="pl-3 md:pl-4 border-l-4 border-[#1F2C73]"
                                        >
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <p className="font-medium text-sm md:text-base">
                                                Question {qIndex + 1}
                                              </p>
                                              <p className="text-xs md:text-sm text-black">
                                                Marks:{" "}
                                                <span className="font-medium">
                                                  {question.obtainedMarks}
                                                </span>{" "}
                                                / {question.totalQuestionMarks}
                                              </p>
                                            </div>
                                            <span
                                              className={`text-xs md:text-sm px-2 py-1 rounded bg-gray-200 text-black`}
                                            >
                                              {(
                                                (question.obtainedMarks /
                                                  question.totalQuestionMarks) *
                                                100
                                              ).toFixed(0)}
                                              %
                                            </span>
                                          </div>

                                          {question.clos?.length > 0 && (
                                            <div className="mt-2">
                                              <p className="text-xs md:text-sm font-medium text-black">
                                                Covered CLOs:
                                              </p>
                                              <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                                                {question.clos.map((clo) => (
                                                  <span
                                                    key={clo._id}
                                                    className={`text-xs px-2 py-1 rounded ${getStatusColor(
                                                      questionCloAchievements[
                                                        clo.cloId
                                                      ] || 0
                                                    )}`}
                                                    title={`Achievement: ${(
                                                      questionCloAchievements[
                                                        clo.cloId
                                                      ] || 0
                                                    ).toFixed(1)}%`}
                                                  >
                                                    CLO {clo.cloId} (Weight:{" "}
                                                    {clo.cloWeight}%)
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 md:py-8 bg-gray-50 rounded-lg">
                        <p className="text-black italic text-sm md:text-base">
                          No assessments available for this course.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12 bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md">
            <p className="text-black text-sm md:text-base">No courses found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;
