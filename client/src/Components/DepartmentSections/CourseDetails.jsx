import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Edit, Trash2, Plus } from "lucide-react";
import axios from "axios";
import Navbar from "../Home/Navbar3.jsx";

const CourseDetails = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [courseInfo, setCourseInfo] = useState({
    courseCode: "",
    courseName: "",
    departmentName: "",
    courseType: "",
    prerequisites: [],
    creditHours: "",
    startingDate: "",
    endingDate: "",
    courseDescription: "",
    departmentId: "",
    CLO: [],
    instructorId: "",
    assessments: [],
    students: [],
  });

  const [label, setLabel] = useState(false);
  const [exceedLimit, setExceedLimit] = useState(false);
  const [totalAssessmentsMarks, setTotalAssessmentsMarks] = useState(0);
  const [selectedCLO, setSelectedCLO] = useState("");
  const [isEditAssessmentModalOpen, setIsEditAssessmentModalOpen] =
    useState(false);
  const [isEditQuestionModalOpen, setIsEditQuestionModalOpen] = useState(false);
  const [assessmentToEdit, setAssessmentToEdit] = useState(null);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [currentAssessmentId, setCurrentAssessmentId] = useState(null);

  // Calculate total assessments marks whenever assessments change
  useEffect(() => {
    if (courseInfo.assessments) {
      const total = courseInfo.assessments.reduce((sum, assessment) => {
        return sum + (Number(assessment.totalMarks) || 0);
      }, 0);
      setTotalAssessmentsMarks(total);
    }
  }, [courseInfo.assessments]);

  // Helper function to calculate total marks of questions in an assessment
  const calculateTotalQuestionMarks = (assessment) => {
    if (!assessment || !assessment.questions) return 0;
    return assessment.questions.reduce((sum, question) => {
      return sum + (Number(question.totalQuestionMarks) || 0);
    }, 0);
  };

  const initialQuestionData = {
    questionNumber: "",
    totalQuestionMarks: "",
    totalQuestionPLO: "",
    threshold: 0,
    clos: [{ cloId: "", cloWeight: "" }],
  };

  const [questionData, setQuestionData] = useState(initialQuestionData);

  const handleInputChange = (e) => {
    setQuestionData({
      ...questionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCLOChangetoAssessment = (index, field, value) => {
    const updatedCLOs = [...questionData.clos];

    if (field === "cloId") {
      setSelectedCLO(value);
    }

    updatedCLOs[index] = {
      ...updatedCLOs[index],
      [field]: value,
    };

    setQuestionData({ ...questionData, clos: updatedCLOs });
  };

  const addCLOField = () => {
    setQuestionData({
      ...questionData,
      clos: [...questionData.clos, { cloId: "", cloWeight: "" }],
    });
  };

  const handleAddQuestiontoAssessment = async (e, assessmentId) => {
    e.preventDefault();

    // Find the assessment
    const assessment = courseInfo.assessments.find(
      (a) => a._id === assessmentId
    );
    if (!assessment) {
      alert("Assessment not found");
      return;
    }

    // Calculate current total marks of questions
    const currentTotalMarks = calculateTotalQuestionMarks(assessment);
    const newQuestionMarks = Number(questionData.totalQuestionMarks) || 0;

    // Check if adding this question would exceed assessment total marks
    if (currentTotalMarks + newQuestionMarks > Number(assessment.totalMarks)) {
      alert(
        `Cannot add question. Total marks would exceed assessment's total marks of ${assessment.totalMarks}. Current total: ${currentTotalMarks}`
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:1234/api/assessments/add-question/${params.id}/${assessmentId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(questionData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Question added successfully!");
        setIsModalOpen(false);
        setQuestionData(initialQuestionData);
        setIsModalOpen02(false);
        getCourseInfo();
      } else {
        alert("Failed to add question: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("An error occurred while adding the question.");
    }
  };

  const handleDeleteQuestionFromAssessment = async (
    assessmentId,
    questionId
  ) => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/assessments/delete-question/${assessmentId}/${questionId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to delete question");

      alert("Question deleted successfully!");
      getCourseInfo();
    } catch (error) {
      console.error("Error deleting question:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedField, setEditedField] = useState("");
  const [editedValue, setEditedValue] = useState("");
  const [newCLO, setNewCLO] = useState("");
  const [addNewCLO, setAddNewCLO] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteModalOpenCLO, setIsDeleteModalOpenCLO] = useState(false);
  const [addNewAssessment, setAddNewAssessment] = useState(false);
  const [isModalOpen02, setIsModalOpen02] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [capturedCourseId, setCapturedCourseId] = useState(null);
  const [capturedCourseName, setCapturedCourseName] = useState(null);

  const getCourseInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/data/course/id/${params.id}`,
        { method: "GET" }
      );

      if (response.ok) {
        const data = await response.json();
        setCapturedCourseId(params.id);
        setCapturedCourseName(data.courseName);
        setCourseInfo(data);
      }
    } catch (error) {
      console.error(`Services error: ${error}`);
    }
  };

  useEffect(() => {
    getCourseInfo();
  }, []);

  const handleEdit = (field) => {
    setEditedField(field);
    setEditedValue(courseInfo[field]);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const updatedCourseInfo = {
        ...courseInfo,
        [editedField]: editedValue,
        departmentId: courseInfo.departmentId,
      };

      const response = await fetch(
        `http://localhost:1234/api/data/course/id/${params.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCourseInfo),
        }
      );

      if (response.ok) {
        setCourseInfo(updatedCourseInfo);
        setIsModalOpen(false);
        alert("Information Updated Successfully!");
      } else {
        console.error("Failed to save changes", response.statusText);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDeletePrerequisites = async () => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/data/course/id/${params.id}/prerequisites`,
        { method: "PUT" }
      );

      if (response.ok) {
        setCourseInfo({ ...courseInfo, prerequisites: "" });
        showNotification("Prequisites deleted successfully!");
        setIsDeleteModalOpen(false);
      } else {
        console.error("Failed to delete prerequisites");
      }
    } catch (error) {
      console.error("Error deleting prerequisites:", error);
    }
  };

  const handleAddCLO = async () => {
    if (!newCLO.trim()) {
      alert("CLO cannot be empty");
      return;
    }

    // Check for duplicate CLOs
    if (courseInfo.CLO.includes(newCLO.trim())) {
      alert("This CLO already exists");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:1234/api/data/course/${params.id}/add-clo`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clo: newCLO }),
        }
      );

      if (response.ok) {
        alert("CLO added successfully!");
        setNewCLO("");
        setAddNewCLO(false);
        getCourseInfo();
      } else {
        console.error("Failed to add CLO");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditCLO = (index) => {
    const clo = courseInfo.CLO[index];
    const updatedCLO = prompt("Edit CLO", clo);

    if (!updatedCLO) return;

    // Check for duplicate CLOs
    if (courseInfo.CLO.includes(updatedCLO.trim())) {
      alert("This CLO already exists");
      return;
    }

    const updatedCLOs = [...courseInfo.CLO];
    updatedCLOs[index] = updatedCLO;

    fetch(`http://localhost:1234/api/data/course/${params.id}/clo`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        index,
        value: updatedCLO,
        departmentId: courseInfo.departmentId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setCourseInfo({ ...courseInfo, CLO: updatedCLOs });
          alert("CLO updated successfully!");
        } else {
          console.error("Failed to update CLO");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [isDeleteModalOpen2, setIsDeleteModalOpen2] = useState(false);

  const handleDeleteCLO = async (index) => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/data/course/${params.id}/delete-clo`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ index }),
        }
      );

      if (response.ok) {
        const updatedCLOs = courseInfo.CLO.filter((_, idx) => idx !== index);
        setCourseInfo({ ...courseInfo, CLO: updatedCLOs });
        alert("CLO deleted successfully!");
        setIsDeleteModalOpenCLO(false);
      } else {
        console.error("Failed to delete CLO");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const initialAssessmentData = {
    assessmentName: "",
    assessmentType: "",
    totalMarks: "",
    questions: [],
  };

  const [assessmentData, setAssessmentData] = useState(initialAssessmentData);
  const [assessmentToDelete, setAssessmentToDelete] = useState(null);
  const [isDeleteModalOpen1, setIsDeleteModalOpen1] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssessmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...assessmentData.questions];
    updatedQuestions[index][name] = value;
    setAssessmentData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const addCLOToQuestion = (questionIndex) => {
    const updatedQuestions = [...assessmentData.questions];
    updatedQuestions[questionIndex].clos.push({ cloId: "", cloWeight: "" });
    setAssessmentData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleCLOChange = (questionIndex, cloIndex, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...assessmentData.questions];

    if (name === "cloId") {
      setSelectedCLO(value);
    }

    updatedQuestions[questionIndex].clos[cloIndex][name] = value;
    setAssessmentData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    setAssessmentData((prev) => ({
      ...prev,
      questions: [...prev.questions, { totalQuestionMarks: "", clos: [] }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if total marks exceed 100
    if (
      !exceedLimit &&
      totalAssessmentsMarks + Number(assessmentData.totalMarks) > 100
    ) {
      alert("Total assessments marks cannot exceed 100. ");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:1234/api/assessments/addAssessment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: params.id,
            newAssessment: assessmentData,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Assessment added successfully!");
        setAddNewAssessment(false);
        setAssessmentData(initialAssessmentData);
        getCourseInfo();
      } else {
        alert("Failed to add assessment: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("An error occurred while adding the assessment.");
    }
  };

  const handleEditAssessment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:1234/api/assessments/${assessmentToEdit._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(assessmentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update assessment");
      }

      const result = await response.json();
      alert("Assessment updated successfully!");
      setIsEditAssessmentModalOpen(false);
      setAssessmentData(initialAssessmentData);
      getCourseInfo();
    } catch (error) {
      console.error("Error updating assessment:", error);
      alert(error.message || "Failed to update assessment");
    }
  };
  const [departmentInfo, setDepartmentInfo] = useState(null);
  const [selectedPLO, setSelectedPLO] = useState("");

  const departmentId = courseInfo.departmentId;
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1234/api/data/department/${departmentId}`
        );
        setDepartmentInfo(res.data);
        console.log(departmentInfo);
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };

    if (courseInfo.departmentId) {
      fetchDepartment();
    }
  }, [courseInfo]);

  const handlePLOChange = (questionIndex, selectedPLO) => {
    const updatedData = { ...assessmentData };
    updatedData.questions = [...updatedData.questions]; // clone questions array
    updatedData.questions[questionIndex] = {
      ...updatedData.questions[questionIndex],
      assignedPLO: selectedPLO,
    };
    setAssessmentData(updatedData);
  };

  const handleEditQuestionInAssessment = async (
    e,
    assessmentId,
    questionId
  ) => {
    e.preventDefault();

    // Find the assessment
    const assessment = courseInfo.assessments.find(
      (a) => a._id === assessmentId
    );
    if (!assessment) {
      alert("Assessment not found");
      return;
    }

    // Calculate current total marks of other questions (excluding the one being edited)
    const currentTotalMarks = assessment.questions.reduce((sum, question) => {
      if (question._id !== questionId) {
        return sum + (Number(question.totalQuestionMarks) || 0);
      }
      return sum;
    }, 0);

    const editedQuestionMarks = Number(questionData.totalQuestionMarks) || 0;

    // Check if the edited marks would exceed assessment total marks
    if (
      currentTotalMarks + editedQuestionMarks >
      Number(assessment.totalMarks)
    ) {
      alert(
        `Cannot update question. Total marks would exceed assessment's total marks of ${assessment.totalMarks}. Current total: ${currentTotalMarks}`
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:1234/api/assessments/${assessmentId}/questions/${questionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionNumber: questionData.questionNumber,
            totalQuestionMarks: questionData.totalQuestionMarks,
            clos: questionData.clos,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update question");
      }

      const result = await response.json();
      alert("Question updated successfully!");
      setIsEditQuestionModalOpen(false);
      setQuestionData(initialQuestionData);
      getCourseInfo();
    } catch (error) {
      console.error("Error updating question:", error);
      alert(error.message || "Failed to update question");
    }
  };

  const handleDeleteAssessment = async (courseId, assessmentId) => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/assessments/deleteAssessment/${courseId}/${assessmentId}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Assessment deleted successfully!");
        setIsDeleteModalOpen1(false);
        getCourseInfo();
      } else {
        alert("Failed to delete assessment: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the assessment.");
    }
  };

  const openEditAssessmentModal = (assessment) => {
    setAssessmentToEdit(assessment);
    setAssessmentData({
      assessmentName: assessment.assessmentName,
      assessmentType: assessment.assessmentType,
      totalMarks: assessment.totalMarks,
      questions: assessment.questions,
    });
    setIsEditAssessmentModalOpen(true);
  };

  const openEditQuestionModal = (assessmentId, question) => {
    setCurrentAssessmentId(assessmentId);
    setQuestionToEdit(question);
    setQuestionData({
      questionNumber: question.questionNumber,
      totalQuestionMarks: question.totalQuestionMarks,
      clos: question.clos,
    });
    setIsEditQuestionModalOpen(true);
  };

  const calculateRemainingLimit = (cloId) => {
    let CLO1 = 0,
      CLO2 = 0,
      CLO3 = 0,
      CLO4 = 0,
      CLO5 = 0;

    courseInfo.assessments.forEach((assessment) => {
      if (assessment._id === assessmentToEdit?._id) return; // Skip the assessment being edited
      assessment.questions.forEach((question) => {
        question.clos.forEach((clo) => {
          const weight = Number(clo.cloWeight) || 0;
          if (clo.cloId === "CLO1") CLO1 += weight;
          if (clo.cloId === "CLO2") CLO2 += weight;
          if (clo.cloId === "CLO3") CLO3 += weight;
          if (clo.cloId === "CLO4") CLO4 += weight;
          if (clo.cloId === "CLO5") CLO5 += weight;
        });
      });
    });

    const totalUsed = assessmentData.questions.reduce((sum, q) => {
      return (
        sum +
        q.clos.reduce((qSum, clo) => {
          return clo.cloId === cloId ? qSum + Number(clo.cloWeight) : qSum;
        }, 0)
      );
    }, 0);

    const prevUsed =
      (cloId === "CLO1" ? CLO1 : 0) +
      (cloId === "CLO2" ? CLO2 : 0) +
      (cloId === "CLO3" ? CLO3 : 0) +
      (cloId === "CLO4" ? CLO4 : 0) +
      (cloId === "CLO5" ? CLO5 : 0);

    return 100 - (totalUsed + prevUsed);
  };

  const [students, setStudents] = useState([]);
  const [students02, setStudents02] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showModalAdd02, setShowModalAdd02] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [batches, setBatches] = useState([]);
  const [assessmentIdx, setAssessmentIdx] = useState(0);

  useEffect(() => {
    if (courseInfo?.departmentId) {
      const getBatches = async () => {
        try {
          const response = await fetch(
            `http://localhost:1234/api/batches/all-batches/${courseInfo.departmentId}`,
            { method: "GET" }
          );

          if (response.ok) {
            const data = await response.json();
            setBatches(data);
          }
        } catch (error) {
          console.error(`Services error: ${error}`);
        }
      };

      getBatches();
    }
  }, [courseInfo?.departmentId]);

  const fetchStudents = async (batchName, section) => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/students/fetchByBatch?batchName=${batchName}&section=${section}`
      );
      if (response.ok) {
        const data = await response.json();
        setStudents02(data.students);
      } else {
        const error = await response.json();
        console.error(error.message);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
    setSelectedSection("");
    setStudents([]);
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  const handleShowStudents = () => {
    const batch = batches.find((b) => b.batchName === selectedBatch);
    if (batch) {
      setStudents(batch.sections[selectedSection] || []);
      fetchStudents(selectedBatch, selectedSection);
    }
  };

  const handleStudentSelection = (studentId, isChecked) => {
    setSelectedStudents((prev) =>
      isChecked ? [...prev, studentId] : prev.filter((id) => id !== studentId)
    );
  };

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isSuccess: false,
  });

  // Show notification
  const showNotification = (message, isSuccess) => {
    setNotification({ show: true, message, isSuccess });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  const addCourseIdInStudents = async () => {
    if (!capturedCourseId) {
      alert("Please select a course first");
      return;
    }

    if (selectedStudents.length === 0) {
      showNotification("Please select at least one student", false);

      return;
    }

    try {
      const results = await Promise.allSettled(
        selectedStudents.map((studentId) =>
          fetch(`http://localhost:1234/api/students/${studentId}/add-course`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId: capturedCourseId }),
          }).then((res) => (res.ok ? res.json() : Promise.reject(res)))
        )
      );

      const successful = results.filter((r) => r.status === "fulfilled");
      const failed = results.filter((r) => r.status === "rejected");

      if (failed.length > 0) {
        showNotification(
          `${successful.length} students enrolled, ${failed.length} failed`,
          false
        );
      } else {
        showNotification("All students enrolled successfully!", true);
      }

      setSelectedStudents([]);
      fetchStudents();
    } catch (error) {
      console.error("Unexpected error:", error);
      showNotification("An unexpected error occurred", false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
                notification.isSuccess ? "bg-green-500" : "bg-red-500"
              } text-white`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-[80px] mb-6 w-full">
          <div className="flex flex-col justify-start   md:flex-row md:justify-between xs:flex-col xs:justify-start sm:flex-row sm:justify-between lg:flex-row lg:justify-between xl:flex-row xl:justify-between   items-start gap-y-3 xs:gap-y-3 sm:gap-y-0 md:gap-y-0 lg:gap-y-0 xl:gap-y-0 xxl:gap-y-0">
            <h2 className="text-2xl text-[#1F2C73] font-bold mb-2">
              Course Details
            </h2>
            <div className=" flex flex-col xs:flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row xxl:flex-row space-x-0 xs:space-x-0 sm:space-x-0 md:space-x-3 lg:space-x-3 xl:space-x-3 xxl:space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#1F2C73] text-white px-4 py-2 mb-3 md:mb-6 rounded-md"
                onClick={() =>
                  navigate(
                    `/course/enrolled-students/${courseInfo.courseCode}/${courseInfo._id}/${courseInfo.instructorId}`
                  )
                }
              >
                Show Enrolled Students
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#1F2C73] text-white px-4 py-2 mb-6 rounded-md"
                onClick={() => setShowModalAdd02(true)}
              >
                Enroll Students
              </motion.button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-0 xs:grid-cols-0 sm:grid-cols-0 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 xxl:grid-cols-2 gap-y-6 gap-x-8">
              {[
                { label: "Course Code", key: "courseCode" },
                { label: "Course Name", key: "courseName" },
                { label: "Department Name", key: "departmentName" },
                { label: "Course Type", key: "courseType" },
                { label: "Credit Hours", key: "creditHours" },
                { label: "Starting Date", key: "startingDate", type: "date" },
                { label: "Ending Date", key: "endingDate", type: "date" },
                { label: "Prerequisites", key: "prerequisites" },
              ].map((field, index) => (
                <div
                  key={index}
                  className="flex flex-col xs:flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row xxl:flex-row gap-2 xs:gap-2 sm:gap-2  md:gap-4 lg:gap-4 xl:gap-4 xxl:gap-4"
                >
                  <label className="font-semibold">{field.label}:</label>
                  <div className="flex flex-row">
                    <input
                      type={field.type || "text"}
                      value={courseInfo[field.key] || ""}
                      readOnly
                      className="border p-1 rounded w-full bg-gray-100"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-green-500 hover:bg-green-50 rounded-full"
                      onClick={() => handleEdit(field.key)}
                    >
                      <Edit size={20} />
                    </motion.button>

                    {field.key === "prerequisites" && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-red-500 hover:bg-green-50 rounded-full"
                        onClick={() => setIsDeleteModalOpen(true)}
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex flex-col justify-start   md:flex-row md:justify-between xs:flex-col xs:justify-start sm:flex-row sm:justify-between lg:flex-row lg:justify-between xl:flex-row xl:justify-between   items-start gap-y-3 xs:gap-y-3 sm:gap-y-0 md:gap-y-0 lg:gap-y-0 xl:gap-y-0 xxl:gap-y-0">
              <h2 className="text-xl font-bold text-[#1F2C73]">
                Course Learning Outcomes
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#1F2C73] text-white px-4 py-2 mb-6 rounded-md"
                onClick={() => setAddNewCLO(true)}
              >
                Add New CLO
              </motion.button>
            </div>
            <div className="mb-0 space-y-6">
              {courseInfo.CLO && courseInfo.CLO.length > 0 ? (
                courseInfo.CLO.map((outcome, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="text-sm text-gray-500">
                        Course Learning Outcome {index + 1}
                      </div>
                      <div>{outcome}</div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-0 text-green-500 hover:bg-blue-50 rounded-full"
                      onClick={() => handleEditCLO(index)}
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-0 text-red-600 hover:bg-red-50 rounded-full"
                      onClick={() => {
                        setIsDeleteModalOpenCLO(true);
                        setSelectedCLO(index);
                      }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No Course Learning Outcomes added yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex flex-col justify-start   md:flex-row md:justify-between xs:flex-col xs:justify-start sm:flex-row sm:justify-between lg:flex-row lg:justify-between xl:flex-row xl:justify-between   items-start gap-y-3 xs:gap-y-3 sm:gap-y-0 md:gap-y-0 lg:gap-y-0 xl:gap-y-0 xxl:gap-y-0 ">
              <h2 className="text-xl font-bold text-[#1F2C73] ">
                Assessments (Total: {totalAssessmentsMarks})
              </h2>
              <div className="flex items-center gap-4">
                {/* <label className="flex items-center space-x-2">
                <span>Exceed Limit</span>
                <input
                  type="checkbox"
                  checked={exceedLimit}
                  onChange={() => setExceedLimit(!exceedLimit)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </label> */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#1F2C73] text-white px-4 py-2 mb-6 rounded-md"
                  onClick={() => {
                    setAddNewAssessment(true);
                  }}
                >
                  Add New Assessment
                </motion.button>
              </div>
            </div>
            <div className="mb-6 space-y-6">
              {courseInfo.assessments && courseInfo.assessments.length > 0 ? (
                courseInfo.assessments.map((assessment, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg shadow-md space-y-2 relative"
                  >
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => openEditAssessmentModal(assessment)}
                        className="text-green-600"
                        title="Edit Assessment"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setAssessmentToDelete(assessment._id);
                          setIsDeleteModalOpen1(true);
                        }}
                        className="text-red-600"
                        title="Delete Assessment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div>
                      <div className="text-lg py-2 font-medium text-gray-800 mt-6">
                        Assessment Name: {assessment.assessmentName}
                      </div>
                      <div className="flex gap-x-3 xs:gap-x-2 sm:gap-x-2  md:gap-x-10 lg:gap-x-10 xl:gap-x-10 xxl:gap-x-10 text-sm pb-2 text-gray-500">
                        <p>Type: {assessment.assessmentType}</p>
                        <p>
                          Due Date:{" "}
                          {new Date(assessment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-x-3 xs:gap-x-2 sm:gap-x-2  md:gap-x-10 lg:gap-x-10 xl:gap-x-10 xxl:gap-x-10 text-sm pb-5 text-gray-500">
                        <p>Total Marks: {assessment.totalMarks}</p>
                        <p>
                          Questions Total:{" "}
                          {calculateTotalQuestionMarks(assessment)}/
                          {assessment.totalMarks}
                        </p>
                      </div>

                      <div className="space-y-2 flex space-x-5">
                        {assessment.questions &&
                        assessment.questions.length > 0 ? (
                          assessment.questions.map((question, qIndex) => (
                            <div
                              key={qIndex}
                              className="p-7 bg-white border rounded-lg relative"
                            >
                              <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                  onClick={() =>
                                    openEditQuestionModal(
                                      assessment._id,
                                      question
                                    )
                                  }
                                  className="text-green-600"
                                  title="Edit Question"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => setIsDeleteModalOpen2(true)}
                                  className="text-red-600"
                                  title="Delete Question"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>

                              <h4 className="font-semibold text-xl text-gray-700">
                                Question {qIndex + 1}:
                              </h4>
                              <p className="text-gray-500">
                                Marks: {question.totalQuestionMarks}
                              </p>

                              {question.clos && question.clos.length > 0 ? (
                                <ul className="list-disc list-inside text-gray-500">
                                  <span>
                                    Assigned PLOs: {question.assignedPLO}
                                  </span>
                                  <p>CLOs:</p>

                                  {question.clos.map((CLO, cloIndex) => (
                                    <li key={cloIndex}>
                                      CLO {CLO.cloId}: Weight {CLO.cloWeight}%
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No CLOs available</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p>No questions available for this assessment.</p>
                        )}
                      </div>

                      <button
                        type="button"
                        className="bg-[#1F2C73] text-white py-2 px-4 rounded mt-4"
                        onClick={() => {
                          setIsModalOpen02(true);
                          setSelectedAssessmentId(assessment._id);
                        }}
                      >
                        Add Another Question
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No assessments available for this course.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative bg-white w-[90%] max-w-lg rounded-lg shadow-lg">
              <div className="px-6 py-4 flex flex-row justify-between ">
                <h3 className="text-xl font-semibold text-gray-800">
                  Edit {editedField}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                  className="bg-red-500 text-white py-0.5 px-2 cursor-pointer text-sm rounded-sm"
                >
                  X
                </button>
              </div>
              <div className="px-6 pb-4">
                <label className="block text-sm  text-gray-600 mb-2">
                  {editedField}:
                </label>
                <input
                  type="text"
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter updated ${editedField}`}
                />
              </div>
              <div className="flex justify-end w-full gap-4 px-6 pb-6 rounded-b-lg">
                <button
                  className="bg-black w-full text-white px-4 py-2 rounded-lg "
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative bg-white w-[90%] max-w-md rounded-lg shadow-lg">
              <div className="px-6 py-4 flex flex-row justify-between ">
                <h3 className="text-xl font-semibold text-gray-800">
                  Delete Prerequisite
                </h3>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                  }}
                  className="bg-red-500 text-white py-0.5 px-2 cursor-pointer text-sm rounded-sm"
                >
                  X
                </button>
              </div>
              <div className="px-6 py-2">
                <p className="text-gray-600">
                  Are you sure you want to delete this prerequisite? This action
                  cannot be undone.
                </p>
              </div>
              <div className="flex justify-end w-full gap-4 px-6 py-4 rounded-b-lg">
                <button
                  className="bg-black w-full text-white px-4 py-2 rounded-lg "
                  onClick={handleDeletePrerequisites}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpenCLO && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative bg-white w-[90%] max-w-md rounded-lg shadow-lg ">
              <div className="px-6 py-4 flex flex-row justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                  Delete CLO
                </h3>
                <button
                  onClick={() => {
                    setIsDeleteModalOpenCLO(false);
                  }}
                  className="bg-red-500 text-white py-0.5 px-2 cursor-pointer text-sm rounded-sm"
                >
                  X
                </button>
              </div>
              <div className="px-6 py-2">
                <p className="text-gray-600">
                  Are you sure you want to delete this CLO? This action cannot
                  be undone.
                </p>
              </div>
              <div className="flex justify-end gap-4 px-6 py-4 rounded-b-lg w-full">
                <button
                  className="bg-black w-full text-white px-4 py-2 rounded-lg "
                  onClick={() => handleDeleteCLO(selectedCLO)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {addNewCLO && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white px-6 pt-4 rounded-lg w-96 shadow relative">
              <div className="flex flex-row justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                  Add New CLO
                </h3>
                <button
                  onClick={() => setAddNewCLO(false)}
                  className="bg-red-500 text-white py-0.5 px-2 cursor-pointer text-sm rounded-sm"
                >
                  X
                </button>
              </div>
              <input
                type="text"
                value={newCLO}
                onChange={(e) => setNewCLO(e.target.value)}
                placeholder="Enter new CLO"
                className="w-full mb-4 mt-4 p-2 border rounded"
              />
              <button
                onClick={handleAddCLO}
                className="w-full px-4 py-2 mb-6 bg-black text-white rounded"
              >
                Add CLO
              </button>
            </div>
          </div>
        )}

        {isModalOpen02 && selectedAssessmentId && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div
              className="bg-white p-6 rounded-2xl shadow-2xl w-80 md:w-3/4 lg:w-1/2 relative overflow-y-auto"
              style={{ maxHeight: "90vh" }}
            >
              <div className="flex flex-row justify-between  mb-4">
                <h2 className="text-xl font-bold text-gray-900 text-center">
                  Add a New Question
                </h2>
                <button
                  onClick={() => setIsModalOpen02(false)}
                  className="bg-red-500 text-white py-0.5 px-2 cursor-pointer text-sm rounded-sm"
                >
                  X
                </button>
              </div>

              <form
                onSubmit={(e) =>
                  handleAddQuestiontoAssessment(e, selectedAssessmentId)
                }
                className="space-y-4"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Question Number:
                  </label>
                  <input
                    type="text"
                    name="questionNumber"
                    placeholder="Enter Question Number"
                    className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={questionData.questionNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Total Marks:
                  </label>
                  <input
                    type="number"
                    name="totalQuestionMarks"
                    placeholder="Enter Total Marks"
                    className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={questionData.totalQuestionMarks}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Threshold:
                  </label>
                  <input
                    type="number"
                    name="totalQuestionThreshold"
                    placeholder="Enter Threshold"
                    className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={questionData.totalQuestionThreshold}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Assigned PLO:
                </label>
                <input
                  type="text"
                  name="totalQuestionPLO"
                  placeholder="Enter Assigned PLO"
                  className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={questionData.totalQuestionPLO}
                  onChange={handleInputChange}
                  required
                />
              </div> */}
                <div className="mb-2">
                  <label className="block text-gray-700 font-medium">
                    Assigned PLO:
                  </label>
                  <select
                    value={questionData.totalQuestionPLO || ""}
                    onChange={(e) =>
                      setQuestionData({
                        ...questionData,
                        totalQuestionPLO: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                  >
                    <option value="">Select PLO</option>
                    {departmentInfo.PLO.map((plo, index) => {
                      const value = `PLO${index + 1}`;
                      return (
                        <option key={index} value={value} className="py-2 px-3">
                          {plo}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <h3 className="text-gray-800 font-semibold mb-2">CLOs</h3>
                  {questionData.clos.map((clo, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="block text-gray-700">
                          Select CLO:
                        </label>
                        <select
                          value={clo.cloId}
                          onChange={(e) =>
                            handleCLOChangetoAssessment(
                              index,
                              "cloId",
                              e.target.value
                            )
                          }
                          className="mt-1 p-2 border rounded w-full"
                          required
                        >
                          <option value="">Select CLO</option>
                          {courseInfo.CLO.map((clo, cloIdx) => (
                            <option key={cloIdx} value={`CLO${cloIdx + 1}`}>
                              {clo}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700">Weight:</label>
                        <input
                          type="number"
                          placeholder="CLO Weight"
                          value={clo.cloWeight}
                          onChange={(e) =>
                            handleCLOChangetoAssessment(
                              index,
                              "cloWeight",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                          required
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addCLOField}
                    className="bg-black text-white font-semibold py-2 px-4 mt-3 rounded-lg w-full transition-all"
                  >
                    Add CLO
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white font-bold py-3 rounded-lg transition-all"
                >
                  Add Question
                </button>
              </form>
            </div>
          </div>
        )}

        {isEditQuestionModalOpen && questionToEdit && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div
              className="bg-white p-6 rounded-2xl shadow-2xl w-80 md:w-3/4 lg:w-1/2 relative overflow-y-auto"
              style={{ maxHeight: "90vh" }}
            >
              <div className="flex flex-row justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Question
                </h2>
                <button
                  onClick={() => setIsEditQuestionModalOpen(false)}
                  className="bg-red-500 text-white py-0.5 px-2 cursor-pointer text-sm rounded-sm"
                >
                  X
                </button>
              </div>

              <form
                onSubmit={(e) =>
                  handleEditQuestionInAssessment(
                    e,
                    currentAssessmentId,
                    questionToEdit._id
                  )
                }
                className="space-y-4"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Question Number:
                  </label>
                  <input
                    type="text"
                    name="questionNumber"
                    placeholder="Enter Question Number"
                    className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={questionData.questionNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Total Marks:
                  </label>
                  <input
                    type="number"
                    name="totalQuestionMarks"
                    placeholder="Enter Total Marks"
                    className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={questionData.totalQuestionMarks}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <h3 className="text-gray-800 font-semibold mb-2">CLOs</h3>
                  {questionData.clos.map((clo, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="block text-gray-700">
                          Select CLO:
                        </label>
                        <select
                          value={clo.cloId}
                          onChange={(e) =>
                            handleCLOChangetoAssessment(
                              index,
                              "cloId",
                              e.target.value
                            )
                          }
                          className="mt-1 px-2 py-3 border rounded w-full"
                          required
                        >
                          <option value="">Select CLO</option>
                          {courseInfo.CLO.map((clo, cloIdx) => (
                            <option key={cloIdx} value={`CLO${cloIdx + 1}`}>
                              {clo}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700">Weight:</label>
                        <input
                          type="number"
                          placeholder="CLO Weight"
                          value={clo.cloWeight}
                          onChange={(e) =>
                            handleCLOChangetoAssessment(
                              index,
                              "cloWeight",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                          required
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addCLOField}
                    className="bg-black mt-2 text-white font-semibold py-2 px-4 rounded-lg w-full transition-all"
                  >
                    Add CLO
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white font-bold py-2 rounded-lg mt-0 transition-all"
                >
                  Update Question
                </button>
              </form>
            </div>
          </div>
        )}

        {isDeleteModalOpen1 && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white px-6 py-4 rounded-lg shadow-lg w-80 text-center">
              <div className="flex flex-row justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                  Delete the assessment
                </h2>
                <button
                  onClick={() => setIsDeleteModalOpen1(false)}
                  className="bg-red-500 text-white py-0.5 px-2 cursor-pointer text-sm rounded-sm"
                >
                  X
                </button>
              </div>
              <p className="text-gray-600 mt-5">
                Are you sure you really want to delete this assessment? This
                action cannot be undone.
              </p>
              <div className="mt-4 flex justify-center space-x-4 w-full">
                <button
                  onClick={() => {
                    handleDeleteAssessment(courseInfo._id, assessmentToDelete);
                  }}
                  className="bg-black w-full text-white px-4 py-2 rounded-md "
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {addNewAssessment && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-11/12 lg:w-2/3 relative overflow-y-auto "
              style={{ maxHeight: "90vh" }}
            >
              <div className="flex flex-row justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Assessment for {courseInfo.courseName} (
                  {courseInfo.courseCode})
                </h2>
                <button
                  onClick={() => {
                    setAddNewAssessment(false);
                  }}
                  className="bg-red-500 text-white py-0.5 px-2 cursor-pointer text-sm rounded-sm"
                >
                  X
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium">
                      Assessment Name:
                    </label>
                    <input
                      type="text"
                      name="assessmentName"
                      value={assessmentData.assessmentName}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded w-full"
                      placeholder="Enter Assessment Name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">
                      Assessment Type:
                    </label>
                    <select
                      name="assessmentType"
                      value={assessmentData.assessmentType}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded w-full"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Exam">Exam</option>
                      <option value="Quiz">Quiz</option>
                      <option value="Assignment">Assignment</option>
                      <option value="Project">Project</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">
                      Total Marks:
                    </label>
                    <input
                      type="number"
                      name="totalMarks"
                      value={assessmentData.totalMarks}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded w-full"
                      placeholder="Enter Total Marks"
                      required
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-800 font-semibold mb-2">
                    Questions
                  </h3>
                  {assessmentData.questions.map((question, questionIndex) => (
                    <div
                      key={questionIndex}
                      className="border border-gray-300 p-4 rounded-md mb-4"
                    >
                      <div className="mb-2">
                        <label className="block text-gray-700 font-medium">
                          Question #{questionIndex + 1} Marks:
                        </label>
                        <input
                          type="number"
                          name="totalQuestionMarks"
                          min={0}
                          max={assessmentData.totalMarks}
                          value={question.totalQuestionMarks}
                          onChange={(e) =>
                            handleQuestionChange(questionIndex, e)
                          }
                          className="mt-1 p-2 border rounded w-full"
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-gray-700 font-medium">
                          Threshold: (in %)
                        </label>
                        <input
                          type="number"
                          name="totalQuestionThreshold"
                          value={question.threshold}
                          min={0}
                          max={100}
                          onChange={(e) =>
                            handleQuestionChange(questionIndex, e)
                          }
                          className="mt-1 p-2 border rounded w-full"
                          required
                        />
                      </div>

                      <div className="mb-2">
                        <label className="block text-gray-700 font-medium">
                          Assigned PLO:
                        </label>
                        <select
                          value={question.assignedPLO || ""}
                          onChange={(e) =>
                            handlePLOChange(
                              // assessmentData._id,
                              questionIndex,
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-2"
                        >
                          <option value="">Select PLO</option>
                          {departmentInfo.PLO.map((plo, index) => {
                            const value = `PLO${index + 1}`;
                            return (
                              <option key={index} value={value}>
                                {plo}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <h4 className="text-gray-800 font-semibold mb-2">CLOs</h4>
                      {question.clos.map((CLO, CLOIndex) => {
                        const remainingLimit = calculateRemainingLimit(
                          CLO.cloId
                        );
                        return (
                          <div
                            key={CLOIndex}
                            className="grid grid-cols-2 gap-4 mb-2"
                          >
                            <div>
                              <label className="block text-gray-700">
                                Select CLO:
                              </label>
                              <select
                                name="cloId"
                                value={CLO.cloId}
                                onChange={(e) =>
                                  handleCLOChange(questionIndex, CLOIndex, e)
                                }
                                className="mt-1 p-2 border rounded w-full"
                                required
                              >
                                <option value="">Select CLO</option>
                                {courseInfo.CLO.map((clo, cloIdx) => {
                                  const cloId = `CLO${cloIdx + 1}`;
                                  const cloRemainingLimit =
                                    calculateRemainingLimit(cloId);
                                  const isDisabled = cloRemainingLimit <= 0;
                                  return (
                                    <option
                                      key={cloIdx}
                                      value={cloId}
                                      disabled={isDisabled}
                                    >
                                      {clo} ({cloRemainingLimit}% remaining)
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            <div>
                              <label className="block text-gray-700">
                                Weight:
                              </label>
                              <input
                                type="number"
                                name="cloWeight"
                                value={CLO.cloWeight}
                                onChange={(e) => {
                                  let inputValue = Number(e.target.value);
                                  const currentRemaining =
                                    calculateRemainingLimit(CLO.cloId);

                                  if (
                                    inputValue >
                                    currentRemaining + Number(CLO.cloWeight)
                                  ) {
                                    inputValue =
                                      currentRemaining + Number(CLO.cloWeight);
                                    alert(
                                      `Maximum allowed value is ${
                                        currentRemaining + Number(CLO.cloWeight)
                                      }`
                                    );
                                  }

                                  handleCLOChange(questionIndex, CLOIndex, {
                                    target: {
                                      name: "cloWeight",
                                      value: inputValue,
                                    },
                                  });
                                }}
                                className="mt-1 p-2 border rounded w-full"
                                max={
                                  calculateRemainingLimit(CLO.cloId) +
                                  Number(CLO.cloWeight)
                                }
                                min="0"
                                required
                              />
                            </div>
                          </div>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => addCLOToQuestion(questionIndex)}
                        className="bg-black text-white py-1 px-3 rounded mt-2"
                        disabled={
                          !courseInfo.CLO.some((_, cloIdx) => {
                            const cloId = `CLO${cloIdx + 1}`;
                            return calculateRemainingLimit(cloId) > 0;
                          })
                        }
                      >
                        Add CLO
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="bg-black text-white py-2 px-4 rounded"
                  >
                    Add Question
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded mt-4"
                >
                  Submit Assessment
                </button>
              </form>
            </div>
          </div>
        )}

        {isEditAssessmentModalOpen && assessmentToEdit && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-11/12 lg:w-2/3 relative overflow-y-auto"
              style={{ maxHeight: "90vh" }}
            >
              <div className="flex flex-row justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Assessment: {assessmentToEdit.assessmentName}
                </h2>
                <button
                  onClick={() => setIsEditAssessmentModalOpen(false)}
                  className="bg-red-500 text-white py-0.5 px-2 cursor-pointer text-sm rounded-sm"
                >
                  X
                </button>
              </div>

              <form onSubmit={handleEditAssessment} className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium">
                      Assessment Name:
                    </label>
                    <input
                      type="text"
                      name="assessmentName"
                      value={assessmentData.assessmentName}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded w-full"
                      placeholder="Enter Assessment Name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">
                      Assessment Type:
                    </label>
                    <select
                      name="assessmentType"
                      value={assessmentData.assessmentType}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded w-full"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Exam">Exam</option>
                      <option value="Quiz">Quiz</option>
                      <option value="Assignment">Assignment</option>
                      <option value="Project">Project</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">
                      Total Marks:
                    </label>
                    <input
                      type="number"
                      name="totalMarks"
                      value={assessmentData.totalMarks}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded w-full"
                      placeholder="Enter Total Marks"
                      required
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-800 font-semibold mb-2">
                    Questions
                  </h3>
                  {assessmentData.questions.map((question, questionIndex) => (
                    <div
                      key={questionIndex}
                      className="border border-gray-300 p-4 rounded-md mb-4"
                    >
                      <div className="mb-2">
                        <label className="block text-gray-700 font-medium">
                          Question #{questionIndex + 1} Marks:
                        </label>
                        <input
                          type="number"
                          name="totalQuestionMarks"
                          value={question.totalQuestionMarks}
                          onChange={(e) =>
                            handleQuestionChange(questionIndex, e)
                          }
                          className="mt-1 p-2 border rounded w-full"
                          required
                        />
                      </div>

                      <h4 className="text-gray-800 font-semibold mb-2">CLOs</h4>
                      {question.clos.map((CLO, CLOIndex) => {
                        const remainingLimit = calculateRemainingLimit(
                          CLO.cloId
                        );
                        return (
                          <div
                            key={CLOIndex}
                            className="grid grid-cols-2 gap-4 mb-2"
                          >
                            <div>
                              <label className="block text-gray-700">
                                Select CLO:
                              </label>
                              <select
                                name="cloId"
                                value={CLO.cloId}
                                onChange={(e) =>
                                  handleCLOChange(questionIndex, CLOIndex, e)
                                }
                                className="mt-1 p-2 border rounded w-full"
                                required
                              >
                                <option value="">Select CLO</option>
                                {courseInfo.CLO.map((clo, cloIdx) => {
                                  const cloId = `CLO${cloIdx + 1}`;
                                  const cloRemainingLimit =
                                    calculateRemainingLimit(cloId);
                                  const isDisabled = cloRemainingLimit <= 0;
                                  return (
                                    <option
                                      key={cloIdx}
                                      value={cloId}
                                      disabled={isDisabled}
                                    >
                                      {clo} ({cloRemainingLimit}% remaining)
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            <div>
                              <label className="block text-gray-700">
                                Weight:
                              </label>
                              <input
                                type="number"
                                name="cloWeight"
                                value={CLO.cloWeight}
                                onChange={(e) => {
                                  let inputValue = Number(e.target.value);
                                  const currentRemaining =
                                    calculateRemainingLimit(CLO.cloId);

                                  if (
                                    inputValue >
                                    currentRemaining + Number(CLO.cloWeight)
                                  ) {
                                    inputValue =
                                      currentRemaining + Number(CLO.cloWeight);
                                    alert(
                                      `Maximum allowed value is ${
                                        currentRemaining + Number(CLO.cloWeight)
                                      }`
                                    );
                                  }

                                  handleCLOChange(questionIndex, CLOIndex, {
                                    target: {
                                      name: "cloWeight",
                                      value: inputValue,
                                    },
                                  });
                                }}
                                className="mt-1 p-2 border rounded w-full"
                                max={
                                  calculateRemainingLimit(CLO.cloId) +
                                  Number(CLO.cloWeight)
                                }
                                min="0"
                                required
                              />
                            </div>
                          </div>
                        );
                      })}
                      {/* <button
                      type="button"
                      onClick={() => addCLOToQuestion(questionIndex)}
                      className="bg-[#1F2C73] text-white py-1 px-3 rounded mt-2"
                      disabled={
                        !courseInfo.CLO.some((_, cloIdx) => {
                          const cloId = `CLO${cloIdx + 1}`;
                          return calculateRemainingLimit(cloId) > 0;
                        })
                      }
                    >
                      Add CLO
                    </button> */}
                    </div>
                  ))}

                  {/* <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-[#1F2C73] text-white py-2 px-4 rounded"
                >
                  Add Question
                </button> */}
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded "
                >
                  Update Assessment
                </button>
              </form>
            </div>
          </div>
        )}

        {showModalAdd02 && (
          <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50  z-50">
            <div className="bg-white px-6 pt-4 pb-6 rounded-lg shadow-lg w-full md:w-[40%] mx-5">
              <div className="flex flex-row justify-between space-x-12 mb-6">
                <h2 className="font-semibold text-black text-xl">
                  Enroll Student
                </h2>
                <button
                  onClick={() => {
                    setShowModalAdd02(false);
                  }}
                  className="bg-red-500 text-white py-0.5 px-2 cursor-pointer text-sm rounded-sm"
                >
                  X
                </button>
              </div>
              <label className="block text-gray-700 my-4">
                Select Batch & Section:
              </label>

              <select
                className="mt-1 p-2 border rounded w-full"
                value={selectedBatch}
                onChange={handleBatchChange}
                required
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch.batchName}>
                    {batch.batchName}
                  </option>
                ))}
              </select>

              {selectedBatch && (
                <select
                  className="mt-2 p-2 border rounded w-full"
                  value={selectedSection}
                  onChange={handleSectionChange}
                  required
                >
                  <option value="">Select Section</option>
                  {Object.keys(
                    batches.find((batch) => batch.batchName === selectedBatch)
                      ?.sections || {}
                  ).map((sectionName, index) => (
                    <option key={index} value={sectionName}>
                      {sectionName}
                    </option>
                  ))}
                </select>
              )}

              {selectedBatch && selectedSection && (
                <button
                  className="mt-4 p-2 bg-black w-full text-white rounded"
                  onClick={handleShowStudents}
                >
                  Show Students
                </button>
              )}

              {students.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold">
                    Students in {selectedBatch} - {selectedSection}:
                  </h3>
                  <ul>
                    {students02.map((student, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {student.firstName} {student.lastName} (
                          {student.studentId} {student.studentEmail})
                        </span>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student._id)}
                          onChange={(e) =>
                            handleStudentSelection(
                              student._id,
                              e.target.checked
                            )
                          }
                        />
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={addCourseIdInStudents}
                    className="bg-black w-full text-white px-4 py-2 rounded mt-4"
                  >
                    Add Course to Selected Students
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {isDeleteModalOpen2 && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white px-6 py-4 rounded-lg shadow-lg w-80 text-center">
              <div className="flex flex-row justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                  Delete the question
                </h2>
                <button
                  onClick={() => setIsDeleteModalOpen2(false)}
                  className="bg-red-500 text-white py-0.5 px-2 cursor-pointer text-sm rounded-sm"
                >
                  X
                </button>
              </div>
              <p className="text-gray-600 mt-5">
                Are you sure you really want to delete this question? This
                action cannot be undone.
              </p>
              <div className="mt-4 flex justify-center space-x-4 w-full">
                <button
                  onClick={() =>
                    handleDeleteQuestionFromAssessment(
                      assessment._id,
                      question._id
                    )
                  }
                  className="bg-black w-full text-white px-4 py-2 rounded-md "
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
