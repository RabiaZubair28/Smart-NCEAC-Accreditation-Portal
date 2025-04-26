import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Home/LoginNavbar.jsx";
import { motion } from "framer-motion";

const GoToStudent = () => {
  // State variables
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [batch, setBatch] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSection, setNewSection] = useState("");

  // Grade assignment modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [gradeInput, setGradeInput] = useState("");
  const [showModalEdit, setShowModalEdit] = useState(false);
  // Fetch student data
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:1234/api/students/id/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch student data");

      const data = await response.json();
      setStudent(data);

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

  const handleAssignedPLOChange = (
    courseId,
    assessmentId,
    questionId,
    newPLO
  ) => {
    const updatedCourses = courses.map((course) => {
      if (course._id === courseId) {
        const updatedAssessments = course.assessments.map((assessment) => {
          if (assessment._id === assessmentId) {
            const updatedQuestions = assessment.questions.map((question) => {
              if (question._id === questionId) {
                return {
                  ...question,
                  assignedPLO: newPLO,
                };
              }
              return question;
            });
            return { ...assessment, questions: updatedQuestions };
          }
          return assessment;
        });
        return { ...course, assessments: updatedAssessments };
      }
      return course;
    });

    setCourses(updatedCourses);
  };

  const updatePLOs = async () => {
    try {
      const response = await fetch(
        `http://localhost:1234//api/students/${id}/updatePLO`,
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

  const fetchSectionsByBatchName = async (studentBatch) => {
    try {
      const res = await fetch(
        `http://localhost:1234/api/batches/sections/by-batch-name/${studentBatch}`
      );
      const data = await res.json();
      setBatch(data[0]);
      console.log(batch);
      console.log("Fetched sections:", data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  // Example call
  useEffect(() => {
    if (student?.studentBatch) {
      fetchSectionsByBatchName(student.studentBatch);
    }
  }, [student]);

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

  const updateSection = async () => {
    try {
      const res = await fetch(
        `http://localhost:1234/api/students/${student._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newSection }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update section");
      }

      const updatedStudent = await res.json();
      console.log("Student section updated:", updatedStudent);
      alert("Section changed successfully!");
      setShowModalEdit(false);
      // Optionally, refresh students list or update UI
    } catch (error) {
      console.error("Error updating section:", error);
    }
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
        `http://localhost:1234/api/students/${id}/courses/${currentCourse._id}/assessments/${currentAssessment._id}`,
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F2C73]"></div>
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
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
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
        <div className="flex flex-col justify-start   md:flex-row md:justify-between xs:flex-col xs:justify-start sm:flex-row sm:justify-between lg:flex-row lg:justify-between xl:flex-row xl:justify-between   items-start gap-y-3 xs:gap-y-3 sm:gap-y-0 md:gap-y-0 lg:gap-y-0 xl:gap-y-0 xxl:gap-y-0">
          {/* Courses Section */}
          <h2 className="text-2xl font-bold text-[#1F2C73]">
            Enrolled Courses
          </h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#1F2C73] text-white px-4 py-2 mb-6 rounded-md"
            onClick={() => {
              setShowModalEdit(true);
            }}
          >
            Change Section
          </motion.button>
        </div>

        {courses.length > 0 ? (
          <div className="space-y-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Course Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="mb-4 md:mb-0">
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
                                {assessment.assessmentName} (Achieved: PLO1)
                              </h5>
                              <div className="flex flex-wrap gap-3 mt-2 text-sm">
                                <span className="bg-gray-200 text-black px-2 py-1 rounded">
                                  Type: {assessment.assessmentType}
                                </span>
                                <span className="bg-gray-200 text-black px-2 py-1 rounded">
                                  Total: {assessment.totalMarks}
                                </span>

                                <span
                                  className={`px-2 py-1 rounded ${
                                    assessment.obtainedMarks >=
                                    assessment.totalMarks * 0.5
                                      ? "bg-gray-200 text-black"
                                      : "bg-gray-200 text-black"
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
                                            / {question.totalQuestionMarks}{" "}
                                            Threshold: 12
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`text-sm px-2 py-1 rounded ${
                                              (question.obtainedMarks || 0) >=
                                              question.totalQuestionMarks * 0.5
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
                                                CLO {clo.cloId} (Weight:{" "}
                                                {clo.cloWeight}%)
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
            <h3 className="text-xl font-bold text-[#1F2C73] mb-4">
              Give Grades to this question
            </h3>
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
            <div className="flex justify-end gap-3">
              <button
                onClick={closeGradeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleGradeSubmit}
                className="px-4 py-2 bg-[#1F2C73] text-white rounded-md hover:bg-[#17255A]"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {showModalEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-200 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96">
            <div className="flex justify-between pb-5">
              <h2 className="text-lg font-semibold">
                Change Section of {student.firstName} {student.lastName}
              </h2>
              <h2
                className="text-lg font-semibold cursor-pointer"
                onClick={() => setShowModalEdit(false)}
              >
                x
              </h2>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">From:</label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                value={student?.studentSection || ""}
                placeholder={student?.studentSection || ""}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">To:</label>
              <select
                className="mt-1 p-2 border rounded w-full"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
              >
                <option value="">Select Section</option>
                {batch?.sections &&
                  Object.keys(batch.sections).map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
              </select>
            </div>

            <button
              className="w-full bg-black text-white p-2 rounded mt-4"
              onClick={updateSection}
            >
              Change Section
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoToStudent;
