import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import Navbar from "../Home/LoginNavbar.jsx";
import ReportGeneration from "./ReportGeneration.jsx";
import Chatbot from "../../Components/ChatBot.jsx";

const TabButton = ({ value, label, isActive }) => (
  <Tabs.Trigger
    value={value}
    className={`px-4 py-3 text-sm transition-all duration-300 hover:bg-blue-50 whitespace-nowrap ${
      isActive
        ? "bg-white text-[#1F2C73] font-semibold border-b-2 border-[#1F2C73]"
        : "text-gray-600"
    }`}
  >
    {label}
  </Tabs.Trigger>
);

export default function DepartmentLayout({
  departmentInfo,
  ongoingCourses,
  ongoingBatches,
  facultyInfo,
  cloplomapping,
  accreditationDetails,
  dashboard,
  reportGeneration,
  chatbot,
}) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 pb-8 pt-4 mt-[80px]">
        {/* Mobile Tabs (shown on small screens) */}
        <div className="md:hidden mb-4 bg-white rounded-lg shadow-md overflow-x-auto  ">
          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <Tabs.List className="flex flex-wrap w-full gap-2 p-2 flex-col">
              <TabButton
                value="dashboard"
                label="Dashboard"
                isActive={activeTab === "dashboard"}
              />
              <TabButton
                value="department"
                label="Department Information"
                isActive={activeTab === "department"}
              />
              <TabButton
                value="ongoing-courses"
                label="Ongoing Courses"
                isActive={activeTab === "ongoing-courses"}
              />
              <TabButton
                value="ongoing-batches"
                label="Ongoing Batches"
                isActive={activeTab === "ongoing-batches"}
              />
              <TabButton
                value="faculty-info"
                label="Faculty Information"
                isActive={activeTab === "faculty-info"}
              />
              <TabButton
                value="accreditationDetails"
                label="Accreditation Details"
                isActive={activeTab === "accreditationDetails"}
              />
              <TabButton
                value="reportGeneration"
                label="Report Generation"
                isActive={activeTab === "reportGeneration"}
              />
              <TabButton
                value="chatbot"
                label="NCEAC Assistant"
                isActive={activeTab === "chatbot"}
              />
            </Tabs.List>
          </Tabs.Root>
        </div>

        {/* Desktop Layout (shown on larger screens) */}
        <div className="hidden md:flex  bg-white rounded-lg shadow-md overflow-hidden">
          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex w-full"
          >
            {/* Sidebar */}
            <Tabs.List className="w-52 flex flex-col bg-gray-50 border-r border-gray-200">
              <TabButton
                value="dashboard"
                label="Dashboard"
                isActive={activeTab === "dashboard"}
              />
              <TabButton
                value="department"
                label="Department Information"
                isActive={activeTab === "department"}
              />
              <TabButton
                value="ongoing-courses"
                label="Ongoing Courses"
                isActive={activeTab === "ongoing-courses"}
              />
              <TabButton
                value="ongoing-batches"
                label="Ongoing Batches"
                isActive={activeTab === "ongoing-batches"}
              />
              <TabButton
                value="faculty-info"
                label="Faculty Information"
                isActive={activeTab === "faculty-info"}
              />
              <TabButton
                value="accreditationDetails"
                label="Accreditation Details"
                isActive={activeTab === "accreditationDetails"}
              />
              <TabButton
                value="reportGeneration"
                label="Report Generation"
                isActive={activeTab === "reportGeneration"}
              />
              <TabButton
                value="chatbot"
                label="NCEAC Assistant"
                isActive={activeTab === "chatbot"}
              />
            </Tabs.List>

            {/* Main Content */}
            <div className="flex-1 p-8">
              <Tabs.Content value="dashboard" className="outline-none">
                {dashboard}
              </Tabs.Content>
              <Tabs.Content value="department" className="outline-none">
                {departmentInfo}
              </Tabs.Content>
              <Tabs.Content value="ongoing-courses" className="outline-none">
                {ongoingCourses}
              </Tabs.Content>
              <Tabs.Content value="ongoing-batches" className="outline-none">
                {ongoingBatches}
              </Tabs.Content>
              <Tabs.Content value="faculty-info" className="outline-none">
                {facultyInfo}
              </Tabs.Content>
              <Tabs.Content value="cloplomapping" className="outline-none">
                {cloplomapping}
              </Tabs.Content>
              <Tabs.Content
                value="accreditationDetails"
                className="outline-none"
              >
                {accreditationDetails}
              </Tabs.Content>
              <Tabs.Content value="reportGeneration" className="outline-none">
                <ReportGeneration />
              </Tabs.Content>
              <Tabs.Content value="chatbot" className="outline-none">
                <Chatbot />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>

        {/* Mobile Content (shown on small screens) */}
        <div className="md:hidden  bg-white rounded-lg shadow-md">
          <Tabs.Root value={activeTab}>
            <Tabs.Content value="dashboard" className="outline-none">
              {dashboard}
            </Tabs.Content>
            <Tabs.Content value="department" className="outline-none">
              {departmentInfo}
            </Tabs.Content>
            <Tabs.Content value="ongoing-courses" className="outline-none">
              {ongoingCourses}
            </Tabs.Content>
            <Tabs.Content value="ongoing-batches" className="outline-none">
              {ongoingBatches}
            </Tabs.Content>
            <Tabs.Content value="faculty-info" className="outline-none">
              {facultyInfo}
            </Tabs.Content>
            <Tabs.Content value="cloplomapping" className="outline-none">
              {cloplomapping}
            </Tabs.Content>
            <Tabs.Content value="accreditationDetails" className="outline-none">
              {accreditationDetails}
            </Tabs.Content>
            <Tabs.Content value="reportGeneration" className="outline-none">
              <ReportGeneration />
            </Tabs.Content>
            <Tabs.Content value="chatbot" className="outline-none">
              <Chatbot />
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </motion.div>
  );
}
