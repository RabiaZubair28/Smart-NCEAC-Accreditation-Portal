import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, Outlet, useLocation } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { ChevronRight, ChevronDown, Menu } from "lucide-react";
import Navbar from "../Home/Navbar2.jsx";

// Dummy imports for sub-tab content – replace with your actual components
import Departments from "../Dashboard/Departments.jsx";
import DepartmentInfo from "./DepartmentInfo";
import OngoingCourses from "./OngoingCourses";
import OngoingBatches from "./OngoingBatches";
import FacultyInfo from "./FacultyInfo";
import AccreditationDetails from "./AccreditationDetails";
import ReportGeneration from "./ReportGeneration";
import Chatbot from "../ChatBot.jsx";
import Dashboardy from "../../Components/Dashboard/Dashboardy.jsx";

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

export default function DepartmentLayout({
  personalContent,
  researchContent,
  departmentContent,
  coursesContent,
}) {
  const [activeTab, setActiveTab] = useState("departments");
  const [details, setDetails] = useState("");
  const [openMenus, setOpenMenus] = useState({
    courses: false,
    departments: true,
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [category, setCategory] = useState("one");
  const [category2, setCategory2] = useState("one");

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [deptSubTab, setDeptSubTab] = useState("dashboard");

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const getDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/data/instructor/${params.insid}`
      );
      if (response.ok) {
        const data = await response.json();
        setDetails(data);
      }
    } catch (error) {
      console.log(`services error: ${error}`);
    }
  };

  const getDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:1234/api/data/departments"
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

  const getCourses = async () => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/data/course/instructor/${params.insid}`
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
    getDetails();
    getDepartments();
    getCourses();
  }, []);

  useEffect(() => {
    if (location.pathname.includes("/instructor-course")) {
      setActiveTab("courses");
    }
  }, [location.pathname]);

  const renderSidebar = () => (
    <Tabs.List className="w-64 flex flex-col bg-gray-50 border-r border-gray-200">
      <TabButton
        value="dashboard"
        label="Instructor Dashboard"
        isActive={activeTab === "dashboard"}
        onClick={() => {
          setActiveTab("dashboard");
          setSelectedDepartment(null);
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
          setSelectedDepartment(null);
        }}
        hasChildren
        expanded={openMenus.courses}
      />

      {openMenus.courses &&
        courses.map((course) => (
          <div
            key={course._id}
            className="flex items-center justify-between px-4 py-3 pl-8 text-gray-700 hover:bg-blue-50 text-sm cursor-pointer transition-all duration-300 hover:text-[#1F2C73] hover:font-semibold hover:border-b-2 hover:border-[#1F2C73]"
            onClick={() => {
              setCategory("one");
              navigate(
                `/${course.instructorId}/instructor-course/${course.courseCode}/${course._id}`
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
              setCategory2("all");
              toggleMenu("departments");
              setDeptSubTab("department");
            }}
            hasChildren
            expanded={openMenus.departments}
          />

          {openMenus.departments &&
            departments.map((dept) => {
              const isSelected = selectedDepartment?._id === dept._id;
              return (
                <div key={dept._id}>
                  <div
                    className={`flex items-center justify-between px-4 py-3 pl-8 text-[#1F2C73] hover:bg-blue-50 text-md cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "bg-white text-[#1F2C73] font-bold border-b-2 border-[#1F2C73]"
                        : "hover:text-[#1F2C73]"
                    }`}
                    onClick={() => {
                      setActiveTab("departments");
                      setCategory2("one");
                      setSelectedDepartment(isSelected ? null : dept);
                      setDeptSubTab("dashboard");
                      navigate(`../../${params.insid}/department/${dept._id}`);
                      setShowMobileMenu(false);
                    }}
                  >
                    <span>{dept.departmentName}</span>
                    <span>
                      {isSelected ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                  </div>

                  {/* Sub-tabs under department */}
                  {isSelected && (
                    <div className="ml-6 my-2 flex flex-col text-md text-[#1F2C73]">
                      {[
                        {
                          label: "Department Dashboard",
                          value: "dashboard",
                        },
                        {
                          label: "Department Information",
                          value: "department",
                        },
                        {
                          label: "Ongoing Courses",
                          value: "ongoing-courses",
                        },
                        {
                          label: "Ongoing Batches",
                          value: "ongoing-batches",
                        },
                        {
                          label: "Faculty Information",
                          value: "faculty-info",
                        },
                        {
                          label: "Accreditation Details",
                          value: "accreditationDetails",
                        },
                        {
                          label: "Report Generation",
                          value: "reportGeneration",
                        },
                      ].map((tab) => (
                        <div
                          key={tab.value}
                          className={`px-4 py-3 pl-6 cursor-pointer transition hover:bg-blue-50 rounded ${
                            deptSubTab === tab.value
                              ? "text-[#1F2C73] font-bold"
                              : "text-[#1F2C73]"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeptSubTab(tab.value);
                          }}
                        >
                          <span
                            className={`py-1.5 ${
                              deptSubTab === tab.value
                                ? "border-b-2 border-[#1F2C73]"
                                : ""
                            }`}
                          >
                            {tab.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </>
      )}

      <TabButton
        value="chatbot"
        label="NCEAC Assistant"
        isActive={activeTab === "chatbot"}
        onClick={() => {
          setActiveTab("chatbot");
          setSelectedDepartment(null);
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
      <div className="max-w-7xl mx-auto px-0 py-0 md:px-8 md:py-10 mt-[90px]">
        {/* Mobile Menu Button */}
        <div className="md:hidden py-3 flex w-full px-3">
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
                {coursesContent &&
                  React.cloneElement(coursesContent, { category })}
                <Outlet />
              </Tabs.Content>

              <Tabs.Content value="departments" className="outline-none">
                {deptSubTab === "dashboard" && (
                  <Dashboardy department={selectedDepartment} />
                )}
                {deptSubTab === "department" && category2 === "one" && (
                  <DepartmentInfo department={selectedDepartment} />
                )}
                {deptSubTab === "department" && category2 === "all" && (
                  <Departments />
                )}
                {deptSubTab === "ongoing-courses" && (
                  <OngoingCourses department={selectedDepartment} />
                )}

                {deptSubTab === "ongoing-batches" && (
                  <OngoingBatches department={selectedDepartment} />
                )}
                {deptSubTab === "faculty-info" && (
                  <FacultyInfo department={selectedDepartment} />
                )}
                {deptSubTab === "accreditationDetails" && (
                  <AccreditationDetails department={selectedDepartment} />
                )}
                {deptSubTab === "reportGeneration" && (
                  <ReportGeneration department={selectedDepartment} />
                )}
              </Tabs.Content>

              <Tabs.Content value="chatbot" className="outline-none">
                <Chatbot />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </div>
    </motion.div>
  );
}
