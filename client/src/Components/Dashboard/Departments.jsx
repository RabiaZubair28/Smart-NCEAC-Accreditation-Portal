import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { Edit, Trash2 } from "lucide-react";
export default function Courses() {
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    departmentName: "",
    departmentSchema: "",
    PLO: [],
  });
  const [departments, setDepartments] = useState([]);
  const getDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:1234/api/data/departments",
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
      showMessage("Failed to fetch departments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);
  const [newPLO, setNewPLO] = useState("");
  const [message, setMessage] = useState({ text: "", type: "", show: false });

  const showMessage = (text, type) => {
    setMessage({ text, type, show: true });
    setTimeout(() => setMessage({ text: "", type: "", show: false }), 3000);
  };

  const handlePLOAdd = () => {
    if (newPLO.trim()) {
      // Check for duplicate PLO (case insensitive)
      const isDuplicate = formData.PLO.some(
        (plo) => plo.toLowerCase() === newPLO.trim().toLowerCase()
      );

      if (isDuplicate) {
        showMessage("PLO already exists!", "error");
      } else {
        setFormData((prevState) => ({
          ...prevState,
          PLO: [...prevState.PLO, newPLO.trim()],
        }));
        setNewPLO("");
        showMessage("PLO added successfully", "success");
      }
    }
  };

  const handlePLORemove = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      PLO: prevState.PLO.filter((_, i) => i !== index),
    }));
    showMessage("PLO removed", "success");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:1234/api/data/department",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        showMessage("Department added successfully", "success");
        setFormData({
          departmentName: "",
          departmentSchema: "",
          PLO: [],
        });
        setShowModalAdd(false);
        getDepartments(); // Refresh department list
      } else {
        showMessage(result.msg || "Error occurred during submission.", "error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showMessage("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 relative">
      {/* Message Notification */}
      <AnimatePresence>
        {message.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-start   md:flex-row md:justify-between xs:flex-col xs:justify-start sm:flex-row sm:justify-between lg:flex-row lg:justify-between xl:flex-row xl:justify-between   items-start mb-6 gap-y-3 xs:gap-y-3 sm:gap-y-0 md:gap-y-0 lg:gap-y-0 xl:gap-y-0 xxl:gap-y-0 "
      >
        <h2 className="text-2xl font-bold text-[#1F2C73]">Departments</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-[#1F2C73] text-white rounded-md hover:bg-[#283593]"
          onClick={() => setShowModalAdd(true)}
        >
          <Plus size={20} />
          <span>Create New Department</span>
        </motion.button>
      </motion.div>

      {loading && departments.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F2C73]"></div>
        </div>
      ) : (
        <AnimatePresence>
          {departments.map((dept, index) => (
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md mb-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.01 }}
              key={dept._id || index}
            >
              <div className="mb-4 space-y-2">
                <div className="text-sm text-gray-500">S.No: {index + 1}</div>
                <h3 className="text-xl font-bold text-[#1F2C73]">
                  {dept.departmentName}
                </h3>
                <div className="text-sm text-gray-500 ">
                  {dept.departmentSchema}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {dept.PLO.map((outcome, idx) => (
                  <div key={idx} className="text-gray-600">
                    {idx + 1}. {outcome}
                  </div>
                ))}
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
                  onClick={() => navigate(`/department/${dept._id}`)}
                >
                  Go to Department
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {showModalAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50  z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96"
            >
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold mb-4">
                  Add New Department
                </h2>
                <button
                  className="text-sm font-semibold text-white bg-red-500 hover:bg-red-500 mb-4 px-2 rounded-sm"
                  onClick={() => setShowModalAdd(false)}
                  disabled={loading}
                >
                  X
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Department Name: <span className="text-red-500">*</span>{" "}
                    (should be unique)
                  </label>
                  <input
                    type="text"
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                    placeholder="Enter Department Name"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Department Schema:
                  </label>
                  <input
                    type="text"
                    name="departmentSchema"
                    value={formData.departmentSchema}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                    placeholder="Enter Department Schema"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Program Learning Objectives:
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newPLO}
                      onChange={(e) => setNewPLO(e.target.value)}
                      className="mt-1 p-2 border rounded w-full"
                      placeholder="Enter a PLO"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={handlePLOAdd}
                      className="bg-black text-white mt-1 px-4 py-0 rounded disabled:opacity-50"
                      disabled={loading || !newPLO.trim()}
                    >
                      Add
                    </button>
                  </div>
                  <ul className="list-disc pl-1">
                    {formData.PLO.map((plo, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>{plo}</span>
                        <button
                          type="button"
                          className=" text-red-500 px-1 py-1 rounded disabled:opacity-50"
                          onClick={() => handlePLORemove(index)}
                          disabled={loading}
                        >
                          <Trash2 size={20} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white p-2 rounded mt-0 disabled:opacity-50"
                  disabled={
                    loading ||
                    !formData.departmentName ||
                    !formData.departmentSchema
                  }
                >
                  {loading ? "Adding..." : "Add Department"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
