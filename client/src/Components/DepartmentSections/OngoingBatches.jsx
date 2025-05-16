import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
export default function OngoingBatches() {
  const [batches, setBatches] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const [batchName, setBatchName] = useState("");
  const [numberOfSections, setNumberOfSections] = useState("");
  const [message, setMessage] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [addModal02, setAddModal02] = useState(false);
  const [addModal03, setAddModal03] = useState(false);
  const [file, setFile] = useState(null);
  const [message02, setMessage02] = useState("");
  const [loading, setLoading] = useState(false);
  const [batchId, setBatchId] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const handleUploadFile = async (batchId) => {
    if (!file) return alert("Please select a PDF file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `https://iba-nceac.site/upload-pdf/${batchId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setPdfUrl(res.data.url);

      showNotification("Batch Scheme Updated Successfully!", true);
      setAddModal03(false);
    } catch (err) {
      console.error("Upload error:", err);

      showNotification("Failed to upload Batch Scheme!", false);
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

  const id = params.id;
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      {
        pdfUrl && showNotification("Please select a file first!", false);
      }
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

      setMessage02(response.data.message); // Display success message
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage02("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!batchName || !numberOfSections) {
      setMessage("Please fill in both fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://iba-nceac.site/api/batches/create-batch",
        {
          batchName,
          numberOfSections: parseInt(numberOfSections, 10),
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Adjust the status code as per your API
        alert("Batch created successfully!");
        setBatchName("");
        setNumberOfSections("");
        setAddModal(false);
        setAddModal02(true);
      } else {
        alert("Failed to create batch. Please try again.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBatches = async () => {
    try {
      const response = await fetch(
        `https://iba-nceac.site/api/batches/all-batches/${id}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setBatches(data); // Assuming setDepartments is the state updater for the departments data
      }
    } catch (error) {
      console.log(`Services error: ${error}`);
    }
  };

  useEffect(() => {
    getBatches();
  }, []);

  console.log(batches);

  return (
    <div className="px-12 py-8">
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
        <div className="flex flex-col justify-start   md:flex-row md:justify-between xs:flex-col xs:justify-start sm:flex-row sm:justify-between lg:flex-row lg:justify-between xl:flex-row xl:justify-between   items-start gap-y-3 xs:gap-y-3 sm:gap-y-0 md:gap-y-0 lg:gap-y-0 xl:gap-y-0 xxl:gap-y-0 mb-6">
          <h2 className="text-2xl font-bold text-[#1F2C73]">Ongoing Batches</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#1F2C73] text-white px-4 py-2 rounded-md flex flex-row items-center space-x-2"
            onClick={() => {
              setAddModal02(true);
            }}
          >
            <Plus size={20} />
            <span>Create New Batch</span>
          </motion.button>
        </div>

        <div className="grid gap-4 ">
          {batches && batches.length > 0 ? (
            batches.map((batch, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className="bg-gray-50 rounded-lg shadow-md p-4"
              >
                <div className="flex flex-col justify-between items-start ">
                  <div className="space-y-3">
                    <div className="text-lg font-semibold text-[#1F2C73]">
                      <span className="text-sm text-gray-500">
                        S.No: {index + 1} &nbsp; &nbsp;
                      </span>
                      Batch Name: {batch.batchName}
                    </div>
                    <div className="text-sm text-gray-600 space-x-5">
                      <span>Batch Schema: {batch.batchSchema}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#1F2C73] text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        setAddModal03(true);
                        setBatchId(batch._id);
                      }}
                    >
                      Upload Updated Course Schema
                    </motion.button>
                    <div className="text-sm text-gray-600 space-x-5">
                      <span>Number of Sections: {batch.numberOfSections}</span>
                    </div>

                    {/* Grid layout for sections */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      {Object.entries(batch.sections).map(
                        ([sectionName, studentIds], index) => (
                          <div
                            key={index}
                            className="p-4 cursor-pointer border rounded shadow-md bg-gray-100"
                            onClick={() => {
                              navigate(
                                `/section/${batch.batchName}/${sectionName}/${params.insid}`
                              );
                            }}
                          >
                            {/* Section Name */}
                            <h3 className="text-lg font-semibold text-[#1F2C73]">
                              Section {sectionName}
                            </h3>

                            {/* Check if there are student IDs in the section */}
                            {studentIds.length > 0 ? (
                              <div className="mt-2">
                                Total number of students: {studentIds.length}
                              </div>
                            ) : (
                              <p className="mt-2 text-gray-500">
                                No students in this section.
                              </p>
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
      </div>

      {addModal02 && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50  z-50">
          <div className="bg-white py-4 px-6 rounded-lg shadow-lg  ">
            <div className="flex flex-row justify-between pb-4">
              <h2 className="text-lg font-semibold">Add New Batch</h2>
              <button
                className="bg-red-500 text-white py-0.5 px-2 text-sm rounded-sm cursor-pointer"
                onClick={() => {
                  setAddModal02(false);
                }}
              >
                X
              </button>
            </div>
            <div className="flex justify-between">
              <div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                />
              </div>
            </div>

            <div className="flex justify-between w-full">
              <div className="w-full">
                <button
                  className=" bg-black text-white py-2 px-8 rounded mt-4 w-full"
                  onClick={handleUpload}
                  disabled={!file || loading}
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
                {message02 && <p>{message02}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
      {addModal03 && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50  z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <div className="flex flex-row justify-between pb-4">
              <h2 className="text-xl font-semibold">Upload Batch Schema</h2>
              <button
                className="bg-red-500 text-white py-0.5 px-2 text-sm rounded-sm cursor-pointer"
                onClick={() => {
                  setAddModal03(false);
                }}
              >
                X
              </button>
            </div>

            <div className="mb-5">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <button
              onClick={() => {
                handleUploadFile(batchId);
              }}
              className="bg-black text-white w-full py-2 rounded-md"
            >
              Update Batch Schema
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
