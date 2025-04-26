import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: "Helvetica",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
});

Font.register({
  family: "Helvetica-Bold",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
});

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.3,
    color: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  logoLeft: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  logoRight: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "Helvetica-Bold",
  },
  studentInfo: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  table: {
    width: "100%",
    border: "1px solid #000",
    marginBottom: 15,
    borderCollapse: "collapse",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
  },
  tableHeader: {
    backgroundColor: "#D3D3D3",
    fontFamily: "Helvetica-Bold",
  },
  tableCell: {
    padding: 5,
    borderRight: "1px solid #000",
    flex: 1,
    textAlign: "center",
    fontSize: 8,
  },
  lastCell: {
    padding: 5,
    flex: 1,
    textAlign: "center",
    fontSize: 8,
  },
  footer: {
    marginTop: 10,
    fontSize: 8,
    textAlign: "center",
    color: "#000",
  },
  boldText: {
    fontFamily: "Helvetica-Bold",
  },
  courseSeparator: {
    marginTop: 15,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "1px solid #000",
    fontFamily: "Helvetica-Bold",
  },
  assessmentSeparator: {
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
});

// Helper function to get PLO achievement status - FINAL CORRECTED VERSION
const getPLOAchievementStatus = (student, ploNumber) => {
  if (!student.achievedPLOs || !Array.isArray(student.achievedPLOs)) {
    return "Not Available";
  }

  // Extract the PLO number (e.g., "PLO5" -> 5)
  const ploMatch = ploNumber.match(/PLO(\d+)/i);
  if (!ploMatch) return "Not Available";

  const ploNum = parseInt(ploMatch[1]);
  const ploIndex = ploNum - 1; // PLO1 = index 0, PLO5 = index 4, etc.

  // Check if index is valid
  if (ploIndex >= 0 && ploIndex < student.achievedPLOs.length) {
    return student.achievedPLOs[ploIndex] === 1 ? "Achieved" : "Not Achieved";
  }

  return "Not Available";
};

// Assessment Table Component
const AssessmentTable = ({ assessment, student, showAssessmentName }) => {
  const calculateCLOAchievement = (question) => {
    return question.clos
      .map((clo) => {
        const percentage =
          (question.obtainedMarks / question.totalQuestionMarks) *
          clo.cloWeight;
        return `${clo.cloId}: ${Math.round(percentage)}%`;
      })
      .join(", ");
  };

  return (
    <View style={styles.table}>
      {showAssessmentName && (
        <Text style={styles.assessmentSeparator}>
          Assessment: {assessment.assessmentName} ({assessment.assessmentType})
        </Text>
      )}

      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.tableCell, { flex: 0.6 }]}>Question</Text>
        <Text style={styles.tableCell}>CLO Assigned</Text>
        <Text style={styles.tableCell}>CLO Achieved</Text>
        <Text style={[styles.tableCell, { flex: 0.6 }]}>Marks Assigned</Text>
        <Text style={[styles.tableCell, { flex: 0.6 }]}>Threshold</Text>
        <Text style={[styles.tableCell, { flex: 0.6 }]}>Marks Achieved</Text>
        <Text style={[styles.tableCell, { flex: 0.6 }]}>PLO Assigned</Text>
        <Text style={[styles.lastCell, { flex: 0.8 }]}>PLO Status</Text>
      </View>

      {assessment.questions?.map((question, index) => {
        const assignedPLO = question.assignedPLO || `PLO${(index % 10) + 1}`;
        const ploStatus = getPLOAchievementStatus(student, assignedPLO);

        return (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 0.6 }]}>Q{index + 1}</Text>
            <Text style={styles.tableCell}>
              {question.clos
                .map((clo) => `${clo.cloId}: ${clo.cloWeight}%`)
                .join(", ")}
            </Text>
            <Text style={styles.tableCell}>
              {calculateCLOAchievement(question)}
            </Text>
            <Text style={[styles.tableCell, { flex: 0.6 }]}>
              {question.totalQuestionMarks}
            </Text>
            <Text style={[styles.tableCell, { flex: 0.6 }]}>
              {question.threshold}%
            </Text>
            <Text style={[styles.tableCell, { flex: 0.6 }]}>
              {question.obtainedMarks}
            </Text>
            <Text style={[styles.tableCell, { flex: 0.6 }]}>{assignedPLO}</Text>
            <Text
              style={[
                styles.lastCell,
                ploStatus === "Achieved"
                  ? { color: "green", fontFamily: "Helvetica-Bold", flex: 0.8 }
                  : { color: "red", fontFamily: "Helvetica-Bold", flex: 0.8 },
              ]}
            >
              {ploStatus}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

// All Courses Report Component
const AllCoursesReport = ({ student }) => {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Header with student info (only on first page) */}
        <View style={styles.header}>
          <Image
            style={styles.logoLeft}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5NxN6cDfvZhaFGjkftO-NzIEofkdi_bSGUw&s"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Student OBE Report</Text>
            <Text style={styles.studentInfo}>
              {student.firstName} {student.lastName} ({student.studentId}) -{" "}
              {student.studentSection} - {student.studentBatch}
            </Text>
          </View>
          <Image
            style={styles.logoRight}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsCNIBPctM5RsLsEBsuMV8HhQZO_KSkysM_g&s"
          />
        </View>

        {/* First course content */}
        {student.courses.length > 0 && (
          <View>
            <Text style={styles.courseSeparator}>
              Course: {student.courses[0].courseId.courseCode} -{" "}
              {student.courses[0].courseId.courseName}
            </Text>

            {student.courses[0].assessments.map(
              (assessment, aIndex) =>
                assessment.questions &&
                assessment.questions.length > 0 && (
                  <AssessmentTable
                    key={aIndex}
                    assessment={assessment}
                    student={student}
                    showAssessmentName={true}
                  />
                )
            )}
          </View>
        )}

        <View style={styles.footer}>
          <Text>Generated on: {new Date().toLocaleDateString()}</Text>
          <Text>SIBA University - Examination Department</Text>
        </View>
      </Page>

      {/* Additional pages for other courses */}
      {student.courses.slice(1).map((course, cIndex) => (
        <Page key={cIndex + 1} style={styles.page}>
          <Text style={styles.courseSeparator}>
            Course: {course.courseId.courseCode} - {course.courseId.courseName}
          </Text>

          {course.assessments.map(
            (assessment, aIndex) =>
              assessment.questions &&
              assessment.questions.length > 0 && (
                <AssessmentTable
                  key={aIndex}
                  assessment={assessment}
                  student={student}
                  showAssessmentName={true}
                />
              )
          )}

          <View style={styles.footer}>
            <Text>Generated on: {new Date().toLocaleDateString()}</Text>
            <Text>SIBA University - Examination Department</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

// All Assessments Report Component for a single course
const AllAssessmentsReport = ({ student, course }) => {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Header with student info */}
        <View style={styles.header}>
          <Image
            style={styles.logoLeft}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5NxN6cDfvZhaFGjkftO-NzIEofkdi_bSGUw&s"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Student OBE Report</Text>
            <Text style={styles.subtitle}>
              Course: {course.courseId.courseCode} -{" "}
              {course.courseId.courseName}
            </Text>
            <Text style={styles.studentInfo}>
              {student.firstName} {student.lastName} ({student.studentId}) -{" "}
              {student.studentSection} - {student.studentBatch}
            </Text>
          </View>
          <Image
            style={styles.logoRight}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsCNIBPctM5RsLsEBsuMV8HhQZO_KSkysM_g&s"
          />
        </View>

        {/* All assessments for the course */}
        {course.assessments.map(
          (assessment, index) =>
            assessment.questions &&
            assessment.questions.length > 0 && (
              <View key={index}>
                <Text style={styles.courseSeparator}>
                  Course: {course.courseId.courseCode} -{" "}
                  {course.courseId.courseName}
                </Text>
                <AssessmentTable
                  assessment={assessment}
                  student={student}
                  showAssessmentName={true}
                />
              </View>
            )
        )}

        <View style={styles.footer}>
          <Text>Generated on: {new Date().toLocaleDateString()}</Text>
          <Text>SIBA University - Examination Department</Text>
        </View>
      </Page>
    </Document>
  );
};

// Single Assessment Report Component
const SingleAssessmentReport = ({ student, course, assessment }) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image
            style={styles.logoLeft}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5NxN6cDfvZhaFGjkftO-NzIEofkdi_bSGUw&s"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Student OBE Report</Text>
            <Text style={styles.subtitle}>
              ({assessment.assessmentName} of Course: {course.courseCode} -{" "}
              {course.courseName})
            </Text>
            <Text style={styles.studentInfo}>
              {student.firstName} {student.lastName} ({student.studentId}) -{" "}
              {student.studentSection} - {student.studentBatch}
            </Text>
          </View>
          <Image
            style={styles.logoRight}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsCNIBPctM5RsLsEBsuMV8HhQZO_KSkysM_g&s"
          />
        </View>

        <AssessmentTable
          assessment={assessment}
          student={student}
          showAssessmentName={false}
        />

        <View style={styles.footer}>
          <Text>Generated on: {new Date().toLocaleDateString()}</Text>
          <Text>SIBA University - Examination Department</Text>
        </View>
      </Page>
    </Document>
  );
};

// All Assessments in One Table Component
const AllAssessmentsInOneTable = ({ student }) => {
  const calculateCLOAchievement = (question) => {
    return question.clos
      .map((clo) => {
        const percentage =
          (question.obtainedMarks / question.totalQuestionMarks) *
          clo.cloWeight;
        return `${clo.cloId}: ${Math.round(percentage)}%`;
      })
      .join(", ");
  };

  // Flatten all questions from all courses and assessments with proper question numbering
  const allQuestions = [];
  student.courses?.forEach((course) => {
    course.assessments?.forEach((assessment) => {
      if (assessment.questions && assessment.questions.length > 0) {
        assessment.questions.forEach((question, qIndex) => {
          allQuestions.push({
            assessmentName: assessment.assessmentName,
            assessmentType: assessment.assessmentType,
            questionNumber: qIndex + 1,
            ...question,
          });
        });
      }
    });
  });

  // Track current assessment to know when to show assessment name
  let currentAssessment = null;

  return (
    <Document>
      <Page style={styles.page}>
        <View>
          <View style={styles.header}>
            <Image
              style={styles.logoLeft}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5NxN6cDfvZhaFGjkftO-NzIEofkdi_bSGUw&s"
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                Student OBE Report - All Assessments
              </Text>
              <Text style={styles.studentInfo}>
                {student.firstName} {student.lastName} ({student.studentId}) -{" "}
                {student.studentSection} - {student.studentBatch}
              </Text>
            </View>
            <Image
              style={styles.logoRight}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsCNIBPctM5RsLsEBsuMV8HhQZO_KSkysM_g&s"
            />
          </View>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Assessment</Text>
              <Text style={styles.tableCell}>Question</Text>
              <Text style={styles.tableCell}>CLO Assigned</Text>
              <Text style={styles.tableCell}>CLO Achieved</Text>
              <Text style={styles.tableCell}>Marks Assigned</Text>
              <Text style={styles.tableCell}>Threshold</Text>
              <Text style={styles.tableCell}>Marks Achieved</Text>
              <Text style={styles.tableCell}>PLO Assigned</Text>
              <Text style={styles.lastCell}>PLO Stated</Text>
            </View>

            {allQuestions.map((question, index) => {
              // Check if we need to show assessment name
              const showAssessment =
                currentAssessment !==
                `${question.assessmentName}-${question.assessmentType}`;
              if (showAssessment) {
                currentAssessment = `${question.assessmentName}-${question.assessmentType}`;
              }

              const assignedPLO =
                question.assignedPLO || `PLO${(index % 10) + 1}`;
              const ploStatus = getPLOAchievementStatus(student, assignedPLO);

              return (
                <View key={index} style={styles.tableRow}>
                  <Text
                    style={[
                      styles.tableCell,
                      showAssessment && styles.boldText,
                    ]}
                  >
                    {showAssessment
                      ? `${question.assessmentName} (${question.assessmentType})`
                      : ""}
                  </Text>
                  <Text style={styles.tableCell}>
                    Q{question.questionNumber}
                  </Text>
                  <Text style={styles.tableCell}>
                    {question.clos
                      .map((clo) => `${clo.cloId}: ${clo.cloWeight}%`)
                      .join(", ")}
                  </Text>
                  <Text style={styles.tableCell}>
                    {calculateCLOAchievement(question)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {question.totalQuestionMarks}
                  </Text>
                  <Text style={styles.tableCell}>{question.threshold}%</Text>
                  <Text style={styles.tableCell}>{question.obtainedMarks}</Text>
                  <Text style={styles.tableCell}>{assignedPLO}</Text>
                  <Text
                    style={[
                      styles.lastCell,
                      ploStatus === "Achieved"
                        ? { color: "green", fontFamily: "Helvetica-Bold" }
                        : { color: "red", fontFamily: "Helvetica-Bold" },
                    ]}
                  >
                    {ploStatus}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.footer}>
            <Text>Generated on: {new Date().toLocaleDateString()}</Text>
            <Text>SIBA University - Examination Department</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const StudentReports = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedAssessment, setSelectedAssessment] = useState("all");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `https://iba-nceac.onrender.com/api/students/id/${id}`,
          {
            params: {
              populate: "courses.courseId courses.assessments.assessmentId",
            },
          }
        );

        // Transform the data to ensure consistent structure
        const transformedStudent = {
          ...response.data,
          courses: response.data.courses.map((course) => ({
            ...course,
            courseId: course.courseId || {}, // Ensure courseId exists
            assessments: course.assessments.map((assessment) => ({
              ...assessment,
              questions: assessment.questions || [], // Ensure questions array exists
            })),
          })),
        };

        setStudent(transformedStudent);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [id]);

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    setSelectedAssessment("all");
  };

  const currentCourse =
    selectedCourse === "all"
      ? null
      : student?.courses?.find((c) => c.courseId._id === selectedCourse);

  const currentAssessment =
    selectedAssessment === "all"
      ? null
      : currentCourse?.assessments?.find((a) => a._id === selectedAssessment);

  // Show "All Assessments in One Table" button only when no specific assessment is selected
  const showConsolidatedReportButton = selectedAssessment === "all";

  // Check if there are any courses with assessments and questions
  const hasReportData = student?.courses?.some((course) =>
    course.assessments?.some(
      (assessment) => assessment.questions && assessment.questions.length > 0
    )
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F2C73]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-md p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-md p-6">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Student not found
          </div>
        </div>
      </div>
    );
  }

  if (!hasReportData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-[#1F2C73] text-center">
            OBE Report Generation for{" "}
            <span className="font-bold">
              {student.firstName} {student.lastName}
            </span>
          </h1>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            No course or assessment data found to generate reports.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen ">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-md p-4">
        <h1 className="text-xl font-bold mb-6 text-[#1F2C73] text-start">
          Report Generation for{" "}
          <span className="font-bold">
            {student.firstName} {student.lastName}
          </span>
        </h1>

        <div className="space-y-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#1F2C73] focus:border-[#1F2C73] transition"
              value={selectedCourse}
              onChange={handleCourseChange}
            >
              <option value="all">All Courses</option>
              {student.courses?.map((course) => (
                <option key={course.courseId._id} value={course.courseId._id}>
                  {course.courseId.courseCode} - {course.courseId.courseName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Assessment
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#1F2C73] focus:border-[#1F2C73] transition"
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              disabled={selectedCourse === "all"}
            >
              <option value="all">All Assessments</option>
              {currentCourse?.assessments?.map((assessment) => (
                <option key={assessment._id} value={assessment._id}>
                  {assessment.assessmentName} ({assessment.assessmentType})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2 mt-0">
          {/* Download All Courses Report */}
          {selectedCourse === "all" && (
            <PDFDownloadLink
              document={<AllCoursesReport student={student} />}
              fileName={`OBE_Report_All_Courses_${student.studentId}.pdf`}
              className="block w-full"
            >
              {({ loading }) => (
                <button
                  className={`w-full px-6 py-3 rounded-lg text-white font-medium ${
                    loading
                      ? "bg-gray-400"
                      : "bg-[#1F2C73] hover:bg-[#17255A] transition"
                  } flex items-center justify-center`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating All Courses Report...
                    </>
                  ) : (
                    "Download All Courses Report"
                  )}
                </button>
              )}
            </PDFDownloadLink>
          )}

          {/* Download All Assessments Report for Selected Course */}
          {selectedCourse !== "all" && selectedAssessment === "all" && (
            <PDFDownloadLink
              document={
                <AllAssessmentsReport
                  student={student}
                  course={currentCourse}
                />
              }
              fileName={`OBE_Report_${student.studentId}_${currentCourse.courseId.courseCode}_All_Assessments.pdf`}
              className="block w-full"
            >
              {({ loading }) => (
                <button
                  className={`w-full px-6 py-3 rounded-lg text-white font-medium ${
                    loading
                      ? "bg-gray-400"
                      : "bg-[#1F2C73] hover:bg-[#17255A] transition"
                  } flex items-center justify-center`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating All Assessments Report...
                    </>
                  ) : (
                    "Download All Assessments Report"
                  )}
                </button>
              )}
            </PDFDownloadLink>
          )}

          {/* Download Single Assessment Report */}
          {selectedAssessment !== "all" &&
            currentAssessment?.questions?.length > 0 && (
              <PDFDownloadLink
                document={
                  <SingleAssessmentReport
                    student={student}
                    course={currentCourse.courseId}
                    assessment={currentAssessment}
                  />
                }
                fileName={`OBE_Report_${student.studentId}_${currentCourse.courseId.courseCode}_${currentAssessment.assessmentName}.pdf`}
                className="block w-full"
              >
                {({ loading }) => (
                  <button
                    className={`w-full px-6 py-3 rounded-lg text-white font-medium ${
                      loading
                        ? "bg-gray-400"
                        : "bg-[#1F2C73] hover:bg-[#17255A] transition"
                    } flex items-center justify-center`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating PDF...
                      </>
                    ) : (
                      "Download Single Assessment Report"
                    )}
                  </button>
                )}
              </PDFDownloadLink>
            )}

          {/* Download All Assessments in One Table - Only shown when no specific assessment is selected */}
          {showConsolidatedReportButton && (
            <PDFDownloadLink
              document={<AllAssessmentsInOneTable student={student} />}
              fileName={`OBE_Report_All_Assessments_${student.studentId}.pdf`}
              className="block w-full"
            >
              {({ loading }) => (
                <button
                  className={`w-full px-6 py-3 rounded-lg text-white font-medium ${
                    loading
                      ? "bg-gray-400"
                      : "bg-[#1F2C73] hover:bg-[#17255A] transition"
                  } flex items-center justify-center`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating Consolidated Report...
                    </>
                  ) : (
                    "Download All Assessments in One Table"
                  )}
                </button>
              )}
            </PDFDownloadLink>
          )}
        </div>

        {currentAssessment &&
          (!currentAssessment.questions ||
            currentAssessment.questions.length === 0) && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-6">
              Selected assessment doesn't have any questions data to generate
              OBE report.
            </div>
          )}
      </div>
    </div>
  );
};

export default StudentReports;
