import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, Outlet, useLocation } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { ChevronRight, ChevronDown, Menu } from "lucide-react";
import Navbar from "../Home/Navbar2.jsx";

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

export default function CourseInfoLayout({
  researchContent,
  coursesContent,
  departmentContent,
  chatbot,
}) {
  const [activeTab, setActiveTab] = useState("courses");
  const [openMenus, setOpenMenus] = useState({
    courses: true,
    departments: false,
  });
  const [details, setDetails] = useState({});
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [category, setCategory] = useState("one");
  const [category2, setCategory2] = useState("one");

  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await fetch(
          `http://localhost:1234/api/data/instructor/${params.insid}`
        );
        if (res.ok) setDetails(await res.json());
      } catch (err) {
        console.error("Instructor fetch error:", err);
      }
    };

    const getDepartments = async () => {
      try {
        const res = await fetch("http://localhost:1234/api/data/departments");
        if (res.ok) setDepartments(await res.json());
      } catch (err) {
        console.error("Departments fetch error:", err);
      }
    };

    const getCourses = async () => {
      try {
        const res = await fetch(
          `http://localhost:1234/api/data/course/instructor/${params.insid}`
        );
        if (res.ok) setCourses(await res.json());
      } catch (err) {
        console.error("Courses fetch error:", err);
      }
    };

    getDetails();
    getDepartments();
    getCourses();
  }, [params.insid]);

  useEffect(() => {
    if (location.pathname.includes("/instructor-course")) {
      setActiveTab("courses");
    }
  }, [location.pathname]);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

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
          setCategory("all");
          toggleMenu("courses");
        }}
        hasChildren
        expanded={openMenus.courses}
      />
      {openMenus.courses &&
        courses.map((course) => {
          const isSelected = location.pathname.includes(course._id);
          return (
            <div
              key={course._id}
              className={`flex items-center justify-between px-4 py-3 pl-8 text-md cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "bg-white text-[#1F2C73] font-bold border-b-2 border-[#1F2C73]"
                  : "hover:text-[#1F2C73]"
              }`}
              onClick={() => {
                navigate(
                  `/${course.instructorId}/instructor-course/${course.courseCode}/${course._id}`
                );
                setActiveTab("courses");
                setCategory("one");
                setShowMobileMenu(false);
              }}
            >
              {course.courseName}
            </div>
          );
        })}

      {(details?.role?.toLowerCase?.().includes("hod") ||
        details?.role?.toLowerCase?.().includes("head")) && (
        <>
          <TabButton
            value="departments"
            label="Departments"
            isActive={activeTab === "departments"}
            onClick={() => {
              setActiveTab("departments");
              setCategory2("all");
              toggleMenu("departments");
            }}
            hasChildren
            expanded={openMenus.departments}
          />
          {openMenus.departments &&
            departments.map((dept) => (
              <div
                key={dept._id}
                className="flex items-center justify-between px-4 py-3 pl-8 text-gray-700 hover:bg-blue-50 text-md cursor-pointer transition-all duration-300 hover:text-[#1F2C73] hover:font-semibold hover:border-b-2 hover:border-[#1F2C73]"
                onClick={() => {
                  navigate(`/${params.insid}/department/${dept._id}`);
                  setCategory2("one");
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
      <div className="max-w-7xl mx-auto px-4 py-4 mt-[80px]">
        {/* Mobile toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-md text-gray-700 border-gray-300 border bg-white shadow-sm"
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
            {/* Desktop Sidebar */}
            <div className="hidden md:block">{renderSidebar()}</div>

            {/* Mobile Sidebar */}
            {showMobileMenu && (
              <div className="md:hidden absolute z-50 bg-white shadow-lg rounded-md">
                {renderSidebar()}
              </div>
            )}

            <div className="flex-1 p-4 md:p-0">
              <Tabs.Content value="dashboard" className="outline-none">
                {researchContent}
              </Tabs.Content>
              <Tabs.Content value="courses" className="outline-none">
                {coursesContent &&
                  React.cloneElement(coursesContent, { category })}
                <Outlet />
              </Tabs.Content>
              <Tabs.Content value="departments" className="outline-none">
                {departmentContent &&
                  React.cloneElement(departmentContent, { category2 })}
                <Outlet />
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
