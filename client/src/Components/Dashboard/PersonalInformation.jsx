import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { User } from "lucide-react";
import Navbar4 from "../Home/Navbar4";
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
  const [editField, setEditField] = useState(null);
  const [deleteField, setDeleteField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const [editImage, setEditImage] = useState(false);
  const [load, setLoad] = useState("Kindly Upload your Image!");
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const params = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState({});
  const getDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/data/instructor/${params.id}`
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "first_time_using_cloudinary");
    data.append("cloud_name", "dxokfhkhu");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dxokfhkhu/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const uploadedImgURL = await res.json();
    // console.log(uploadedImgURL.url)
    // console.log(file)
    return uploadedImgURL.url;
  };

  const handleEditCover = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoad("Uploading image..."); // Start loading

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "first_time_using_cloudinary");
    data.append("cloud_name", "dxokfhkhu");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxokfhkhu/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploadedImgURL = await res.json();
      const newImg = uploadedImgURL.url;
      console.log("Uploaded image URL:", newImg);

      if (!newImg) {
        setLoad(""); // Reset if upload failed
        alert("Failed to upload image.");
        return;
      }

      setLoad("Updating Avatar..."); // Next phase: updating in DB

      const response = await axios.put(
        `http://localhost:1234/api/updateCover/${params.id}`,
        { avatar: newImg }
      );

      if (response.status === 200) {
        console.log("Cover updated successfully:", response.data);
        setMessage("Cover Successfully updated!", "success");
        setLoad("Please Wait!"); // Done
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating cover:", error);
      alert("Error Updating Cover!");
      setLoad(""); // Done or failed
    }
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
        `http://localhost:1234/api/data/instructor/edit/${details._id}`,
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
        `http://localhost:1234/api/data/instructor/${details._id}`,
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

    ["religion", details.religion],
    ["officeNumber", details.officeNumber],
    ["officeLocation", details.officeLocation],
  ];

  return (
    <div className="flex ">
      <Navbar4 />
      {message.text && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white w-full mt-[80px] px-12 py-6">
        <div className="flex justify-end">
          {/* <motion.div
            className="text-lg font-medium px-8 py-2 text-white cursor-pointer  bg-[#1F2C73] flex rounded-lg"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 },
            }}
            onClick={() => {
              navigate(`/instructor/${params.id}`);
            }}
          >
            Back to home
          </motion.div> */}
        </div>

        <div className="flex flex-col items-center mb-8">
          {/* Avatar Container */}
          <div className="relative w-[200px] h-[200px] rounded-2xl bg-gray-200 flex items-center justify-center overflow-hidden mb-4 shadow-md">
            {details.avatar ? (
              <img
                src={details.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={64} className="text-gray-400" />
            )}

            {/* Edit Button - positioned absolutely */}
            <button
              className="absolute bottom-3 right-3 border border-gray-300 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
              onClick={() => {
                setEditImage(true);
              }}
            >
              <Edit size={18} className="text-green-600" />
            </button>
          </div>

          {/* Name and Designation */}
          <h2 className="text-2xl font-bold text-[#1F2C73]">
            {details.prefix} {details.firstName} {details.lastName}
          </h2>
          <p className="text-gray-600">{details.designation}</p>
        </div>

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
                {/* <button
                  onClick={() => setDeleteField(key)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                >
                  <Trash2 size={18} />
                </button> */}
              </div>
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

      {editImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Image</h2>
              <button
                onClick={() => {
                  setEditImage(false);
                }}
                className="text-white bg-red-500 px-2 py-0.5 rounded-sm hover:text-white font-bold text-sm "
              >
                X
              </button>
            </div>
            <div className="flex items-center justify-center pt-1.5 gap-6 w-fit mx-auto">
              <input
                type="file"
                className="file-input w-56 h-8 text-sm"
                onChange={handleEditCover}
              />
            </div>
            <button className="bg-[#1F2C73] mt-5 text-white w-full rounded-md text-center text-md font-semibold py-3">
              {load}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInformation;
