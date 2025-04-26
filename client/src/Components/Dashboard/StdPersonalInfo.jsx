import React from 'react';
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios"
import { motion } from 'framer-motion';

const InfoField = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
    <div className="p-2 bg-gray-50 rounded-md border border-gray-200 text-sm md:text-base">
      {value || 'Not specified'}
    </div>
  </div>
);

const StdPersonalInfo = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const [studentDetails, setStudentDetails] = useState({});
  const [error, setError] = useState(null);
  const params = useParams();

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:1234/api/students/info/${params.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        setStudentDetails(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      if (error.response?.status === 404) {
        setError("Student not found");
      } else {
        setError("Failed to load student data. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  return (
    <motion.div
      className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#1F2C73]"
        variants={itemVariants}
      >
        Student Personal Information
      </motion.h2>

      {error ? (
        <motion.div 
          className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200"
          variants={itemVariants}
        >
          {error}
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <motion.div variants={itemVariants}>
              <InfoField label="Student ID" value={studentDetails.studentId} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InfoField label="First Name" value={studentDetails.firstName} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InfoField label="Last Name" value={studentDetails.lastName} />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <motion.div variants={itemVariants}>
              <InfoField label="Email" value={studentDetails.studentEmail} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InfoField label="Gender" value={studentDetails.gender} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InfoField label="Date of Birth" value={studentDetails.dateOfBirth} />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <motion.div variants={itemVariants}>
              <InfoField label="Contact Number" value={studentDetails.contactNumber} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InfoField label="Address" value={studentDetails.address} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InfoField label="City" value={studentDetails.city} />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <motion.div variants={itemVariants}>
              <InfoField label="Country" value={studentDetails.country} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InfoField label="Degree Program" value={studentDetails.degreeProgram} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InfoField label="Batch" value={studentDetails.studentBatch} />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <motion.div variants={itemVariants}>
              <InfoField label="Section" value={studentDetails.studentSection} />
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default StdPersonalInfo;