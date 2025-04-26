import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Components/Home/LoginNavbar.jsx";

const EnrolledStudents2 = () => {
  const params = useParams();
  const navigate = useNavigate();

  const courseCode = params.courseCode;
  const [courseInfo, setCourseInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const id = params.id;

  // Fetch Course Info
  const getCourseInfo = async () => {
    try {
      const response = await fetch(
        `https://iba-nceac.onrender.com/api/data/course/id/${params.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setCourseInfo(data);
        fetchStudents(data.students);
      }
    } catch (error) {
      console.log(`Error fetching course data: ${error}`);
    }
  };

  console.log(courseInfo);

  const [details, setDetails] = useState({});
  const getDetails = async () => {
    try {
      const response = await fetch(
        `https://iba-nceac.onrender.com/api/data/instructor/${courseInfo.instructorId}`
      );
      if (response.ok) {
        const data = await response.json();
        setDetails(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  console.log(details);

  useEffect(() => {
    getCourseInfo();
  }, []);

  useEffect(() => {
    getDetails();
  }, []);

  console.log(params);

  // Fetch Student Details
  const fetchStudents = async (studentIds) => {
    try {
      const studentPromises = studentIds.map((id) =>
        fetch(`https://iba-nceac.onrender.com/api/students/id/${id}`).then(
          (res) => res.json()
        )
      );
      const studentData = await Promise.all(studentPromises);
      setStudents(studentData);
    } catch (error) {
      console.log(`Error fetching students: ${error}`);
    }
  };

  // Handle checkbox selection
  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Handle bulk unenroll
  const handleBulkUnenroll = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student to unenroll");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to unenroll ${selectedStudents.length} student(s)?`
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://iba-nceac.onrender.com/api/students/unenroll/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentIds: selectedStudents }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to unenroll students");
      }

      alert(data.message || "Students unenrolled successfully!");
      getCourseInfo();
      setSelectedStudents([]);
    } catch (error) {
      console.error("Error unenrolling students:", error);
      alert(error.message || "Error unenrolling students");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <div className="mt-[65px] mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col justify-start   md:flex-row md:justify-between xs:flex-col xs:justify-start sm:flex-row sm:justify-between lg:flex-row lg:justify-between xl:flex-row xl:justify-between   items-start gap-y-3 xs:gap-y-3 sm:gap-y-0 md:gap-y-0 lg:gap-y-0 xl:gap-y-0 xxl:gap-y-0 mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1F2C73]">
                  Enrolled Students
                </h2>
                {selectedStudents.length > 0 && details.role == "HOD" && (
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedStudents.length} student(s) selected for
                    unenrollment
                  </p>
                )}
              </div>
              {selectedStudents.length > 0 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
                  onClick={handleBulkUnenroll}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Unenroll ${selectedStudents.length} Student(s)`
                  )}
                </motion.button>
              ) : (
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-md text-sm">
                  Select students to unenroll (Only if you are HOD)
                </div>
              )}
            </div>

            {/* Instructions */}
            {details.role == "HOD" && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>How to unenroll students:</strong> Check the boxes
                      next to student names, then click the "Unenroll" button
                      that appears.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6 space-y-6 flex flex-col">
              {students.length > 0 ? (
                students
                  .filter((student) => student !== null)
                  .map((student, index) => (
                    <motion.div
                      key={student._id}
                      className={`flex items-center justify-between p-3 rounded-lg w-full ${
                        selectedStudents.includes(student._id)
                          ? "bg-red-50 border border-red-200"
                          : "bg-gray-50"
                      }`}
                      whileHover={{ scale: 1.005 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <div className="flex flex-col xs:flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row xxl:flex-row justify-between w-full items-center">
                        <div className="flex items-center space-x-4">
                          <label className="inline-flex items-center">
                            {details.role == "HOD" && (
                              <input
                                type="checkbox"
                                checked={selectedStudents.includes(student._id)}
                                onChange={() =>
                                  handleCheckboxChange(student._id)
                                }
                                className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                              />
                            )}
                            <span className="ml-2 text-gray-700">
                              {index + 1}.
                            </span>
                          </label>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </span>
                            <span className="text-sm text-gray-500">
                              {student.studentId} • {student.studentEmail}
                            </span>
                            <span className="text-sm text-gray-500">
                              {student.degreeProgram} - {student.studentBatch} (
                              {student.studentSection})
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mx-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-[#1F2C73] text-white px-3 py-1 rounded-md text-sm"
                          onClick={() =>
                            navigate(
                              `/course/${courseCode}/${id}/student/giveGrades/${student._id}`
                            )
                          }
                        >
                          Go to Student
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No enrolled students
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are currently no students enrolled in this course.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledStudents2;
