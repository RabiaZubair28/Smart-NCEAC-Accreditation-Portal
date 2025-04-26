import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, DeleteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Download, Plus } from "lucide-react";
import { Edit, Trash2 } from "lucide-react";
export default function OngoingCourses() {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [instructorInfo, setInstructorInfo] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [coursesInfo, setCoursesInfo] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalAdd02, setShowModalAdd02] = useState(false);

  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [students02, setStudents02] = useState([]);
  const [capturedCourseId, setCapturedCourseId] = useState(null);
  const [capturedCourseName, setCapturedCourseName] = useState(null);
  const [courseId, setCourseId] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    departmentName: "",
    courseName: "",
    courseType: "",
    courseCode: "",
    creditHours: "",
    prerequisites: "",
    courseDescription: "",
    startingDate: "",
    endingDate: "",
    CLO: [],
    PLO: [],
  });

  const handleStudentSelection = (studentId, isChecked) => {
    if (isChecked) {
      setSelectedStudents((prev) => [...prev, studentId]); // Add student
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId)); // Remove student
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      const res = await axios.delete(
        `https://iba-nceac.onrender.com/api/data/courses/${courseId}`
      );
      showNotification("Course deleted successfully", true); // Success notification
      setDeleteModal(false);
      window.location.reload(); // Optional: consider updating UI without full reload
    } catch (err) {
      console.error("Delete error:", err);
      showNotification("Failed to delete course", false); // Error notification
    }
  };

  const fetchStudents = async (batchName, section) => {
    try {
      const response = await fetch(
        `https://iba-nceac.onrender.com/api/students/fetchByBatch?batchName=${batchName}&section=${section}`
      );
      if (response.ok) {
        const data = await response.json();
        setStudents02(data.students);
      } else {
        const error = await response.json();
        console.error(error.message);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
    console.log(students02);
  };

  const getBatches = async () => {
    try {
      const response = await fetch(
        "https://iba-nceac.onrender.com/api/batches/all-batches",
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setBatches(data); // Assuming the data is an array of batches
      }
    } catch (error) {
      console.log(`Services error: ${error}`);
    }
  };

  // Fetch batches on component mount
  useEffect(() => {
    getBatches();
  }, []);

  console.log(batches);

  const [departments, setDepartments] = useState([]);
  const getDepartments = async () => {
    try {
      const response = await fetch(
        "https://iba-nceac.onrender.com/api/data/departments",
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error(`Services error: ${error}`);
      showNotification("Failed to fetch departments", false);
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);

  // Handle batch selection
  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
    setSelectedSection(""); // Reset section when batch changes
    setStudents([]); // Clear students when batch changes
  };

  // Handle section selection
  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  // Handle showing students when the button is clicked
  const handleShowStudents = () => {
    console.log(selectedBatch);
    console.log(selectedSection);
    console.log(batches[0].batchName);

    for (let i = 0; i < batches.length; i++) {
      if (batches[i].batchName == selectedBatch) {
        console.log(batches[i].sections);
        console.log(batches[i].sections[selectedSection]);
        var filteredStudents = batches[i].sections[selectedSection];
        setStudents(filteredStudents);
        fetchStudents(selectedBatch, selectedSection);
      }
    }
  };

  const [newCLO, setNewCLO] = useState(""); // Temporary state for adding PLO

  const handleCLOAdd = () => {
    if (!newCLO.trim()) {
      toast.error("CLO cannot be empty");
      return;
    }

    // Check for duplicate CLO (case-insensitive)
    const isDuplicate = formData.CLO.some(
      (clo) => clo.toLowerCase() === newCLO.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.error("This CLO already exists (case-insensitive)");
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      CLO: [...prevState.CLO, newCLO.trim()],
    }));
    setNewCLO("");
  };

  const handleCLORemove = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      CLO: prevState.CLO.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getInstructors = async () => {
    try {
      const response = await fetch(
        "https://iba-nceac.onrender.com/api/data/instructors",
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setInstructors(data); // Assuming setDepartments is the state updater for the departments data
      }
    } catch (error) {
      console.log(`Services error: ${error}`);
    }
  };

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isSuccess: false,
  });

  // Show notification
  const showNotification = (message, isSuccess) => {
    setNotification({ show: true, message, isSuccess });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  useEffect(() => {
    getInstructors();
  }, []);

  const getCoursesInfo = async () => {
    try {
      const response = await fetch(
        `https://iba-nceac.onrender.com/api/data/department/id/${params.id}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setCoursesInfo(data);
        console.log(coursesInfo);
      }
    } catch (error) {
      console.log(`services error: ${error}`);
    }
  };

  useEffect(() => {
    getCoursesInfo();
  }, []);

  console.log(instructors);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure an instructor is selected
    if (!selectedInstructor) {
      showNotification("Please select an instructor", false);
      return;
    }

    // Add instructorId to formData
    const courseData = {
      ...formData,
      instructorId: selectedInstructor,
      departmentId: params.id,
    };

    console.log(params.id);
    console.log(selectedInstructor);

    try {
      const response = await fetch(
        `https://iba-nceac.onrender.com/api/data/course/${selectedInstructor}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        }
      );

      if (response.ok) {
        // Parse the JSON response first
        const data = await response.json();
        console.log(data);
        // Capture the ObjectId and courseCode of the newly created course

        setCapturedCourseId(data.course._id);
        setCapturedCourseName(data.course.courseName);

        console.log("Newly Created Course ID:", data.course._id);
        console.log("Newly Created Course Code:", data.course.courseCode);

        showNotification("Course Added Successfully!", true);
        setShowModalAdd(false); // Close the modal after successful submission
        // setShowModalAdd02(true);
        getCoursesInfo(); // Refresh courses list

        // Reset form data
        setFormData({
          departmentName: "",
          courseName: "",
          courseType: "",
          courseCode: "",
          creditHours: "",
          prerequisites: "",
          courseDescription: "",
          startingDate: "",
          endingDate: "",
          CLO: [],
          PLO: [],
        });
      } else {
        // If the response is not okay, parse the error message
        const error = await response.json();
        console.error("Error adding course:", error);
        showNotification("Failed to add course", false);
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("Failed to add course", false);
    }
  };

  const addCourseIdInStudents = async () => {
    for (let i = 0; i < selectedStudents.length; i++) {
      console.log("studentId", selectedStudents[i]);
      console.log("courseId", capturedCourseId);
      try {
        const response = await fetch(
          `https://iba-nceac.onrender.com/api/students/${selectedStudents[i]}/add-course`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              courseId: capturedCourseId,
              courseName: capturedCourseName,
            }),
          }
        );

        if (response.ok) {
          console.log(`Course added for student ${selectedStudents[i]}`);
        } else {
          console.error(
            `Failed to add course for student ${selectedStudents[i]}`
          );
        }
      } catch (error) {
        console.error(`Error updating student ${selectedStudents[i]}:`, error);
      }
    }

    toast.success("Courses updated for selected students!");
    setSelectedStudents([]); // Reset selected students
    window.location.reload();
  };

  return (
    <div className="">
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
              notification.isSuccess ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
      <div>
        <div className=" p-6 flex flex-col justify-start   md:flex-row md:justify-between xs:flex-col xs:justify-start sm:flex-row sm:justify-between lg:flex-row lg:justify-between xl:flex-row xl:justify-between   items-start gap-y-3 xs:gap-y-3 sm:gap-y-0 md:gap-y-0 lg:gap-y-0 xl:gap-y-0 xxl:gap-y-0">
          <h2 className="text-xl font-bold text-[#1F2C73]">Ongoing Courses</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#1F2C73] text-white px-4 py-2 rounded-md flex flex-row items-center space-x-2"
            onClick={() => {
              setShowModalAdd(true);
            }}
          >
            <Plus size={20} />
            <span>Create New Course</span>
          </motion.button>
        </div>

        <div className="grid gap-4">
          {coursesInfo && coursesInfo.length > 0 ? (
            coursesInfo.map((course, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className="bg-white py-6 px-4 rounded-lg shadow-md"
              >
                <div className="flex flex-col justify-start   md:flex-row md:justify-between xs:flex-col xs:justify-start sm:flex-row sm:justify-between lg:flex-row lg:justify-between xl:flex-row xl:justify-between   items-start gap-y-3 xs:gap-y-3 sm:gap-y-0 md:gap-y-0 lg:gap-y-0 xl:gap-y-0 xxl:gap-y-0">
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500">
                      S.No: {index + 1}
                    </div>
                    <div className="text-lg font-semibold text-[#1F2C73]">
                      {course.courseName}
                    </div>
                    <div className="text-sm text-gray-600 space-x-5">
                      <span>Credit Hours: {course.creditHours}</span>
                      <span>
                        {course.courseCode} ({course.courseType})
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">
                      {course.courseDescription}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 py-2 my-1 bg-[#1F2C73] text-white rounded-lg hover:bg-[#283593] w-[140px] text-center"
                      onClick={() => {
                        navigate(`/course/${course._id}`); // Changed to `course._id` for the correct ID
                      }}
                    >
                      <span>Go to Course</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-black rounded-lg w-[140px] text-center"
                      onClick={() => {
                        // Changed to `course._id` for the correct ID
                        setCourseId(course._id);
                        setDeleteModal(true);
                      }}
                    >
                      <span>Delete Course</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-gray-600 text-center mt-8">
              No courses available at the moment.
            </div>
          )}
        </div>
      </div>
      {showModalAdd && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50  z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 lg:w-2/3">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Add New Course</h2>
              <button
                className="text-sm font-semibold bg-red-600 text-white py-0.5 px-2 rounded-sm cursor-pointer"
                onClick={() => setShowModalAdd(false)}
              >
                X
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Department Name */}
                <div>
                  <label className="block text-gray-700">
                    Department Name:
                  </label>
                  <select
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept.departmentName}>
                        {dept.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course Name */}
                <div>
                  <label className="block text-gray-700">
                    Course Name: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                    placeholder="Enter Course Name"
                    required
                  />
                </div>

                {/* Course Type */}
                <div>
                  <label className="block text-gray-700">Course Type:</label>
                  <select
                    name="courseType"
                    value={formData.courseType}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                    required
                  >
                    <option value="" disabled>
                      Select Course Type
                    </option>
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                    <option value="Optional">Optional</option>
                  </select>
                </div>

                {/* Course Code */}
                <div>
                  <label className="block text-gray-700">
                    Course Code: <span className="text-red-500">*</span> (should
                    be unique)
                  </label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                    placeholder="Enter Course Code (e.g., CS101)"
                    required
                  />
                </div>

                {/* Credit Hours */}
                <div>
                  <label className="block text-gray-700">Credit Hours:</label>
                  <input
                    type="number"
                    name="creditHours"
                    value={formData.creditHours}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                    placeholder="Enter Credit Hours"
                    min="1"
                    max="6"
                    required
                  />
                </div>

                {/* Prerequisites */}
                <div>
                  <label className="block text-gray-700">Prerequisites:</label>
                  <input
                    type="text"
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                    placeholder="Enter Prerequisites (comma-separated)"
                  />
                </div>

                {/* Starting Date */}
                <div>
                  <label className="block text-gray-700">Starting Date:</label>
                  <input
                    type="text"
                    name="startingDate"
                    value={formData.startingDate}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                    required
                  />
                </div>

                {/* Ending Date */}
                <div>
                  <label className="block text-gray-700">Ending Date:</label>
                  <input
                    type="text"
                    name="endingDate"
                    value={formData.endingDate}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                    required
                  />
                </div>

                {/* Instructor */}
                <div>
                  <label className="block text-gray-700">Instructor:</label>
                  <select
                    name="instructorId"
                    value={selectedInstructor}
                    onChange={(e) => setSelectedInstructor(e.target.value)}
                    className="mt-1 p-2 border rounded w-full"
                    required
                  >
                    <option value="" disabled>
                      Select an Instructor
                    </option>
                    {instructors.map((instructor) => (
                      <option key={instructor._id} value={instructor._id}>
                        {instructor.firstName} {instructor.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Description */}
                <div className="mt-6">
                  <label className="block text-gray-700">
                    Course Description:
                  </label>
                  <textarea
                    name="courseDescription"
                    value={formData.courseDescription}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                    placeholder="Enter Course Description"
                    required
                  />
                </div>

                {/* Course Learning Objectives */}
                <div className="mt-6">
                  <label className="block text-gray-700">
                    Course Learning Objectives:
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newCLO}
                      onChange={(e) => setNewCLO(e.target.value)}
                      className="mt-1 p-2 border rounded w-full"
                      placeholder="Enter a CLO"
                    />

                    <button
                      type="button"
                      onClick={handleCLOAdd}
                      className="bg-black text-white px-4 py-1 rounded"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="list-disc pl-5">
                    {formData.CLO.map((clo, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>{clo}</span>
                        <button
                          className="bg-white text-red-500 px-2 py-1 rounded"
                          onClick={() => handleCLORemove(index)}
                        >
                          <Trash2 size={20} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded mt-6"
              >
                Add Course
              </button>
            </form>
          </div>
        </div>
      )}

      {showModalAdd02 && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-200 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 lg:w-2/3">
            <div>
              <div
                onClick={() => {
                  setShowModalAdd02(false);
                }}
              >
                x
              </div>
              <label className="block text-gray-700">
                Select Batch & Section:
              </label>

              {/* Batch Dropdown */}
              <select
                className="mt-1 p-2 border rounded w-full"
                value={selectedBatch}
                onChange={handleBatchChange}
                required
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch.batchName}>
                    {batch.batchName}
                  </option>
                ))}
              </select>

              {/* Section Dropdown */}
              {selectedBatch && (
                <select
                  className="mt-2 p-2 border rounded w-full"
                  value={selectedSection}
                  onChange={handleSectionChange}
                  required
                >
                  <option value="">Select Section</option>
                  {Object.keys(
                    batches.find((batch) => batch.batchName === selectedBatch)
                      ?.sections || {}
                  ).map((sectionName, index) => (
                    <option key={index} value={sectionName}>
                      {sectionName}
                    </option>
                  ))}
                </select>
              )}

              {/* Button to show students */}
              {selectedBatch && selectedSection && (
                <button
                  className="mt-4 p-2 bg-blue-500 text-white rounded"
                  onClick={handleShowStudents}
                >
                  Show Students
                </button>
              )}

              {/* Displaying students for the selected section */}
              {students.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold">
                    Students in {selectedBatch} - {selectedSection}:
                  </h3>
                  <ul>
                    {students02.map((student, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {student.firstName} {student.lastName} (
                          {student.studentId} {student.studentEmail})
                        </span>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student._id)}
                          onChange={(e) =>
                            handleStudentSelection(
                              student._id,
                              e.target.checked
                            )
                          }
                        />
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      addCourseIdInStudents();
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                  >
                    Add Course to Selected Students
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg w-80 text-center">
            <div className="flex flex-row justify-between">
              <h2 className="text-lg font-bold text-gray-800">Delete Course</h2>
              <button
                className="text-sm font-semibold bg-red-600 text-white py-0.5 px-2 rounded-sm cursor-pointer"
                onClick={() => setDeleteModal(false)}
              >
                X
              </button>
            </div>
            <p className="text-gray-600 my-6">
              Are you sure want to delete this course? This action cannot be
              undone.
            </p>
            <div className="mt-4 flex justify-center space-x-4 w-full">
              <button
                onClick={() => {
                  deleteCourse(courseId);
                }}
                className="bg-black text-white px-4 py-2 rounded-md w-full"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
