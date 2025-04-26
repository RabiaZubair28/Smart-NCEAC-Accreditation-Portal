import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Components/Home/LoginNavbar.jsx";

const EnrolledStudents = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [courseInfo, setCourseInfo] = useState(null);
  const [students, setStudents] = useState([]);

  // Fetch Course Info
  const getCourseInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/data/course/id/${params.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setCourseInfo(data);
        fetchStudents(data.students); // Fetch students once course data is retrieved
      }
    } catch (error) {
      console.log(`Error fetching course data: ${error}`);
    }
  };

  // Fetch Student Details
  const fetchStudents = async (studentIds) => {
    try {
      const studentPromises = studentIds.map((id) =>
        fetch(`http://localhost:1234/api/students/id/${id}`).then((res) =>
          res.json()
        )
      );
      const studentData = await Promise.all(studentPromises);
      setStudents(studentData);
    } catch (error) {
      console.log(`Error fetching students: ${error}`);
    }
  };

  useEffect(() => {
    getCourseInfo();
  }, []);

  console.log(students);

  return (
    <div className="">
      <Navbar />
      <div className="">
        <div className="mt-[45px] mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#1F2C73] mb-6">
              Enrolled Students
            </h2>
            <div className="mb-6 space-y-6">
              {students.length > 0 ? (
                students
                  .filter((student) => student !== null)
                  .map((student, index) => (
                    <div
                      key={student._id}
                      className="flex flex-col xs:flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row xxl:flex-row  items-center justify-between p-3 bg-gray-50 rounded-lg w-full"
                    >
                      <div className="flex justify-between w-full">
                        <div className="flex flex-row justify-between space-x-12 items-center">
                          <div className="text-sm text-gray-900">
                            {index + 1}.
                          </div>
                          <div className="text-md font-medium">
                            {student.studentId}
                          </div>
                          <div className="text-md text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {student.studentEmail}
                          </div>
                          <div className="text-sm text-gray-400">
                            {student.gender}
                          </div>
                          <div className="text-md text-gray-400">
                            Department: {student.degreeProgram}
                          </div>
                          <div className="text-md text-gray-400">
                            Batch: {student.studentBatch} (
                            {student.studentSection})
                          </div>
                        </div>
                        <div className="flex items-center justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#1F2C73] text-white px-4 py-2 mb-6 rounded-md"
                            onClick={() =>
                              navigate(`/student/giveGrades/${student._id}`)
                            }
                          >
                            Go to Student
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500">No Enrolled Students</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledStudents;
