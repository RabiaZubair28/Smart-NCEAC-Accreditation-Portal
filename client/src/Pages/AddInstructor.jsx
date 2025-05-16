import React, { useState } from "react";
import { motion } from "framer-motion";

const AddInstructor = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
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
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://iba-nceac.site/api/data/instructor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Instructor added successfully");
        onSuccess(); // Callback for updating the parent component
        onClose(); // Close the modal
      } else {
        alert(data.msg || "Failed to add instructor");
      }
    } catch (error) {
      console.error("Error adding instructor:", error);
      alert("An error occurred while adding the instructor.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-200 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New Instructor</h2>
          <button
            onClick={onClose}
            className="text-red-500 font-bold text-sm hover:text-red-700"
          >
            X
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="userID"
              placeholder="Instructor ID (e.g., INS-123)"
              className="p-2 border rounded w-full"
              value={formData.userID}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="p-2 border rounded w-full"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="p-2 border rounded w-full"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="p-2 border rounded w-full"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="p-2 border rounded w-full"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <select
              name="gender"
              className="p-2 border rounded w-full"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              name="cnicNumber"
              placeholder="CNIC (e.g., 12345-1234567-1)"
              className="p-2 border rounded w-full"
              value={formData.cnicNumber}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number (e.g., 0300-1234567)"
              className="p-2 border rounded w-full"
              value={formData.contactNumber}
              onChange={handleChange}
            />
            <input
              type="date"
              name="dateOfBirth"
              className="p-2 border rounded w-full"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              className="p-2 border rounded w-full"
              value={formData.city}
              onChange={handleChange}
            />
            <input
              type="text"
              name="districtOfDomicile"
              placeholder="District of Domicile"
              className="p-2 border rounded w-full"
              value={formData.districtOfDomicile}
              onChange={handleChange}
            />
            <input
              type="text"
              name="province"
              placeholder="Province"
              className="p-2 border rounded w-full"
              value={formData.province}
              onChange={handleChange}
            />
            <input
              type="text"
              name="religion"
              placeholder="Religion"
              className="p-2 border rounded w-full"
              value={formData.religion}
              onChange={handleChange}
            />
            <input
              type="text"
              name="officeNumber"
              placeholder="Office Number"
              className="p-2 border rounded w-full"
              value={formData.officeNumber}
              onChange={handleChange}
            />
            <input
              type="text"
              name="officeLocation"
              placeholder="Office Location"
              className="p-2 border rounded w-full"
              value={formData.officeLocation}
              onChange={handleChange}
            />
            <input
              type="text"
              name="designation"
              placeholder="Designation"
              className="p-2 border rounded w-full"
              value={formData.designation}
              onChange={handleChange}
            />
            <select
              name="role"
              className="p-2 border rounded w-full"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="Instructor">Instructor</option>
              <option value="Admin">Hod</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-6 bg-[#1F2C73] text-white py-2 px-4 rounded w-full"
          >
            Add Instructor
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddInstructor;
