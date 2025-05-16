import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Download, X } from "lucide-react";
import { useParams } from "react-router-dom";

export default function DepartmentInfo() {
  const [departmentInfo, setDepartmentInfo] = useState({});
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [editPLOValue, setEditPLOValue] = useState("");
  const [ploToDelete, setPloToDelete] = useState(null);
  const [ploIndexToEdit, setPloIndexToEdit] = useState(null);
  const [newPLO, setNewPLO] = useState("");
  const [addNewPLO, setAddNewPLO] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newSchemaValue, setNewSchemaValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isSuccess: false,
  });

  const params = useParams();

  // Show notification
  const showNotification = (message, isSuccess) => {
    setNotification({ show: true, message, isSuccess });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  // Fetch department info on mount
  const getDepartmentInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/data/department/${params.id}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDepartmentInfo(data);
      }
    } catch (error) {
      console.log(`Services error: ${error}`);
    }
  };

  useEffect(() => {
    console.log("Department ID:", params.id);
    getDepartmentInfo();
  }, [params.id]);

  // Helper function to check for duplicate PLOs (case-insensitive)
  const isPLODuplicate = (ploToCheck, ploList) => {
    return ploList.some(
      (plo) => plo.toLowerCase() === ploToCheck.toLowerCase()
    );
  };

  const handleSaveEdit = () => {
    if (!editPLOValue) return;

    // Check for duplicate PLO (case-insensitive)
    if (
      departmentInfo.PLO &&
      isPLODuplicate(editPLOValue, departmentInfo.PLO)
    ) {
      setErrorMessage("This PLO already exists (case-insensitive check)!");
      return;
    }

    fetch(`http://localhost:1234/api/data/department/${params.id}/plo`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ploIndex: ploIndexToEdit,
        newPLO: editPLOValue,
      }),
    })
      .then((response) => {
        if (response.ok) {
          showNotification("PLO updated successfully!", true);
          setShowModalEdit(false);
          getDepartmentInfo();
        } else {
          showNotification("Failed to update PLO", false);
        }
      })
      .catch((error) => {
        console.error("Error editing PLO:", error);
        showNotification("Error updating PLO", false);
      });
  };

  // Handle Save Schema
  const handleSaveSchema = async () => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/data/department/${params.id}/schema`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schema: newSchemaValue }),
        }
      );
      if (response.ok) {
        showNotification("Schema updated successfully!", true);
        setShowEditModal(false);
        getDepartmentInfo();
      } else {
        showNotification("Failed to update schema", false);
      }
    } catch (error) {
      console.error("Error updating schema:", error);
      showNotification("Error updating schema", false);
    }
  };

  // Handle Delete Schema
  const handleDeleteSchema = async () => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/data/department/${params.id}/schema`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        showNotification("Schema deleted successfully!", true);
        setShowDeleteModal(false);
        getDepartmentInfo();
      } else {
        showNotification("Failed to delete schema", false);
      }
    } catch (error) {
      console.error("Error deleting schema:", error);
      showNotification("Error deleting schema", false);
    }
  };

  // Handle delete PLO
  const handleDeletePLO = (ploIndex) => {
    fetch(`http://localhost:1234/api/data/department/${params.id}/plo`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ploIndex }),
    })
      .then((response) => {
        if (response.ok) {
          showNotification("PLO deleted successfully!", true);
          getDepartmentInfo();
        } else {
          showNotification("Failed to delete PLO", false);
        }
      })
      .catch((error) => {
        console.error("Error deleting PLO:", error);
        showNotification("Error deleting PLO", false);
      });
  };

  const handleAddPLO = async () => {
    if (!newPLO.trim()) {
      setErrorMessage("PLO cannot be empty!");
      return;
    }

    // Check for duplicate PLO (case-insensitive)
    if (
      departmentInfo.PLO &&
      isPLODuplicate(newPLO.trim(), departmentInfo.PLO)
    ) {
      setErrorMessage("This PLO already exists (case-insensitive check)!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:1234/api/data/department/${params.id}/add-plo`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plo: newPLO.trim() }),
        }
      );

      if (response.ok) {
        showNotification("PLO added successfully!", true);
        setNewPLO("");
        setAddNewPLO(false);
        setErrorMessage("");
        getDepartmentInfo();
      } else {
        setErrorMessage("Failed to add PLO. Please try again.");
        showNotification("Failed to add PLO", false);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
      showNotification("Error adding PLO", false);
    }
  };

  return (
    <div className="">
      {/* Notification Toast */}
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

      <div className="bg-white rounded-xl shadow-lg p-6 mb-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#1F2C73]">
            Department Information
          </h2>
          {/* <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
          >
            <Download size={20} />
          </motion.button> */}
        </div>

        <div className="flex flex-col xs:flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row xxl:flex-row justify-start items-start space-x-0 xs:space-x-0 sm:space-x-0 md:space-x-10 lg:space-x-10 xl:space-x-10 xxl:space-x-10 space-y-5">
          <div className="">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Department Name
            </label>
            <input
              type="text"
              className="input-field"
              defaultValue={departmentInfo.departmentName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Department Schema
            </label>

            <div className="flex ">
              <input
                type="text"
                className="input-field  text-wrap"
                defaultValue={departmentInfo.departmentSchema}
                readOnly
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-green-600 hover:bg-blue-50 rounded-full"
                onClick={() => {
                  setNewSchemaValue(departmentInfo.departmentSchema || "");
                  setShowEditModal(true);
                }}
              >
                <Edit size={16} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                onClick={() => {
                  setShowDeleteModal(true);
                }}
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Schema Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50  z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">Edit Department Schema</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-red-500 text-white px-2 rounded-sm text-sm py-0.5"
              >
                X
              </button>
            </div>
            <input
              type="text"
              value={newSchemaValue}
              onChange={(e) => setNewSchemaValue(e.target.value)}
              className="mt-6 w-full p-2 border rounded"
            />
            <div className="w-full flex justify-end mt-4">
              <button
                onClick={handleSaveSchema}
                className="w-full bg-black text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Schema Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50  z-50">
          <div className="bg-white px-5 py-4 rounded-lg shadow-lg w-96">
            <div className="flex flex-row justify-between">
              <h2 className="text-lg font-bold">Delete Department Schema</h2>
              <button
                className=" bg-red-500 text-white px-2 rounded-sm text-sm py-0.5"
                onClick={() => {
                  setShowDeleteModal(false);
                }}
              >
                X
              </button>
            </div>
            <p className="my-4">Are you sure you want to delete this schema?</p>
            <div className="flex justify-end mt-4 w-full">
              <button
                onClick={handleDeleteSchema}
                className="w-full bg-black text-white py-2 rounded mr-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-[#1F2C73] mb-6">
          Program Learning Outcomes
        </h2>
        <div className="mb-6 space-y-6">
          {departmentInfo.PLO && departmentInfo.PLO.length > 0 ? (
            departmentInfo.PLO.map((outcome, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg space-y-2">
                  <div className="text-sm text-gray-500">
                    Program Learning Objective {index + 1}
                  </div>
                  <div>{outcome}</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-green-500 hover:bg-blue-50 rounded-full"
                  onClick={() => {
                    setEditPLOValue(outcome);
                    setPloIndexToEdit(index);
                    setShowModalEdit(true);
                    setErrorMessage("");
                  }}
                >
                  <Edit size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  onClick={() => {
                    setPloToDelete(index);
                    setShowModalDelete(true);
                  }}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No Program Learning Outcomes added yet.
            </p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setAddNewPLO(true);
            setErrorMessage("");
          }}
          className="bg-[#1F2C73] text-white px-4 py-2 rounded-md"
        >
          Add New PLO
        </motion.button>
      </div>

      {/* Edit PLO Modal */}
      {showModalEdit && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50  z-50">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg w-80 md:w-96">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold ">
                Edit Program Learning Outcome
              </h2>
              <span
                className="bg-red-500 text-white px-2 rounded-sm text-sm py-0.5 cursor-pointer"
                onClick={() => setShowModalEdit(false)}
              >
                X
              </span>
            </div>
            <div className="my-6">
              <input
                type="text"
                value={editPLOValue}
                onChange={(e) => {
                  setEditPLOValue(e.target.value);
                  setErrorMessage("");
                }}
                className="mt-1 p-2 border rounded w-full"
              />
              {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
            </div>
            <div className="flex justify-between w-full">
              <button
                onClick={handleSaveEdit}
                className="bg-black text-white px-4 py-2 rounded w-full"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete PLO Modal */}
      {showModalDelete && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50  z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96">
            <div className="flex flex-row justify-between">
              <h2 className="text-lg font-semibold">Delete PLO</h2>
              <button
                className=" bg-red-500 text-white px-2 rounded-sm text-sm py-0.5"
                onClick={() => {
                  setShowModalDelete(false);
                }}
              >
                X
              </button>
            </div>
            <p className="text-md font-medium my-4">
              Are you sure you want to delete this PLO?
            </p>
            <div className="flex justify-between w-full">
              <button
                onClick={() => {
                  handleDeletePLO(ploToDelete);
                  setShowModalDelete(false);
                }}
                className="w-full bg-black text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New PLO Modal */}
      {addNewPLO && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50  z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow relative">
            <button
              onClick={() => {
                setAddNewPLO(false);
                setErrorMessage("");
              }}
              className="absolute top-4 right-4 bg-red-500 text-white px-2 rounded-sm text-sm py-0.5"
            >
              X
            </button>

            <h2 className="text-lg font-semibold mb-4">Add New PLO</h2>
            <input
              type="text"
              value={newPLO}
              onChange={(e) => {
                setNewPLO(e.target.value);
                setErrorMessage("");
              }}
              placeholder="Enter new PLO"
              className="w-full mt-4 mb-2 p-2 border rounded"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
            )}
            <button
              onClick={handleAddPLO}
              className="w-full px-4 py-2 bg-black text-white rounded"
            >
              Add PLO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
