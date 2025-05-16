import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { ChevronRight, ChevronDown, Menu } from "lucide-react";
import Navbar from "../Home/LoginNavbar.jsx";

const TabButton = ({
  value,
  label,
  isActive,
  onClick,
  hasChildren,
  expanded,
}) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-3 text-lg cursor-pointer transition-all duration-300 hover:bg-blue-50 whitespace-nowrap ${
      isActive
        ? "bg-white text-[#1F2C73] font-bold border-b-2 border-[#1F2C73]"
        : "text-gray-600"
    }`}
  >
    <span>{label}</span>
    {hasChildren && (
      <span onClick={(e) => e.stopPropagation()}>
        {expanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </span>
    )}
  </div>
);

export default function Layout({
  personalContent,
  researchContent,
  departmentContent,
  coursesContent,
  chatbot,
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [details, setDetails] = useState("");
  const [openMenus, setOpenMenus] = useState({
    courses: false,
    departments: false,
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const getDetails = async () => {
    try {
      const response = await fetch(
        `https://iba-nceac.site/api/data/instructor/${params.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setDetails(data);
      }
    } catch (error) {
      console.log(`services error: ${error}`);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const getDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://iba-nceac.site/api/data/departments"
      );
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error(`Services error: ${error}`);
      alert("Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);

  const [courses, setCourses] = useState([]);
  const getCourses = async () => {
    try {
      const response = await fetch(
        `https://iba-nceac.site/api/data/course/instructor/${params.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error(`Error fetching courses: ${error}`);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const renderSidebar = () => (
    <Tabs.List className="w-64 flex flex-col bg-gray-50 border-r border-gray-200">
      <TabButton
        value="dashboard"
        label="Instructor Dashboard"
        isActive={activeTab === "dashboard"}
        onClick={() => {
          setActiveTab("dashboard");
          setShowMobileMenu(false);
        }}
      />

      <TabButton
        value="courses"
        label="Assigned Courses"
        isActive={activeTab === "courses"}
        onClick={() => {
          setActiveTab("courses");
          toggleMenu("courses");
        }}
        hasChildren
        expanded={openMenus.courses}
      />
      {openMenus.courses &&
        courses.map((course) => (
          <div
            key={course._id}
            className={`flex items-center justify-between px-4 py-3 pl-8 text-gray-700  hover:bg-blue-5 text-md cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:text-[#1F2C73] hover:font-semibold hover:border-b-2 hover:border-[#1F2C73] `}
            onClick={() => {
              navigate(
                `../../${course.instructorId}/instructor-course/${course.courseCode}/${course._id}`
              );
              setShowMobileMenu(false);
            }}
          >
            {course.courseName}
          </div>
        ))}

      {(details?.role?.toLowerCase?.().includes("hod") ||
        details?.role?.toLowerCase?.().includes("head")) && (
        <>
          <TabButton
            value="departments"
            label="Departments"
            isActive={activeTab === "departments"}
            onClick={() => {
              setActiveTab("departments");
              toggleMenu("departments");
            }}
            hasChildren
            expanded={openMenus.departments}
          />
          {openMenus.departments &&
            departments.map((dept) => (
              <div
                key={dept._id}
                className={`flex items-center justify-between px-4 py-3 pl-8 text-gray-700  hover:bg-blue-5 text-md cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:text-[#1F2C73] hover:font-semibold hover:border-b-2 hover:border-[#1F2C73] hover:whitespace-nowrap`}
                onClick={() => {
                  navigate(`../../${params.id}/department/${dept._id}`);
                  setShowMobileMenu(false);
                }}
              >
                {dept.departmentName}
                <ChevronRight className="w-4 h-4" />
              </div>
            ))}
        </>
      )}

      <TabButton
        value="chatbot"
        label="NCEAC Assistant"
        isActive={activeTab === "chatbot"}
        onClick={() => {
          setActiveTab("chatbot");
          setShowMobileMenu(false);
        }}
      />
    </Tabs.List>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <Navbar />
      <div
        className="max-w-7xl mx-auto px-0 py-0 md:px-8 md:py-10
mt-[90px]"
      >
        {/* Mobile Menu Button */}
        <div className="md:hidden  py-3 flex w-full px-3">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-md text-gray-700 border-gray-100 hover:bg-white bg-white focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex w-full"
          >
            {/* Desktop Sidebar (always visible) */}
            <div className="hidden md:block">{renderSidebar()}</div>

            {/* Mobile Sidebar (conditionally visible) */}
            {showMobileMenu && (
              <div className="md:hidden absolute z-50 mt-0 flex items-center bg-white shadow-lg rounded-md">
                {renderSidebar()}
              </div>
            )}

            <div className="flex-1 p-0 md:p-0 lg:p-0">
              <Tabs.Content value="dashboard" className="outline-none">
                {researchContent}
              </Tabs.Content>
              <Tabs.Content value="courses" className="outline-none">
                {coursesContent}
              </Tabs.Content>
              <Tabs.Content value="departments" className="outline-none">
                {departmentContent}
              </Tabs.Content>
              <Tabs.Content value="chatbot" className="outline-none">
                {chatbot}
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </div>
    </motion.div>
  );
}
