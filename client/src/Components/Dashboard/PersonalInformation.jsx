import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";

const InfoField = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-500 mb-1">
      {label}
    </label>
    <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
      {value || "—"}
    </div>
  </div>
);

const Modal = ({
  title,
  children,
  onClose,
  field,
  tempValue,
  setTempValue,
  updateField,
}) => {
  const renderInput = () => {
    switch (field) {
      case "prefix":
        return (
          <select
            className="w-full p-2 border rounded text-gray-700"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          >
            <option value="">Select Prefix</option>
            <option value="Mr.">Mr.</option>
            <option value="Dr.">Dr.</option>
            <option value="Engr.">Engr.</option>
          </select>
        );

      case "dateOfBirth":
        return (
          <input
            type="date"
            className="w-full p-2 border rounded text-gray-700"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
        );

      case "role":
        return (
          <select
            className="w-full p-2 border rounded text-gray-700"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Instructor">Instructor</option>
            <option value="HOD">HOD</option>
          </select>
        );

      case "gender":
        return (
          <select
            className="w-full p-2 border rounded text-gray-700"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        );

      case "userID":
        return (
          <input
            type="text"
            pattern="^INS-\d+$"
            placeholder="INS-123"
            className="w-full p-2 border rounded text-gray-700 uppercase"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value.toUpperCase())}
          />
        );

      case "email":
        return (
          <input
            type="email"
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            placeholder="example@domain.com"
            className="w-full p-2 border rounded text-gray-700"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
        );

      case "cnicNumber":
        return (
          <input
            type="text"
            pattern="^[0-9]{5}-[0-9]{7}-[0-9]{1}$"
            placeholder="12345-1234567-1"
            className="w-full p-2 border rounded text-gray-700"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
        );

      case "contactNumber":
        return (
          <input
            type="text"
            pattern="^[0-9]{4}-[0-9]{7}$"
            placeholder="0300-1234567"
            className="w-full p-2 border rounded text-gray-700"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
        );

      default:
        return (
          <input
            type="text"
            className="w-full p-2 border rounded text-gray-700"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white bg-red-500 px-2 py-0.5 rounded-sm hover:text-white font-bold text-sm "
          >
            X
          </button>
        </div>
        <div>
          {/* <label className="block text-gray-700 mb-2"> {title}</label> */}
          {renderInput()}
          <button
            onClick={() => updateField(field)}
            className="w-full bg-black text-white p-2 mt-4 rounded"
          >
            Confirm Edit
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ title, onClose, onConfirm }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={onClose}
          className="text-white bg-red-500 px-2 py-0.5 rounded-sm hover:text-white font-bold text-sm"
        >
          X
        </button>
      </div>
      <p className="mb-4 text-gray-700">
        Are you sure you want to delete this field?
      </p>
      <button
        onClick={onConfirm}
        className="w-full bg-black text-white p-2 rounded"
      >
        Confirm Delete
      </button>
    </div>
  </div>
);

const PersonalInformation = () => {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editField, setEditField] = useState(null);
  const [deleteField, setDeleteField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const params = useParams();

  const [details, setDetails] = useState({});
  const getDetails = async () => {
    try {
      const response = await fetch(
        `https://iba-nceac.onrender.com/api/data/instructor/${params.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setDetails(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showMessage("Failed to fetch details", "error");
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const updateField = async (field) => {
    const patterns = {
      userID: /^INS-\d{4}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      cnicNumber: /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/,
      contactNumber: /^[0-9]{4}-[0-9]{7}$/,
    };

    if (patterns[field] && !patterns[field].test(tempValue)) {
      showMessage(`Invalid ${formatField(field)} format`, "error");
      return;
    }

    try {
      const response = await axios.put(
        `https://iba-nceac.onrender.com/api/data/instructor/edit/${details._id}`,
        { [field]: tempValue, action: `edit${capitalize(field)}` }
      );
      if (response.status === 200) {
        setDetails(response.data);
        showMessage(`${formatField(field)} updated successfully`, "success");
      }
    } catch (error) {
      console.error("Update error:", error);
      showMessage(`Failed to update ${formatField(field)}`, "error");
    }
    setEditField(null);
  };

  const deleteFieldValue = async (field) => {
    try {
      const response = await axios.put(
        `https://iba-nceac.onrender.com/api/data/instructor/${details._id}`,
        { [field]: "", action: `delete${capitalize(field)}` }
      );
      if (response.status === 200) {
        setDetails((prev) => ({ ...prev, [field]: "" }));
        showMessage(`${formatField(field)} deleted successfully`, "success");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showMessage(`Failed to delete ${formatField(field)}`, "error");
    }
    setDeleteField(null);
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const formatField = (str) =>
    str.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());

  useEffect(() => {
    getDetails();
  }, []);

  const fields = [
    ["prefix", details.prefix],
    ["firstName", details.firstName],
    ["lastName", details.lastName],
    ["userID", details.userID],
    ["email", details.email],
    ["gender", details.gender],
    ["cnicNumber", details.cnicNumber],
    ["contactNumber", details.contactNumber],
    ["dateOfBirth", details.dateOfBirth],
    ["districtOfDomicile", details.districtOfDomicile],
    ["province", details.province],
    ["city", details.city],
    ["designation", details.designation],
    ["role", details.role],
    ["religion", details.religion],
    ["officeNumber", details.officeNumber],
    ["officeLocation", details.officeLocation],
  ];

  return (
    <div className="flex p-6">
      {message.text && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white w-full">
        <motion.h2
          className="text-2xl font-bold mb-6 text-[#1F2C73]"
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          Personal Information
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
          {fields.map(([key, value]) => (
            <motion.div
              key={key}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
              className="p-4 border rounded-md bg-gray-50 flex flex-col gap-2 relative"
            >
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  {formatField(key)}
                </label>
                <div className="p-2 bg-white rounded-md border border-gray-200">
                  {value || "—"}
                </div>
              </div>

              {details.role === "HOD" && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => {
                      setTempValue(value || "");
                      setEditField(key);
                    }}
                    className="p-1 text-green-600 hover:bg-green-100 rounded-full"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteField(key)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {editField && (
        <Modal
          title={`Edit ${formatField(editField)}`}
          field={editField}
          tempValue={tempValue}
          setTempValue={setTempValue}
          updateField={updateField}
          onClose={() => setEditField(null)}
        />
      )}

      {deleteField && (
        <DeleteModal
          title={`Delete ${formatField(deleteField)}`}
          onClose={() => setDeleteField(null)}
          onConfirm={() => deleteFieldValue(deleteField)}
        />
      )}
    </div>
  );
};

export default PersonalInformation;
