import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Edit, Trash2, Plus } from "lucide-react";
import { useParams } from "react-router-dom";

export default function ResearchInfo() {
  const [researchPapers, setResearchPapers] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [researchToEdit, setResearchToEdit] = useState(null);
  const [researchToDelete, setResearchToDelete] = useState(null);
  const [newResearch, setNewResearch] = useState({
    doiLink: "",
    paperTitle: "",
    researchGateLink: "",
    googleScholarLink: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const params = useParams();

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const getResearchPapers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:1234/api/data/research/${params.id}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setResearchPapers(data);
      }
    } catch (error) {
      console.error(`Error fetching research papers: ${error}`);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResearchPapers();
  }, [params.id]);

  const showMessage = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const addResearchPaper = async () => {
    try {
      const errors = [];

      if (!newResearch.doiLink) {
        errors.push("DOI Link is required");
      }

      if (!newResearch.paperTitle) {
        errors.push("Paper Title is required");
      }

      if (errors.length > 0) {
        showMessage(`Please fix these errors:\n\n${errors.join("\n")}`);
        return;
      }

      const researchData = {
        doiLink: newResearch.doiLink,
        paperTitle: newResearch.paperTitle,
        instructorId: params.id,
        ...(newResearch.researchGateLink && {
          researchGateLink: newResearch.researchGateLink,
        }),
        ...(newResearch.googleScholarLink && {
          googleScholarLink: newResearch.googleScholarLink,
        }),
      };

      const response = await fetch("http://localhost:1234/api/data/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(researchData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showMessage(errorData?.msg || "Failed to add research.");
        return;
      }

      const addedResearch = await response.json();
      setResearchPapers((prev) => [...prev, addedResearch.research]);
      setShowModalAdd(false);
      setNewResearch({
        doiLink: "",
        paperTitle: "",
        researchGateLink: "",
        googleScholarLink: "",
      });
      showMessage("Research added successfully!", "success");
    } catch (error) {
      console.error("Error adding research:", error);
      showMessage(`An error occurred while adding research: ${error.message}`);
    }
  };

  const updateResearchPaper = async () => {
    try {
      if (!researchToEdit || !researchToEdit._id) {
        showMessage("Research paper ID is missing");
        return;
      }

      const errors = {};

      if (!researchToEdit.doiLink) {
        errors.doiLink = "DOI Link is required";
      }

      if (!researchToEdit.paperTitle) {
        errors.paperTitle = "Paper Title is required";
      }

      if (Object.keys(errors).length > 0) {
        showMessage(
          `Validation errors:\n\n${Object.entries(errors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join("\n")}`
        );
        return;
      }

      const response = await fetch(
        `http://localhost:1234/api/data/research/${researchToEdit._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doiLink: researchToEdit.doiLink,
            paperTitle: researchToEdit.paperTitle,
            researchGateLink: researchToEdit.researchGateLink || null,
            googleScholarLink: researchToEdit.googleScholarLink || null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.details) {
          const errorMsg = Object.entries(errorData.details)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join("\n");
          showMessage(`Server validation failed:\n\n${errorMsg}`);
        } else {
          showMessage(errorData.error || "Failed to update research");
        }
        return;
      }

      const data = await response.json();
      setResearchPapers((prev) =>
        prev.map((paper) =>
          paper._id === researchToEdit._id ? data.research : paper
        )
      );
      setShowModalEdit(false);
      showMessage("Research updated successfully!", "success");
    } catch (error) {
      console.error("Error updating research:", error);
      showMessage(`An unexpected error occurred: ${error.message}`);
    }
  };

  const deleteResearchPaper = async () => {
    try {
      if (!researchToDelete) {
        showMessage("No research paper selected for deletion");
        return;
      }

      const response = await fetch(
        `http://localhost:1234/api/data/research/${researchToDelete._id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setResearchPapers((prev) =>
          prev.filter((paper) => paper._id !== researchToDelete._id)
        );
        setShowModalDelete(false);
        showMessage("Research deleted successfully!", "success");
      } else {
        const errorData = await response.json();
        showMessage(errorData.msg || "Failed to delete research");
      }
    } catch (error) {
      console.error("Error deleting research:", error);
      showMessage("An error occurred while deleting research");
    }
  };

  const formatDoiLink = (doiLink) => {
    if (!doiLink) return "#";
    if (doiLink.startsWith("http")) return doiLink;
    if (doiLink.startsWith("10.")) return `https://doi.org/${doiLink}`;
    return `https://${doiLink}`;
  };

  if (loading) {
    return <div className="p-6">Loading research papers...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      {message.text && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {message.text}
        </div>
      )}
      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-start   md:flex-row md:justify-between xs:flex-col xs:justify-start sm:flex-row sm:justify-between lg:flex-row lg:justify-between xl:flex-row xl:justify-between   items-start gap-y-3 xs:gap-y-3 sm:gap-y-0 md:gap-y-0 lg:gap-y-0 xl:gap-y-0 xxl:gap-y-0 mb-8"
      >
        <h2 className="text-2xl font-bold text-[#1F2C73]">
          Research Information
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-[#1F2C73] text-white rounded-md hover:bg-[#283593]"
          onClick={() => setShowModalAdd(true)}
        >
          <Plus size={20} />
          <span>Add New Article</span>
        </motion.button>
      </motion.div>

      {researchPapers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No research papers found</p>
        </div>
      ) : (
        <AnimatePresence>
          {researchPapers.map((item, index) => (
            <motion.div
              className="bg-white p-4 rounded-lg shadow-md mb-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              key={item._id || index}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm text-gray-500">S.No: {index + 1}</div>
                  <div className="text-lg font-semibold text-[#1F2C73]">
                    {item.paperTitle}
                  </div>
                  <div className="flex flex-col space-y-1 mt-2">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F2C73] cursor-pointer"
                    >
                      DOI: {item.doiLink}
                    </a>
                    {item.researchGateLink && (
                      <a
                        href={
                          item.researchGateLink.startsWith("http")
                            ? item.researchGateLink
                            : `https://${item.researchGateLink}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1F2C73] cursor-pointer"
                      >
                        ResearchGate Link
                      </a>
                    )}
                    {item.googleScholarLink && (
                      <a
                        href={
                          item.googleScholarLink.startsWith("http")
                            ? item.googleScholarLink
                            : `https://${item.googleScholarLink}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1F2C73] cursor-pointer"
                      >
                        Google Scholar Link
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {/* <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                    onClick={() =>
                      window.open(formatDoiLink(item.doiLink), "_blank")
                    }
                  >
                    <Download size={20} />
                  </motion.button> */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-green-500 hover:bg-green-50 rounded-full"
                    onClick={() => {
                      setResearchToEdit(item);
                      setShowModalEdit(true);
                    }}
                  >
                    <Edit size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    onClick={() => {
                      setResearchToDelete(item);
                      setShowModalDelete(true);
                    }}
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* Add Modal */}
      {showModalAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96">
            <div className="flex justify-between pb-5">
              <h2 className="text-lg font-semibold">
                Add New Research Article
              </h2>
              <button
                className=" text-white bg-red-500 px-2 py-0.5 rounded-sm hover:text-white text-sm font-semibold cursor-pointer"
                onClick={() => setShowModalAdd(false)}
              >
                X
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                DOI <span className="text-red-500">*</span> ( should be unique)
              </label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter DOI"
                value={newResearch.doiLink}
                onChange={(e) =>
                  setNewResearch({ ...newResearch, doiLink: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Paper Title <span className="text-red-500">*</span> ( should be
                unique)
              </label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter Paper Title"
                value={newResearch.paperTitle}
                onChange={(e) =>
                  setNewResearch({ ...newResearch, paperTitle: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">ResearchGate Link</label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter ResearchGate Link"
                value={newResearch.researchGateLink}
                onChange={(e) =>
                  setNewResearch({
                    ...newResearch,
                    researchGateLink: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Google Scholar Link</label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter Google Scholar Link"
                value={newResearch.googleScholarLink}
                onChange={(e) =>
                  setNewResearch({
                    ...newResearch,
                    googleScholarLink: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-end  w-full space-x-2 mt-4">
              {/* <button
                className="px-4 py-2 border rounded bg-gray-200"
                onClick={() => setShowModalAdd(false)}
              >
                Cancel
              </button> */}
              <button
                className="w-full px-4 py-2 bg-black text-white rounded"
                onClick={addResearchPaper}
              >
                Add Research
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showModalEdit && researchToEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96">
            <div className="flex justify-between pb-5">
              <h2 className="text-lg font-semibold">Edit Research Article</h2>
              <button
                className="text-white bg-red-500 px-2 py-0.5 rounded-sm hover:text-white text-sm font-semibold cursor-pointer"
                onClick={() => setShowModalEdit(false)}
              >
                X
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">DOI </label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                value={researchToEdit.doiLink || ""}
                onChange={(e) =>
                  setResearchToEdit({
                    ...researchToEdit,
                    doiLink: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Paper Title</label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                value={researchToEdit.paperTitle || ""}
                onChange={(e) =>
                  setResearchToEdit({
                    ...researchToEdit,
                    paperTitle: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">ResearchGate Link</label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                value={researchToEdit.researchGateLink || ""}
                onChange={(e) =>
                  setResearchToEdit({
                    ...researchToEdit,
                    researchGateLink: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Google Scholar Link</label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                value={researchToEdit.googleScholarLink || ""}
                onChange={(e) =>
                  setResearchToEdit({
                    ...researchToEdit,
                    googleScholarLink: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              {/* <button
                className="px-4 py-2 border rounded bg-gray-200"
                onClick={() => setShowModalEdit(false)}
              >
                Cancel
              </button> */}
              <button
                className="w-full px-4 py-2 bg-black text-white rounded"
                onClick={updateResearchPaper}
              >
                Update Research
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModalDelete && researchToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96">
            <div className="flex justify-between ">
              <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
              <button
                className="text-white bg-red-500 rounded-sm hover:text-white text-sm font-semibold cursor-pointer mb-4 px-2"
                onClick={() => setShowModalDelete(false)}
              >
                X
              </button>
            </div>
            <p className="mb-4">
              Are you sure you want to delete the research paper titled: "
              {researchToDelete.paperTitle}"?
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={deleteResearchPaper}
                className="w-full px-4 py-2 bg-black text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
