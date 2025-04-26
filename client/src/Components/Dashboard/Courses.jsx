import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";

export default function Courses() {
  const params = useParams();
  console.log(params);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  const getCourses = async () => {
    try {
      console.log("Fetching courses for ID:", params.id); // Debugging
      const response = await fetch(
        `https://iba-nceac.onrender.com/api/data/course/instructor/${params.id}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("API response data:", data); // Debugging
        setCourses(data);
        console.log(courses);
      }
    } catch (error) {
      console.error(`Error fetching courses: ${error}`);
    }
  };

  // useEffect to refetch when params.id changes
  useEffect(() => {
    getCourses();
  }, []); // Depend on params.id

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-2xl font-bold text-[#1F2C73]">
          Courses Information
        </h2>
      </motion.div>

      <AnimatePresence>
        {courses && courses.length > 0 ? (
          courses.map((course, index) => (
            <motion.div
              className="bg-white py-6 px-4 rounded-lg shadow-md mb-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.01 }}
              key={index}
            >
              <div className="mb-4">
                <div className=" text-gray-500 d-flex space-x-2 xs:space-x-2 sm:space-x-2 md:space-x-7 lg:space-x-7 xl:space-x-7 xxl:space-x-7 mb-4">
                  <span className="text-sm">S.No: {index + 1}</span>
                  <span className="text-md text-gray-500">
                    Credits: {course.creditHours}
                  </span>
                  <span className="text-md text-gray-500">
                    {course.courseCode} ({course.courseType})
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1F2C73]">
                  {course.courseName || "Unnamed Course"}
                </h3>
              </div>

              <div className="space-y-2 mb-6">
                {course.CLO && course.CLO.length > 0 ? (
                  course.CLO.map((outcome, idx) => (
                    <div key={idx} className="text-gray-600">
                      {idx + 1}. {outcome}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-600">No CLO available</div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <Download size={20} />
                  <span>Download Schema</span>
                </motion.button> */}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-[#1F2C73] text-white rounded-md hover:bg-[#283593]"
                  onClick={() => {
                    navigate(
                      `../../instructor-course/${course.courseCode}/${course._id}`
                    );
                  }}
                >
                  Go to Course
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <p>No courses found</p>
        )}
      </AnimatePresence>
    </div>
  );
}
