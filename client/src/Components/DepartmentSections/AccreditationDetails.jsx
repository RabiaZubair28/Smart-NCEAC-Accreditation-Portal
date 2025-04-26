import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Edit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
export default function AccreditationDetails() {
  const [batches, setBatches] = useState([]);
  const [batchName, setBatchName] = useState("");
  const [numberOfSections, setNumberOfSections] = useState("");
  const [message, setMessage] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [addModal02, setAddModal02] = useState(false);
  const [file, setFile] = useState(null);
  const [message02, setMessage02] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [editValue, setEditValue] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "", show: false });

  const showMessage = (text, type) => {
    setMsg({ text, type, show: true });
    setTimeout(() => setMsg({ text: "", type: "", show: false }), 3000);
  };
  const params = useParams();
  const departmentId = params.id;
  const navigate = useNavigate();

  // Fetch accreditation data
  useEffect(() => {
    const fetchAccreditation = async () => {
      try {
        const res = await axios.get(
          `https://iba-nceac.site/api/accreditation/getAccreditation/${departmentId}`
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching accreditation data:", err);
      }
    };

    if (departmentId) {
      fetchAccreditation();
    }
  }, [departmentId]);

  // Fetch batches data
  useEffect(() => {
    const getBatches = async () => {
      try {
        const response = await fetch(
          "https://iba-nceac.site/api/batches/all-batches",
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setBatches(data);
        }
      } catch (error) {
        console.log(`Services error: ${error}`);
      }
    };
    getBatches();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await axios.post(
        "https://iba-nceac.site/api/students/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage02(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage02("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle batch creation
  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `https://iba-nceac.site/api/accreditation/updateAccreditation/${data._id}`,
        {
          [currentField]:
            currentField === "PhDInstructors" ||
            currentField === "industryPractitioner"
              ? editValue.split(",").map((item) => item.trim())
              : editValue,
        }
      );

      if (response.status === 200) {
        setData((prev) => ({
          ...prev,
          [currentField]:
            currentField === "PhDInstructors" ||
            currentField === "industryPractitioner"
              ? editValue.split(",").map((item) => item.trim())
              : editValue,
        }));
        setEditModal(false);
      }
    } catch (error) {
      console.error("Error updating accreditation data:", error);
    }
  };

  // Open edit modal
  const openEditModal = (field, value) => {
    setCurrentField(field);
    setCurrentValue(value);
    setEditValue(value);
    setEditModal(true);
  };

  // Handle edit submission
  const handleEditSubmit = async () => {
    try {
      // First verify the data and ID
      console.log("Attempting to update with ID:", data._id);
      console.log("Field to update:", currentField);
      console.log("New value:", editValue);

      const response = await axios.put(
        `https://iba-nceac.site/api/accreditation/${data._id}`, // Updated endpoint
        {
          [currentField]: editValue,
        }
      );

      if (response.data.success) {
        setData((prev) => ({ ...prev, [currentField]: editValue }));

        showMessage("Field Editted successfully!", "success");
        setEditModal(false);
      } else {
        alert(`Update failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      showMessage("Unable to edit the field!", "error");
    }
  };

  // Check for accreditation data loading
  if (!data) return <p className="text-gray-600">Loading...</p>;

  // Destructure the data object for cleaner code
  const {
    facultyMembers,
    fulltimeFaculty,
    teachingAssistants,
    visitingFaculty,
    PhDInstructors = [],
    industryPractitioner = [],
    noOfClassrooms,
    programmingLab,
    systemsLab,
    hardwareLab,
    numberOfSystems,
    numberOfStations,
    totalNumberOfStudentsInDept,
    totalNumberOfComputingBooks,
    ieeeAcmCopies,
    techMagazines,
    transport,
    hostels,
    sportsFacilities,
    prayerArea,
    commonRoomMale,
    commonRoomFemale,
    creditsHours,
  } = data;

  // Helper function to render field with edit button
  // In your renderField function, update the button styling:
  const renderField = (label, value, fieldName, isArray = false) => (
    <div className="border rounded shadow-md bg-gray-100 p-4 flex justify-between items-start">
      <div>
        <strong>{label}</strong>{" "}
        {isArray ? (value.length ? value.join(", ") : "None") : value}
        {renderWarning(label, value, isArray)}
      </div>
      <button
        onClick={() =>
          openEditModal(fieldName, isArray ? value.join(", ") : value)
        }
        className="  text-green-600 p-1 rounded ml-2 transition-colors"
        title="Edit this field"
      >
        <Edit size={16} />
      </button>
    </div>
  );

  // For the edit modal's save button, update to green as well:
  <button
    onClick={handleEditSubmit}
    className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded mt-4 transition-colors"
  >
    Save Changes
  </button>;

  // Helper function to render warnings based on accreditation standards
  const renderWarning = (label, value, isArray) => {
    if (label.includes("faculty member") && value < 7) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          at least 7 full-time faculty members in the department.
        </div>
      );
    }
    if (label.includes("full-time faculty") && value < 3) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          at least 3 full-time faculty members in the department.
        </div>
      );
    }
    if (label.includes("PHD Instructors") && (!isArray || value.length < 1)) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          at least 1 PHD Instructor in the department.
        </div>
      );
    }
    if (
      label.includes("Industry Practitioners") &&
      (!isArray || value.length < 1)
    ) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          at least 1 Industry Practitioner in the department.
        </div>
      );
    }
    if (
      label.includes("classrooms") &&
      totalNumberOfStudentsInDept &&
      value < Math.ceil(totalNumberOfStudentsInDept / 100) * 3
    ) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. Minimum 3
          classrooms are required per 100 students.
        </div>
      );
    }
    if (label.includes("Programming Lab") && value === false) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          Programming Lab in the department.
        </div>
      );
    }
    if (label.includes("Systems Lab") && value === false) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          Systems Lab in the department.
        </div>
      );
    }
    if (label.includes("Hardware Lab") && value === false) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          Hardware Lab in the department.
        </div>
      );
    }
    if (label.includes("computer systems") && totalNumberOfStudentsInDept > 0) {
      if (value / totalNumberOfStudentsInDept < 1 / 5) {
        return (
          <div className="mt-2 text-red-500 text-md">
            Warning: Accreditation Standards are getting breached.
            System-to-student ratio is below acceptable standards (1:5).
            Increase computer systems.
          </div>
        );
      }
      if (
        value / totalNumberOfStudentsInDept >= 1 / 5 &&
        value / totalNumberOfStudentsInDept < 1 / 3
      ) {
        return (
          <div className="mt-2 text-yellow-600 text-md">
            Notice: Accreditation Standards are getting breached.
            System-to-student ratio meets minimum requirement (1:5), but
            preferred is 1:3.
          </div>
        );
      }
    }
    if (
      label.includes("hardware stations") &&
      totalNumberOfStudentsInDept > 0
    ) {
      if (value / totalNumberOfStudentsInDept < 1 / 5) {
        return (
          <div className="mt-2 text-red-500 text-md">
            Warning: Accreditation Standards are getting breached.
            Station-to-student ratio is below acceptable standards (1:5).
            Increase hardware stations.
          </div>
        );
      }
      if (
        value / totalNumberOfStudentsInDept >= 1 / 5 &&
        value / totalNumberOfStudentsInDept < 1 / 3
      ) {
        return (
          <div className="mt-2 text-yellow-600 text-md">
            Notice: Accreditation Standards are getting breached.
            Station-to-student ratio meets minimum requirement (1:5), but
            preferred is 1:3.
          </div>
        );
      }
    }
    if (
      label.includes("computing books") &&
      totalNumberOfStudentsInDept > 0 &&
      value / totalNumberOfStudentsInDept < 4
    ) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          at least 4 computing books per student.
        </div>
      );
    }
    if (label.includes("IEEE/ACM Copies") && value < 5) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          IEEE/ACM Copies in total in the library.
        </div>
      );
    }
    if (label.includes("Tech Magazines") && value < 10) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          Tech Magazines in total in the library.
        </div>
      );
    }
    if (label.includes("transport facility") && value === false) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          transport facility in the university.
        </div>
      );
    }
    if (label.includes("hostels") && value === false) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          hostels in the university.
        </div>
      );
    }
    if (label.includes("sports facilities") && value === false) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          sports facilities in the university.
        </div>
      );
    }
    if (label.includes("prayer area") && value === false) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          prayer area in the university.
        </div>
      );
    }
    if (label.includes("Common Room for (Male)") && value === false) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          Common Room for (Male) in the university.
        </div>
      );
    }
    if (label.includes("Common Room for (Female)") && value === false) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          Common Room for (Female) in the university.
        </div>
      );
    }
    if (label.includes("credit hours") && value < 130) {
      return (
        <div className="mt-2 text-red-500 text-md">
          Warning: Accreditation Standards are getting breached. There should be
          at least 130 credit hours in total in the course schema.
        </div>
      );
    }
    return null;
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
      {/* Accreditation Details Section */}
      <div className="p-6 rounded shadow-md bg-white">
        <h2 className="text-xl font-bold text-[#1F2C73] mb-4">
          Accreditation Details
        </h2>
        <div className="grid grid-cols-1 gap-4 text-sm">
          {renderField(
            "How many faculty member does the department have?",
            facultyMembers,
            "facultyMembers"
          )}
          {renderField(
            "How many full-time faculty members does the department have?",
            fulltimeFaculty,
            "fulltimeFaculty"
          )}
          {renderField(
            "How many teaching assisstants does the department have?",
            teachingAssistants,
            "teachingAssistants"
          )}
          {renderField(
            "How many visiting faculty does the department have?",
            visitingFaculty,
            "visitingFaculty"
          )}
          {renderField(
            "Who are the PHD Instructors in the department?",
            PhDInstructors,
            "PhDInstructors",
            true
          )}
          {renderField(
            "Who are the Industry Practitioners in the department?",
            industryPractitioner,
            "industryPractitioner",
            true
          )}
          {renderField(
            "How many classrooms have been alloted to the department?",
            noOfClassrooms,
            "noOfClassrooms"
          )}
          {renderField(
            "Does the department have Programming Lab?",
            programmingLab ? "Yes" : "No",
            "programmingLab"
          )}
          {renderField(
            "Does the department have Systems Lab?",
            systemsLab ? "Yes" : "No",
            "systemsLab"
          )}
          {renderField(
            "Does the department have Hardware Lab?",
            hardwareLab ? "Yes" : "No",
            "hardwareLab"
          )}
          {renderField(
            "How many computer systems have been allocated to the department?",
            numberOfSystems,
            "numberOfSystems"
          )}
          {renderField(
            "How many hardware stations have been allocated to the department?",
            numberOfStations,
            "numberOfStations"
          )}
          {renderField(
            "How many students in total are in the department?",
            totalNumberOfStudentsInDept,
            "totalNumberOfStudentsInDept"
          )}
          {renderField(
            "How many computing books are there in the library?",
            totalNumberOfComputingBooks,
            "totalNumberOfComputingBooks"
          )}
          {renderField(
            "How many IEEE/ACM Copies in total are in the library?",
            ieeeAcmCopies,
            "ieeeAcmCopies"
          )}
          {renderField(
            "How many Tech Magazines in total are in the library?",
            techMagazines,
            "techMagazines"
          )}
          {renderField(
            "Do the university have transport facility?",
            transport ? "Yes" : "No",
            "transport"
          )}
          {renderField(
            "Do the university have hostels?",
            hostels ? "Yes" : "No",
            "hostels"
          )}
          {renderField(
            "Do the university have sports facilities?",
            sportsFacilities ? "Yes" : "No",
            "sportsFacilities"
          )}
          {renderField(
            "Do the university have prayer area?",
            prayerArea ? "Yes" : "No",
            "prayerArea"
          )}
          {renderField(
            "Do the university have Common Room for (Male)?",
            commonRoomMale ? "Yes" : "No",
            "commonRoomMale"
          )}
          {renderField(
            "Do the university have Common Room for (Female)?",
            commonRoomFemale ? "Yes" : "No",
            "commonRoomFemale"
          )}
          {renderField(
            "How many credit hours in total does the department have in their course schema?",
            creditsHours,
            "creditsHours"
          )}
        </div>
      </div>

      {/* Batches Section */}
      <div className="grid gap-4">
        {batches && batches.length > 0 ? (
          batches.map((batch, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-3">
                  <div className="text-lg font-semibold text-[#1F2C73]">
                    <span className="text-sm text-gray-500">
                      S.No: {index + 1} &nbsp;&nbsp;
                    </span>
                    Batch Name: {batch.batchName}
                  </div>
                  <div className="text-sm text-gray-600 space-x-5">
                    <span>Number of Sections: {batch.numberOfSections}</span>
                  </div>

                  {/* Grid layout for sections */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    {Object.entries(batch.sections).map(
                      ([sectionName, studentIds], index) => (
                        <div
                          key={index}
                          className="p-4 border rounded shadow-md bg-gray-100"
                        >
                          <h3 className="text-lg font-semibold text-[#1F2C73]">
                            Section {sectionName}
                          </h3>
                          {studentIds.length > 0 ? (
                            <div className="mt-2">
                              Students: {studentIds.length}
                            </div>
                          ) : (
                            <p className="mt-2 text-gray-500">
                              No students in this section.
                            </p>
                          )}
                          {studentIds.length >= 50 && (
                            <div className="mt-2 text-red-500 text-md">
                              Warning: Accreditation Standards are getting
                              breached. The total number of students allowed per
                              section is 50.
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-gray-600 text-center mt-8">
            No Batches available at the moment.
          </div>
        )}
      </div>

      {/* Add Batch Modal */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-200 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-3/4 lg:w-1/2">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold mb-4">Add New Batch</h2>
              <span
                className="text-lg font-semibold text-red-600 cursor-pointer"
                onClick={() => setAddModal(false)}
              >
                x
              </span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700">Batch Name:</label>
                  <input
                    type="text"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    className="mt-1 p-2 border rounded w-full"
                    placeholder="Enter Batch Name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Number of Sections:
                  </label>
                  <input
                    type="number"
                    value={numberOfSections}
                    onChange={(e) => setNumberOfSections(e.target.value)}
                    className="mt-1 p-2 border rounded w-full"
                    placeholder="Enter Number of Sections"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded mt-4"
              >
                Create Batch
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Batch Upload Modal */}
      {addModal02 && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-200 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-3/4 lg:w-1/2">
            <div className="flex justify-between">
              <span
                onClick={() => setAddModal02(false)}
                className="cursor-pointer text-xl"
              >
                x
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-2">Add New Batch</h2>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".xlsx, .xls"
            />
            <button
              className="bg-black text-white p-2 rounded mt-4"
              onClick={handleUpload}
              disabled={!file || loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
            {message02 && <p>{message02}</p>}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50  z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-3/4 lg:w-1/2">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold mb-4">
                Edit {currentField}
              </h2>
              <span
                className="text-sm font-semibold bg-red-500 text-white py-0.5 px-2 mb-5 rounded-sm  cursor-pointer"
                onClick={() => setEditModal(false)}
              >
                X
              </span>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Current Value:</label>
              <p className="mt-1 p-2 bg-gray-100 rounded">{currentValue}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">New Value:</label>
              {currentField.includes("Lab") ||
              currentField.includes("transport") ||
              currentField.includes("hostels") ||
              currentField.includes("sportsFacilities") ||
              currentField.includes("prayerArea") ||
              currentField.includes("commonRoom") ? (
                <select
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value === "true")}
                  className="mt-1 p-2 border rounded w-full"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <input
                  type={typeof currentValue === "number" ? "number" : "text"}
                  value={editValue}
                  onChange={(e) =>
                    setEditValue(
                      typeof currentValue === "number"
                        ? parseInt(e.target.value, 10)
                        : e.target.value
                    )
                  }
                  className="mt-1 p-2 border rounded w-full"
                />
              )}
            </div>
            <button
              onClick={handleEditSubmit}
              className="w-full bg-black text-white p-2 rounded mt-4"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
