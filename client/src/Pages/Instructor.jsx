import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Components/Dashboard/Layout.jsx";
import PersonalInfo from "../Components/Dashboard/PersonalInformation.jsx";
import ResearchInfo from "../Components/Dashboard/ResearchInformation.jsx";
import DepartmentsInfo from "../Components/Dashboard/Departments.jsx";
import CoursesInfo from "../Components/Dashboard/Courses.jsx";

const Instructor = () => {
  const [instructorInfo, setInstructorInfo] = useState({});
  const { id } = useParams(); // Get instructor ID from URL params

  // Fetch instructor data
  const getInstructorInfo = async () => {
    try {
      const response = await fetch(
        `https://iba-nceac.onrender.com/api/data/instructor/${id}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setInstructorInfo(data);
      } else {
        console.error("Failed to fetch instructor data.");
      }
    } catch (error) {
      console.error(`Error fetching instructor data: ${error}`);
    }
  };

  // Fetch instructor data on component mount
  useEffect(() => {
    getInstructorInfo();
  }, []);

  // Check if the instructor is an HOD
  const isHOD = ["hod", "head of department", "head of dept"].includes(
    instructorInfo?.role?.toLowerCase()
  );

  return (
    <Layout
      personalContent={<PersonalInfo />}
      researchContent={<ResearchInfo />}
      // Pass the CoursesInfo content
      coursesContent={<CoursesInfo />}
      // Only pass DepartmentsInfo if the role is HOD
      departmentContent={isHOD ? <DepartmentsInfo /> : null}
      showDepartmentTab={isHOD} // Control visibility of the "Departments" tab
    />
  );
};

export default Instructor;
