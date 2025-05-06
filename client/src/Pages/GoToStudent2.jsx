import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Home/LoginNavbar.jsx";

const GoToStudent2 = () => {
  // State variables
  const { id, courseCode } = useParams();
  const params = useParams();
  console.log(params);
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Grade assignment modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [gradeInput, setGradeInput] = useState("");

  console.log(id);
  console.log(courseCode);
  // Fetch student data
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://iba-nceac.site/api/students/id/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch student data");

      const data = await response.json();
      setStudent(data);
      console.log(student);

      if (data.courses?.length > 0) {
        const formattedCourses = data.courses.map((course) => ({
          ...course,
          courseName: course.courseId?.courseName || "Unknown Course",
          courseCode: course.courseId?.courseCode || "",
          courseDescription: course.courseId?.courseDescription || "",
          creditHours: course.courseId?.creditHours || 0,
          assessments: course.assessments || [],
        }));
        setCourses(formattedCourses);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePLOs = async () => {
    try {
      const response = await fetch(
        `https://iba-nceac.site/api/students/${id}/updatePLO`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (response.ok) {
        console.log("Updated PLOs:", result.PLO);
        alert("PLOs updated successfully!");
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getPLOAchievements = (student) => {
    const ploAchievements = [];

    student.assessments.forEach((assessment) => {
      assessment.questions.forEach((question) => {
        const { totalQuestionMarks, obtainedMarks, threshold, assignedPLO } =
          question;

        if (totalQuestionMarks >= (threshold / 100) * obtainedMarks) {
          // Extract PLO number, assuming it's like "PLO1" or "1"
          const ploIndex =
            typeof assignedPLO === "string" && assignedPLO.includes("PLO")
              ? parseInt(assignedPLO.replace("PLO", ""), 10) - 1
              : parseInt(assignedPLO, 10) - 1;

          if (!isNaN(ploIndex)) {
            ploAchievements[ploIndex] = 1;
          }
        }
      });
    });

    return ploAchievements;
  };

  // Open grade assignment modal
  const openGradeModal = (course, assessment, question) => {
    setCurrentCourse(course);
    setCurrentAssessment(assessment);
    setCurrentQuestion(question);
    setGradeInput(question.obtainedMarks || "");
    setModalOpen(true);
  };

  // Close modal
  const closeGradeModal = () => {
    setModalOpen(false);
    setCurrentQuestion(null);
    setCurrentAssessment(null);
    setCurrentCourse(null);
    setGradeInput("");
  };

  // Handle grade submission
  const handleGradeSubmit = async () => {
    // Validation
    if (!gradeInput || isNaN(gradeInput)) {
      alert("Please enter valid marks");
      return;
    }

    const obtainedMarks = parseFloat(gradeInput);
    if (obtainedMarks > currentQuestion.totalQuestionMarks) {
      alert(`Marks cannot exceed ${currentQuestion.totalQuestionMarks}`);
      return;
    }

    try {
      // Update local state
      const updatedCourses = courses.map((course) => {
        if (course._id === currentCourse._id) {
          const updatedAssessments = course.assessments.map((assessment) => {
            if (assessment._id === currentAssessment._id) {
              const updatedQuestions = assessment.questions.map((question) => {
                if (question._id === currentQuestion._id) {
                  // Only update obtainedMarks; keep threshold as is
                  return { ...question, obtainedMarks };
                }
                return question;
              });

              // Calculate new assessment total
              const newObtainedMarks = updatedQuestions.reduce(
                (sum, q) => sum + (q.obtainedMarks || 0),
                0
              );

              return {
                ...assessment,
                questions: updatedQuestions,
                obtainedMarks: newObtainedMarks,
              };
            }
            return assessment;
          });
          return { ...course, assessments: updatedAssessments };
        }
        return course;
      });

      setCourses(updatedCourses);

      // Update server
      const response = await fetch(
        `https://iba-nceac.site/api/students/${id}/courses/${currentCourse._id}/assessments/${currentAssessment._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            obtainedMarks: updatedCourses
              .find((c) => c._id === currentCourse._id)
              .assessments.find((a) => a._id === currentAssessment._id)
              .obtainedMarks,
            questions: updatedCourses
              .find((c) => c._id === currentCourse._id)
              .assessments.find((a) => a._id === currentAssessment._id)
              .questions,
          }),
        }
      );
      if (response.ok) {
        updatePLOs();
      }

      if (!response.ok) throw new Error("Failed to update marks");

      closeGradeModal();
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to update marks. Please try again.");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStudentData();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <Navbar />
        <div className="mt-24 flex justify-center">
          <div className="animate-spin rounded-md h-12 w-12 border-t-2 border-b-2 border-[#1F2C73]"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !student) {
    return (
      <div className="p-6">
        <Navbar />
        <div className="mt-24 text-center">
          <p className="text-red-500">Error: {error || "Student not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-[#1F2C73] text-white px-4 py-2 rounded-md hover:bg-[#17255A]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        {/* Student Profile */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 bg-gradient-to-r from-[#1F2C73] to-[#17255A]">
            <h1 className="text-2xl font-bold text-white">
              {student.firstName} {student.lastName}
            </h1>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-32">
                Student ID:
              </span>
              <span className="text-gray-900">{student.studentId}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-32">Email:</span>
              <span className="text-gray-900">{student.studentEmail}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-32">Batch:</span>
              <span className="text-gray-900">
                {student.studentBatch} ({student.studentSection})
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-32">Program:</span>
              <span className="text-gray-900">{student.degreeProgram}</span>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <h2 className="text-2xl font-bold text-[#1F2C73] mb-6">
          Enrolled Courses
        </h2>

        {courses.some((c) => c.courseCode === courseCode) ? (
          <div className="space-y-6">
            {courses
              .filter((course) => course.courseCode === courseCode)
              .map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  {/* Course Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div className="mb-4 md:mb-0 ">
                        <h3 className="text-xl font-semibold text-[#1F2C73]">
                          {course.courseName} ({course.courseCode})
                        </h3>
                        <p className="text-gray-600 mt-1 pe-10">
                          {course.courseDescription}
                        </p>
                      </div>
                      <div className="bg-[#1F2C73] text-white w-[150px] text-center px-3 py-1 rounded-xl text-sm font-medium">
                        {course.creditHours} Credit Hours
                      </div>
                    </div>
                  </div>

                  {/* Assessments */}
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-[#1F2C73] mb-4">
                      Assessments
                    </h4>

                    {course.assessments.length > 0 ? (
                      <div className="space-y-4">
                        {course.assessments.map((assessment) => (
                          <div
                            key={assessment._id}
                            className="border border-gray-200 rounded-lg p-5 bg-gray-50"
                          >
                            {/* Assessment Header */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                              <div>
                                <h5 className="font-bold text-lg text-[#1F2C73]">
                                  {assessment.assessmentName}
                                </h5>
                                <div className="flex flex-wrap gap-3 mt-2 text-sm">
                                  <span className="bg-gray-200 text-black  px-2 py-1 rounded">
                                    Type: {assessment.assessmentType}
                                  </span>
                                  <span className="bg-gray-200 text-black  px-2 py-1 rounded">
                                    Total: {assessment.totalMarks}
                                  </span>

                                  <span
                                    className={`px-2 py-1 rounded ${
                                      assessment.obtainedMarks >=
                                      assessment.totalMarks * 0.5
                                        ? "bg-gray-200 text-black "
                                        : "bg-gray-200 text-black "
                                    }`}
                                  >
                                    Obtained: {assessment.obtainedMarks}
                                  </span>
                                  <span className="bg-gray-200 text-black px-2 py-1 rounded">
                                    Percentage:{" "}
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

                            {/* Questions */}
                            {assessment.questions?.length > 0 && (
                              <div className="mt-4">
                                <h6 className="font-medium text-gray-700 mb-2">
                                  Questions Breakdown:
                                </h6>
                                <div className="space-y-3">
                                  {assessment.questions.map(
                                    (question, qIndex) => (
                                      <div
                                        key={question._id}
                                        className="pl-4 border-l-4 border-[#1F2C73]"
                                      >
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <p className="font-medium">
                                              Question {qIndex + 1}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                              Marks:{" "}
                                              <span className="font-medium">
                                                {question.obtainedMarks || 0}
                                              </span>{" "}
                                              / {question.totalQuestionMarks}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                              Threshold:{" "}
                                              <span className="font-medium">
                                                {question.threshold || 0}
                                              </span>{" "}
                                            </p>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <span
                                              className={`text-sm px-2 py-1 rounded ${
                                                (question.obtainedMarks || 0) >=
                                                question.totalQuestionMarks *
                                                  0.5
                                                  ? "bg-green-100 text-green-800"
                                                  : "bg-red-100 text-red-800"
                                              }`}
                                            >
                                              {(
                                                ((question.obtainedMarks || 0) /
                                                  question.totalQuestionMarks) *
                                                100
                                              ).toFixed(0)}
                                              %
                                            </span>
                                            <button
                                              onClick={() =>
                                                openGradeModal(
                                                  course,
                                                  assessment,
                                                  question
                                                )
                                              }
                                              className="bg-black text-white px-3 py-1 rounded text-sm"
                                            >
                                              Update
                                            </button>
                                          </div>
                                        </div>

                                        {question.clos?.length > 0 && (
                                          <div className="mt-2">
                                            <p className="text-sm font-medium text-gray-700">
                                              Covered CLOs:
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                              {question.clos.map((clo) => (
                                                <span
                                                  key={clo._id}
                                                  className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded"
                                                >
                                                  CLO: {clo.cloId} (Weight:{" "}
                                                  {clo.cloWeight}
                                                  %)
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        <div className="mt-2">
                                          <p className="text-sm font-medium text-gray-700">
                                            Covered PLOs:
                                          </p>
                                          <div className="flex flex-wrap gap-2 mt-1">
                                            <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">
                                              PLO: {question.assignedPLO}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 italic">
                          No assessments available
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500">No courses found</p>
          </div>
        )}
      </div>

      {/* Grade Assignment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex flex-row justify-between mb-4">
              <h3 className="text-xl font-bold text-black ">
                Give Grades to this question
              </h3>
              <button
                onClick={closeGradeModal}
                className="px-2 py-0.5 bg-red-500 text-white rounded-sm text-sm cursor-pointer"
              >
                X
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Enter Obtained Marks (Max: {currentQuestion.totalQuestionMarks})
              </label>
              <input
                type="number"
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2C73]"
                min="0"
                max={currentQuestion.totalQuestionMarks}
                step="0.5"
              />
            </div>
            <div className="flex justify-end gap-3 w-full">
              <button
                onClick={() => {
                  handleGradeSubmit();
                }}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-[#17255A] w-full"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoToStudent2;
