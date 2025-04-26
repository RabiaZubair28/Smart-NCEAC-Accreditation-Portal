import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Instructor from "./Pages/AddInstructor.jsx";
import CourseDetails from "./Components/DepartmentSections/CourseDetails.jsx";
import CourseDetails2 from "./Components/DepartmentSections/CourseDetails2.jsx";
import DepartmentLayout from "./Components/DepartmentSections/DepartmentLayout.jsx";
import Hero from "./Components/Home/Hero.jsx";
import Navbar from "./Components/Home/Navbar.jsx";
import Login from "./Pages/Login.jsx";
import Layout from "./Components/Dashboard/Layout";
import PersonalInfo from "./Components/Dashboard/PersonalInformation.jsx";
import ResearchInfo from "./Components/Dashboard/ResearchInformation.jsx";
import Departments from "./Components/Dashboard/Departments";
import DepartmentInfo from "./Components/DepartmentSections/DepartmentInfo.jsx";
import OngoingCourses from "./Components/DepartmentSections/OngoingCourses.jsx";
import Courses from "./Components/Dashboard/Courses.jsx";
import Student from "./Pages/Student.jsx";
import Batches from "./Pages/Batches.jsx";
import Working from "./Pages/Working.jsx";
import Tab03screen08 from "./Components/MappingScreens/Tab03screen08.jsx";
import OngoingBatches from "./Components/DepartmentSections/OngoingBatches.jsx";
import ContactForm from "./Components/Home/ContactForm.jsx";
import FacultyInfo from "./Components/DepartmentSections/FacultyInfo.jsx";
import Footer from "./Components/Home/Footer.jsx";
import EnrolledStudents from "./Pages/EnrolledStudents.jsx";

import CloPloMapping from "./Components/DepartmentSections/CloPloMapping.jsx";
import AccreditationDetails from "./Components/DepartmentSections/AccreditationDetails.jsx";
import StudentLayout from "./Components/Dashboard/StudentLayout.jsx";
import StdPersonalInfo from "./Components/Dashboard/StdPersonalInfo.jsx";
import EnrolledCourses from "./Components/Dashboard/EnrolledCourses.jsx";
import ClOPLOMapping from "./Components/Dashboard/CloploMapping.jsx";
import StudentReports from "./Components/Dashboard/StudentReports.jsx";
import StudentLogin from "./Pages/StudentLogin.jsx";
import GoToStudent from "./Pages/GoToStudent.jsx";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import EnrolledStudents2 from "./Pages/EnrolledStudents2.jsx";

import GoToStudent2 from "./Pages/GoToStudent2.jsx";
import Dashboardy from "./Components/Dashboard/Dashboardy.jsx";
import SectionStudents from "./Pages/SectionStudents.jsx";
import Upload from "./Pages/Upload.jsx";
import ChatBot from "./Components/ChatBot.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route
            path="/instructor-course/:courseCode/:id"
            element={<CourseDetails2 />}
          />

          <Route
            path="/department/:id"
            element={
              <DepartmentLayout
                departmentInfo={<DepartmentInfo />}
                ongoingCourses={<OngoingCourses />}
                ongoingBatches={<OngoingBatches />}
                facultyInfo={<FacultyInfo />}
                cloplomapping={<CloPloMapping />}
                accreditationDetails={<AccreditationDetails />}
                dashboard={<Dashboardy />}
                chatbot={<ChatBot />}
              />
            }
          />
          <Route path="/enrolled-students/:id" element={<EnrolledStudents />} />

          <Route
            path="/course/enrolled-students/:courseCode/:id"
            element={<EnrolledStudents2 />}
          />
          <Route path="/" element={<Hero />} />
          <Route path="/home" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student" element={<Student />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/assessments" element={<Tab03screen08 />} />
          <Route path="/working" element={<Working />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/add-instructor" element={<Instructor />} />
          <Route path="/enrolled-students/:id" element={<EnrolledStudents />} />
          <Route path="/student/giveGrades/:id" element={<GoToStudent />} />
          <Route
            path="/course/:courseCode/:courseId/student/giveGrades/:id"
            element={<GoToStudent2 />}
          />
          <Route
            path="/section/:batchId/:section"
            element={<SectionStudents />}
          />
          <Route path="/upload" element={<Upload />} />
          <Route
            path="/instructor/:id"
            element={
              <Layout
                personalContent={<PersonalInfo />}
                researchContent={<ResearchInfo />}
                coursesContent={<Courses />}
                departmentContent={<Departments />}
                chatbot={<ChatBot />}
              />
            }
          />

          <Route
            path="/student/:id"
            element={
              <StudentLayout
                personalInfoContent={<StdPersonalInfo />}
                enrolledCoursesContent={<EnrolledCourses />}
                cloPloMappingContent={<ClOPLOMapping />} // Example content
                reportGenerationContent={<StudentReports />} // Example content
              />
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>

        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
