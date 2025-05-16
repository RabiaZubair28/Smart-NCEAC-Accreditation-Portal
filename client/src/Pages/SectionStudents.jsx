import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Components/Home/LoginNavbar.jsx";
import { SectionIcon } from "lucide-react";

const SectionStudents = () => {
  const params = useParams();
  const navigate = useNavigate();

  const batchId = params.batchId;
  const section = params.section;

  console.log(batchId);
  const [courseInfo, setCourseInfo] = useState(null);
  const [students, setStudents] = useState([]);

  // Fetch Course Info

  // Fetch Student Details
  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `http://localhost:1234/api/students/${batchId}/${section}`
      );
      const studentData = await res.json();
      setStudents(studentData);
    } catch (error) {
      console.log(`Error fetching students: ${error}`);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  console.log(students);

  return (
    <div className="">
      <Navbar />
      <div className="p-6">
        <div className="mt-[65px] mb-6">
          <div className="">
            <h2 className="text-xl font-bold text-[#1F2C73] mb-3">
              Enrolled Students
            </h2>
            <div className=" space-y-6">
              {students.length > 0 ? (
                students
                  .filter((student) => student !== null)
                  .map((student, index) => (
                    <div
                      key={student._id}
                      className="flex  justify-between  bg-gray-50 rounded-lg w-full"
                    >
                      <div className="flex justify-between w-full p-4">
                        <div className="flex flex-col xs:flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row xxl:flex-row  justify-between space-x-0 md:space-x-12 ">
                          <div className="text-md text-gray-900">
                            {index + 1}. {student.firstName} {student.lastName}
                          </div>

                          <div className="text-md font-medium">
                            {student.studentId}
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

export default SectionStudents;
