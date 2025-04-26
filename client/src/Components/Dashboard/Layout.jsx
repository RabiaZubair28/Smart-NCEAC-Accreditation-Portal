import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import Navbar from "../Home/LoginNavbar.jsx";

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

export default function Layout({
  personalContent,
  researchContent,
  departmentContent,
  coursesContent,
  chatbot,
}) {
  const [activeTab, setActiveTab] = useState("personal");
  const [details, setDetails] = useState("");
  const params = useParams();
  console.log(params);

  const getDetails = async () => {
    try {
      const response = await fetch(
        `https://iba-nceac.site/api/data/instructor/${params.id}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setDetails(data);
        console.log(details);
      }
    } catch (error) {
      console.log(`services error: ${error}`);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

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
        <div className="md:hidden mb-4 bg-white rounded-lg shadow-md overflow-x-auto">
          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <Tabs.List className="flex flex-col flex-wrap w-full gap-2 p-2 ">
              <TabButton
                value="personal"
                label="Personal Information"
                isActive={activeTab === "personal"}
              />
              <TabButton
                value="research"
                label="Research Information"
                isActive={activeTab === "research"}
              />
              <TabButton
                value="courses"
                label="Courses Information"
                isActive={activeTab === "courses"}
              />
              {(details?.role?.toLowerCase?.() === "hod" ||
                details?.role?.toLowerCase?.() === "head of department" ||
                details?.role?.toLowerCase?.() === "head of dept") && (
                <TabButton
                  value="departments"
                  label="Department Information"
                  isActive={activeTab === "departments"}
                />
              )}
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
                value="personal"
                label="Personal Information"
                isActive={activeTab === "personal"}
              />
              <TabButton
                value="research"
                label="Research Information"
                isActive={activeTab === "research"}
              />
              <TabButton
                value="courses"
                label="Courses Information"
                isActive={activeTab === "courses"}
              />
              {(details?.role?.toLowerCase?.() === "hod" ||
                details?.role?.toLowerCase?.() === "head of department" ||
                details?.role?.toLowerCase?.() === "head of dept") && (
                <TabButton
                  value="departments"
                  label="Department Information"
                  isActive={activeTab === "departments"}
                />
              )}
              <TabButton
                value="chatbot"
                label="NCEAC Assistant"
                isActive={activeTab === "chatbot"}
              />
            </Tabs.List>

            {/* Main Content */}
            <div className="flex-1  p-8 md:p-0 lg:p-0">
              <Tabs.Content value="personal" className="outline-none">
                {personalContent}
              </Tabs.Content>
              <Tabs.Content value="research" className="outline-none">
                {researchContent}
              </Tabs.Content>
              <Tabs.Content value="courses" className="outline-none">
                {coursesContent}
              </Tabs.Content>
              {(details?.role?.toLowerCase?.() === "hod" ||
                details?.role?.toLowerCase?.() === "head of department" ||
                details?.role?.toLowerCase?.() === "head of dept") && (
                <Tabs.Content value="departments" className="outline-none">
                  {departmentContent}
                </Tabs.Content>
              )}
              <Tabs.Content value="chatbot" className="outline-none">
                {chatbot}
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>

        {/* Mobile Content (shown on small screens) */}
        <div className="md:hidden bg-white rounded-lg shadow-md">
          <Tabs.Root value={activeTab}>
            <Tabs.Content value="personal" className="outline-none">
              {personalContent}
            </Tabs.Content>
            <Tabs.Content value="research" className="outline-none">
              {researchContent}
            </Tabs.Content>
            <Tabs.Content value="courses" className="outline-none">
              {coursesContent}
            </Tabs.Content>
            {(details?.role?.toLowerCase?.() === "hod" ||
              details?.role?.toLowerCase?.() === "head of department" ||
              details?.role?.toLowerCase?.() === "head of dept") && (
              <Tabs.Content value="departments" className="outline-none">
                {departmentContent}
              </Tabs.Content>
            )}
            <Tabs.Content value="chatbot" className="outline-none">
              {chatbot}
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </motion.div>
  );
}
