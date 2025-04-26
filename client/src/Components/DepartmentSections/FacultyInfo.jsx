import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Download, Plus } from "lucide-react";
export default function FacultyInfo() {
  const [instructors, setInstructors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    userID: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    cnicNumber: "",
    contactNumber: "",
    dateOfBirth: "",
    city: "",
    districtOfDomicile: "",
    province: "",
    religion: "",
    officeNumber: "",
    officeLocation: "",
    designation: "",
    prefix: "",
    role: "Instructor",
    profilePicture: "",
  });
  const navigate = useNavigate();

  // Fetch instructors from API
  const getInstructors = async () => {
    try {
      const response = await fetch(
        "http://localhost:1234/api/data/instructors"
      );
      if (response.ok) {
        const data = await response.json();
        setInstructors(data);
      } else {
        toast.error("Failed to fetch instructors");
      }
    } catch (error) {
      toast.error(`Error fetching instructors: ${error.message}`);
    }
  };

  // Add new instructor API call with duplicate check
  const addInstructor = async () => {
    // Check for duplicate instructor based on unique fields
    const isDuplicate = instructors.some(
      (instructor) =>
        instructor.userID === newInstructor.userID ||
        instructor.email === newInstructor.email ||
        instructor.cnicNumber === newInstructor.cnicNumber
    );

    if (isDuplicate) {
      showMessage(
        "An instructor with the same ID, email, or CNIC already exists!",
        "error"
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:1234/api/data/instructors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newInstructor),
        }
      );

      if (response.ok) {
        const createdInstructor = await response.json();
        setInstructors((prev) => [...prev, createdInstructor]);
        setShowModal(false);
        setNewInstructor({
          userID: "",
          password: "",
          firstName: "",
          lastName: "",
          email: "",
          gender: "",
          cnicNumber: "",
          contactNumber: "",
          dateOfBirth: "",
          city: "",
          districtOfDomicile: "",
          province: "",
          religion: "",
          officeNumber: "",
          officeLocation: "",
          designation: "",
          prefix: "",
          role: "Instructor",
          profilePicture: "",
        });
        showMessage("Instructor added successfully!", "success");
      } else {
        const errorData = await response.json();
        showMessage(
          `Failed to add instructor: ${
            errorData.message || "Please try again."
          }`,
          "error"
        );
      }
    } catch (error) {
      showMessage(`An error occurred: ${error.message}`, "error");
    }
  };

  const [msg, setMsg] = useState({ text: "", type: "", show: false });

  const showMessage = (text, type) => {
    setMsg({ text, type, show: true });
    setTimeout(() => setMsg({ text: "", type: "", show: false }), 3000);
  };

  useEffect(() => {
    getInstructors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInstructor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="">
      <AnimatePresence>
        {msg.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
              msg.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col justify-start   md:flex-row md:justify-between xs:flex-col xs:justify-start sm:flex-row sm:justify-between lg:flex-row lg:justify-between xl:flex-row xl:justify-between   items-start gap-y-3 xs:gap-y-3 sm:gap-y-0 md:gap-y-0 lg:gap-y-0 xl:gap-y-0 xxl:gap-y-0 p-6">
        <h2 className="text-xl font-bold text-[#1F2C73]">Faculty Info</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#1F2C73] text-white px-4 py-2 rounded-md flex flex-row items-center space-x-2"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          <span>Add New Instructor</span>
        </motion.button>
      </div>

      {/* Instructor Cards */}
      <div className="grid gap-4">
        {instructors.length > 0 ? (
          instructors.map((instructor, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              className="bg-white p-6 rounded-lg shadow-md  flex flex-col justify-start   md:flex-row md:justify-between xs:flex-col xs:justify-start sm:flex-row sm:justify-between lg:flex-row lg:justify-between xl:flex-row xl:justify-between   items-start gap-y-3 xs:gap-y-3 sm:gap-y-0 md:gap-y-0 lg:gap-y-0 xl:gap-y-0 xxl:gap-y-0"
            >
              <div className="space-y-2">
                <div className="text-lg font-semibold text-[#1F2C73]">
                  {instructor.prefix}
                  {instructor.firstName} {instructor.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  Instructor ID: {instructor.userID}
                </div>
                <div className="text-sm text-gray-500">{instructor.email}</div>
                <div className="text-sm text-gray-500">
                  {instructor.designation}
                </div>
              </div>
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#1F2C73] text-white rounded-lg hover:bg-[#283593]"
                  onClick={() => navigate(`/instructor/${instructor._id}`)}
                >
                  <span>Go to Instructor</span>
                  {/* <ArrowRight size={16} /> */}
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-gray-600 text-center mt-8">
            No instructors available at the moment.
          </div>
        )}
      </div>

      {/* Add Instructor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white py-0 px-6 rounded-lg shadow-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex pt-6 justify-between items-center mb-4 sticky top-0 bg-white py-2">
              <h2 className="text-lg font-semibold text-black ">
                Add New Instructor
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white bg-red-500 rounded-sm text-sm py-0.5 px-2"
              >
                X
              </button>
            </div>

            <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-black ">
                  Personal Information
                </h3>
                <input
                  type="text"
                  name="userID"
                  placeholder="Instructor ID * (e.g., INS-001)"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.userID}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password *"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.password}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.firstName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.lastName}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="gender"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <h3 className="font-medium text-black ">Contact Information</h3>
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.email}
                  onChange={handleInputChange}
                  required
                />

                <input
                  type="text"
                  name="cnicNumber"
                  placeholder="CNIC Number * (e.g., 12345-1234567-1)"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.cnicNumber}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="Contact Number (e.g., 0300-1234567)"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.contactNumber}
                  onChange={handleInputChange}
                  required
                />
                <h3 className="font-medium text-black ">Date Of Birth</h3>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Address and Professional Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-black ">Address Information</h3>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.city}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="districtOfDomicile"
                  placeholder="District of Domicile"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.districtOfDomicile}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="province"
                  placeholder="Province"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.province}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="religion"
                  placeholder="Religion"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.religion}
                  onChange={handleInputChange}
                />

                <h3 className="font-medium text-black mt-4">
                  Professional Information
                </h3>
                <input
                  type="text"
                  name="officeNumber"
                  placeholder="Office Number"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.officeNumber}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="officeLocation"
                  placeholder="Office Location"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.officeLocation}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="designation"
                  placeholder="Designation"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.designation}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="prefix"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.prefix}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Engr.">Engr.</option>
                </select>
                <h3 className="font-medium text-black mt-4">Role</h3>
                <select
                  name="role"
                  className="border p-2 rounded-lg w-full"
                  value={newInstructor.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Instructor">Instructor</option>
                  <option value="HOD">HOD</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="w-full mt-6 pb-6 flex justify-end space-x-2 sticky bottom-0 bg-white py-2">
              {/* <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button> */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-black"
                onClick={addInstructor}
              >
                Add Instructor
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
