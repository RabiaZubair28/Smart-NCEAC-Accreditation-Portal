import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import Navbar from "../Home/LoginNavbar.jsx";

const TabButton = ({ value, label, isActive, isMobile = false }) => (
  <Tabs.Trigger
    value={value}
    className={`${
      isMobile
        ? `px-4 py-3 text-sm transition-all duration-300 hover:bg-blue-50 whitespace-nowrap ${
            isActive
              ? "bg-white text-[#1F2C73] font-semibold border-b-2 border-[#1F2C73]"
              : "text-gray-600"
          }`
        : `w-full px-6 py-4 text-left transition-all duration-300 hover:bg-blue-50 ${
            isActive
              ? "bg-white text-[#1F2C73] font-semibold border-l-4 border-[#1F2C73]"
              : "text-gray-600"
          }`
    }`}
  >
    {label}
  </Tabs.Trigger>
);

export default function StudentLayout({
  personalInfoContent,
  enrolledCoursesContent,
  reportGenerationContent,
}) {
  const [activeTab, setActiveTab] = useState("personalInfo");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 mt-[80px]">
        {/* Mobile Tabs (shown on small screens) */}
        <div className="md:hidden mb-4 bg-white rounded-lg shadow-md">
          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <Tabs.List className="flex flex-col w-full">
              <TabButton
                value="personalInfo"
                label="Personal Info"
                isActive={activeTab === "personalInfo"}
                isMobile={true}
              />
              <TabButton
                value="enrolledCourses"
                label="Enrolled Courses"
                isActive={activeTab === "enrolledCourses"}
                isMobile={true}
              />
              <TabButton
                value="reportGeneration"
                label="Report Generation"
                isActive={activeTab === "reportGeneration"}
                isMobile={true}
              />
            </Tabs.List>
          </Tabs.Root>
        </div>

        {/* Desktop Layout (shown on larger screens) */}
        <div className="hidden md:flex bg-white rounded-lg shadow-md overflow-hidden">
          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex w-full"
          >
            {/* Sidebar */}
            <Tabs.List className="w-52 flex flex-col bg-gray-50 border-r border-gray-200">
              <TabButton
                value="personalInfo"
                label="Personal Info"
                isActive={activeTab === "personalInfo"}
              />
              <TabButton
                value="enrolledCourses"
                label="Enrolled Courses"
                isActive={activeTab === "enrolledCourses"}
              />
              <TabButton
                value="reportGeneration"
                label="Report Generation"
                isActive={activeTab === "reportGeneration"}
              />
            </Tabs.List>

            {/* Main Content */}
            <div className="flex-1 p-8">
              <Tabs.Content value="personalInfo" className="outline-none">
                {personalInfoContent}
              </Tabs.Content>
              <Tabs.Content value="enrolledCourses" className="outline-none">
                {enrolledCoursesContent}
              </Tabs.Content>
              <Tabs.Content value="reportGeneration" className="outline-none">
                {reportGenerationContent}
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>

        {/* Mobile Content (shown on small screens) */}
        <div className="md:hidden bg-white rounded-lg shadow-md">
          <Tabs.Root value={activeTab}>
            <Tabs.Content value="personalInfo" className="outline-none">
              {personalInfoContent}
            </Tabs.Content>
            <Tabs.Content value="enrolledCourses" className="outline-none">
              {enrolledCoursesContent}
            </Tabs.Content>
            <Tabs.Content value="reportGeneration" className="outline-none">
              {reportGenerationContent}
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </motion.div>
  );
}