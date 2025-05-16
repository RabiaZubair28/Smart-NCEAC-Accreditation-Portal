import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import cloPloMap from "../../Pages/Data.json";
import { motion, AnimatePresence } from "framer-motion";

// PDF Styles

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4b5563",
  },
  studentInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 12,
  },
  table: {
    display: "flex",
    width: "100%",
    border: "1px solid #e0e0e0",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e0e0e0",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    flex: 1,
    borderRight: "1px solid #e0e0e0",
  },
  lastCell: {
    borderRight: "none",
  },
  achievementText: {
    fontSize: 10,
    color: "#10b981",
  },
  notAchievedText: {
    fontSize: 10,
    color: "#ef4444",
  },
  partiallyAchievedText: {
    fontSize: 10,
    color: "#f59e0b",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  summaryBox: {
    width: "30%",
    padding: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 5,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 14,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#9ca3af",
  },
  chartImage: { width: 500, height: 250, objectFit: "contain" },
});

// Helper functions
// const calculateCLOAchievement = (student, courseId, cloId) => {
//   let totalWeightedMarks = 0;
//   let totalWeight = 0;

//   const course = student.courses?.find(
//     (c) => String(c.courseId) === String(courseId)
//   );
//   if (!course || !course.assessments) return 0;

//   course.assessments.forEach((assessment) => {
//     assessment.questions?.forEach((question) => {
//       if (!question.clos || question.totalQuestionMarks === 0) return;

//       question.clos.forEach((clo) => {
//         if (clo.cloId === cloId) {
//           const weight = clo.cloWeight || 0;
//           const obtained = question.obtainedMarks || 0;
//           const total = question.totalQuestionMarks || 1;

//           totalWeightedMarks += weight * (obtained / total);
//           totalWeight += weight;
//         }
//       });
//     });
//   });

//   if (totalWeight === 0) return 0;
//   return (totalWeightedMarks / totalWeight) * 100;
// };

// const calculatePLOAchievement = (student, ploId) => {
//   let totalWeightedAchievement = 0;
//   let totalPloWeight = 0;

//   cloPloMap.forEach((courseMap) => {
//     const courseId = courseMap.courseId;
//     const relevantCLOs = courseMap.clos.filter((clo) => clo.ploId === ploId);

//     relevantCLOs.forEach((clo) => {
//       const cloAchievement = calculateCLOAchievement(
//         student,
//         courseId,
//         clo.cloId
//       );
//       totalWeightedAchievement += (cloAchievement / 100) * clo.weight;
//       totalPloWeight += clo.weight;
//     });
//   });

//   if (totalPloWeight === 0) return 0;
//   return (totalWeightedAchievement / totalPloWeight) * 100;
// };

// const getAchievementStatus = (value) => {
//   if (value >= 70) return { text: "Achieved", style: styles.achievementText };
//   if (value >= 40)
//     return { text: "Partially Achieved", style: styles.partiallyAchievedText };
//   return { text: "Not Achieved", style: styles.notAchievedText };
// };

// Report Components
// const StudentReport = ({ student }) => {
//   const plos = ["PLO1", "PLO2", "PLO3", "PLO4", "PLO5", "PLO6"];

//   return (
//     <View style={styles.section}>
//       <View style={styles.studentInfo}>
//         <Text style={styles.infoText}>
//           Name: {student.firstName} {student.lastName}
//         </Text>
//         <Text style={styles.infoText}>Roll No: {student.rollNo}</Text>
//         <Text style={styles.infoText}>Batch: {student.studentBatch}</Text>
//         <Text style={styles.infoText}>Section: {student.studentSection}</Text>
//       </View>

//       <Text style={styles.sectionTitle}>Course-wise CLO Achievement</Text>
//       <View style={styles.table}>
//         <View style={[styles.tableRow, styles.tableHeader]}>
//           <Text style={styles.tableCell}>Course Code</Text>
//           <Text style={styles.tableCell}>CLO ID</Text>
//           <Text style={styles.tableCell}>Achievement %</Text>
//           <Text style={[styles.tableCell, styles.lastCell]}>Status</Text>
//         </View>

//         {student.courses?.map((course) => {
//           const courseMap = cloPloMap.find(
//             (c) => c.courseId === String(course.courseId)
//           );
//           if (!courseMap) return null;

//           return courseMap.clos.map((clo) => {
//             const achievement = calculateCLOAchievement(
//               student,
//               course.courseId,
//               clo.cloId
//             );
//             const status = getAchievementStatus(achievement);

//             return (
//               <View
//                 style={styles.tableRow}
//                 key={`${course.courseId}-${clo.cloId}`}
//               >
//                 <Text style={styles.tableCell}>{courseMap.courseCode}</Text>
//                 <Text style={styles.tableCell}>{clo.cloId}</Text>
//                 <Text style={styles.tableCell}>{achievement.toFixed(2)}%</Text>
//                 <Text style={[styles.tableCell, styles.lastCell, status.style]}>
//                   {status.text}
//                 </Text>
//               </View>
//             );
//           });
//         })}
//       </View>

//       <Text style={styles.sectionTitle}>PLO Achievement</Text>
//       <View style={styles.table}>
//         <View style={[styles.tableRow, styles.tableHeader]}>
//           <Text style={styles.tableCell}>PLO ID</Text>
//           <Text style={styles.tableCell}>Achievement %</Text>
//           <Text style={[styles.tableCell, styles.lastCell]}>Status</Text>
//         </View>

//         {plos.map((plo) => {
//           const achievement = calculatePLOAchievement(student, plo);
//           const status = getAchievementStatus(achievement);

//           return (
//             <View style={styles.tableRow} key={plo}>
//               <Text style={styles.tableCell}>{plo}</Text>
//               <Text style={styles.tableCell}>{achievement.toFixed(2)}%</Text>
//               <Text style={[styles.tableCell, styles.lastCell, status.style]}>
//                 {status.text}
//               </Text>
//             </View>
//           );
//         })}
//       </View>
//     </View>
//   );
// };
const BarChartPDF = ({ data }) => {
  // const maxValue = Math.max(
  //   ...data.reduce((acc, q) => {
  //     acc.push(q.total, q.threshold, q.obtained);
  //     return acc;
  //   }, [])
  // );

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 14, marginBottom: 10, fontWeight: "bold" }}>
        Assessment Performance (Vertical Bars)
      </Text>

      <View
        style={{ flexDirection: "row", alignItems: "flex-end", height: "auto" }}
      >
        {data.map((q, idx) => {
          const totalMarks = q.totalQuestionMarks || 20; // Fallback to 0 if undefined
          const threshold = q.threshold || 0; // Fallback to 0 if undefined
          const obtainedMarks = q.obtainedMarks || 20; // Fallback to 0 if undefined

          return (
            <View
              key={idx}
              style={{
                marginHorizontal: 6,
                alignItems: "center",
                width: 40,
                // Removed fixed height to allow auto sizing based on content
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  height: "100%", // Let content define the height
                }}
              >
                {/* Total */}
                <View
                  style={{
                    width: 8,
                    height: `${totalMarks}px`,
                    backgroundColor: "#8884d8",
                    marginHorizontal: 1,
                  }}
                />
                {/* Threshold */}
                <View
                  style={{
                    width: 8,
                    height: `${threshold}px`,
                    backgroundColor: "#82ca9d",
                    marginHorizontal: 1,
                  }}
                />
                {/* Obtained */}
                <View
                  style={{
                    width: 8,
                    height: `${obtainedMarks}px`,
                    backgroundColor: "#ffc658",
                    marginHorizontal: 1,
                  }}
                />
              </View>
              <Text style={{ fontSize: 8, marginTop: 4 }}>{q.question}</Text>
              <Text style={{ fontSize: 8, marginTop: 4 }}>
                obtained: {q.obtainedMarks}
              </Text>
              <Text style={{ fontSize: 8, marginTop: 4 }}>
                total: {q.totalQuestionMarks}
              </Text>
            </View>
          );
        })}
      </View>

      <p>bshbchd</p>
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 10, color: "#8884d8" }}>⬛ Total</Text>
        <Text style={{ fontSize: 10, color: "#82ca9d" }}>⬛ Threshold</Text>
        <Text style={{ fontSize: 10, color: "#ffc658" }}>⬛ Obtained</Text>
      </View>
    </View>
  );
};

const generateSpecificAssessment = ({
  selectedStudent,
  selectedCourse,
  selectedAssessment,
  assessmentData,
  // base64 image
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Academic Progress Report</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Info</Text>
          <Text>
            Name: {selectedStudent?.firstName} {selectedStudent?.lastName}
          </Text>
          <Text>Roll No: {selectedStudent?.studentId}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assessment</Text>
          <Text>Course: {selectedCourse?.courseCode}</Text>
          <Text>Assessment: {selectedAssessment?.assessmentName}</Text>
        </View>

        {/* Pass the assessmentData prop */}
        <BarChartPDF data={assessmentData} />

        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

const GraphicalReport = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("all-batches");
  const [selectedSection, setSelectedSection] = useState("all-sections");
  const [selectedStudent, setSelectedStudent] = useState("all-students");
  const [selectedCourse, setSelectedCourse] = useState("all-courses");
  const [selectedAssessment, setSelectedAssessment] =
    useState("all-assessments");
  const [reportType, setReportType] = useState("batch"); // Default to batch report
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const params = useParams();
  const departmentId = params.id;

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

  const [courseNames, setCourseNames] = useState({});

  const getCourseInfo = async (id) => {
    try {
      const response = await fetch(
        `https://iba-nceac.site/api/data/course/id/${id}`,
        { method: "GET" }
      );

      if (response.ok) {
        const data = await response.json();
        return data.courseName; // return directly
      }
    } catch (error) {
      console.error(`Services error: ${error}`);
    }
    return "Unknown Course";
  };

  useEffect(() => {
    const fetchCourseNames = async () => {
      const studentCourses = getCoursesForStudent(selectedStudent); // assuming this exists
      const namesMap = {};

      for (const course of studentCourses) {
        const name = await getCourseInfo(course.courseId);
        namesMap[course._id] = name;
      }

      setCourseNames(namesMap);
    };

    if (selectedStudent) {
      fetchCourseNames();
    }
  }, [selectedStudent]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [studentsRes, batchesRes] = await Promise.all([
          axios.get(
            `https://iba-nceac.site/api/students/allStudents/${departmentId}`
          ),
          axios.get(
            `https://iba-nceac.site/api/batches/all-batches/${departmentId}`
          ),
        ]);

        if (!studentsRes.data || !batchesRes.data) {
          throw new Error("Failed to fetch data");
        }

        const validStudents = studentsRes.data.filter((s) => s.studentSection);
        const uniqueSections = [
          ...new Set(validStudents.map((s) => s.studentSection)),
        ];

        setStudents(validStudents);
        setBatches(batchesRes.data);
        setSections(uniqueSections);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load data. Please check console for details.");
      } finally {
        setLoading(false);
      }
    };

    if (departmentId) fetchData();
  }, [departmentId]);

  // Filter students based on selections
  const filteredStudents = students.filter((student) => {
    const batchMatch = !selectedBatch || student.studentBatch === selectedBatch;
    const sectionMatch =
      !selectedSection || student.studentSection === selectedSection;
    return batchMatch && sectionMatch;
  });

  // Get sections for selected batch
  const getSectionsForBatch = (batch) => {
    if (!batch) return sections;
    return [
      ...new Set(
        students
          .filter((s) => s.studentBatch === batch)
          .map((s) => s.studentSection)
      ),
    ];
  };

  // Get students for selected batch and section
  const getStudentsForBatchAndSection = (batch, section) => {
    return students.filter(
      (s) => s.studentBatch === batch && s.studentSection === section
    );
  };

  const getCoursesForStudent = (studentId) => {
    const student = students.find((s) => s._id === studentId);
    return student ? student.courses || [] : [];
  };

  const getAssessmentsForStudentCourse = (studentId, courseId) => {
    const student = students.find((s) => s._id === studentId);
    if (!student || !student.courses) return [];

    const course = student.courses.find((c) => c._id === courseId);
    if (!course || !course.assessments) return [];

    return course.assessments;
  };

  const student = students.find((s) => s._id === selectedStudent);
  const course = student?.courses.find((c) => c._id === selectedCourse);
  const assessment = course?.assessments.find(
    (a) => a._id === selectedAssessment
  );

  const assessmentData =
    assessment?.questions.map((q, idx) => ({
      question: `Q${idx + 1}`,
      total: q.totalMarks,
      threshold: q.threshold || 0,
      obtained: q.obtainedMarks,
    })) || [];

  const pdfDocument = generateSpecificAssessment({
    selectedStudent: student,
    selectedCourse: course,
    selectedAssessment: assessment,
    assessmentData,
  });

  if (loading) return <div className="text-center py-8">Loading data...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-5 ">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Generate Graphical Reports
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);
              setSelectedBatch("");
              setSelectedSection("");
              setSelectedStudent("");
            }}
          >
            <option value="batch">Batch Report</option>
            <option value="section">Section Report</option>
            <option value="student">Student Report</option>
            <option value="course">Course Report</option>
            <option value="assessment">Assessment Report</option>
          </select>
        </div>

        {reportType === "batch" && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Batch
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedBatch}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedBatch(value);
                }}
              >
                <option key="all" value="all-batches">
                  All Batches
                </option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch.batchName}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-8">
              {selectedBatch == "all-batches" && (
                // <PDFDownloadLink
                //   document={
                //     <MyDocument
                //       students={
                //         selectedBatch === "all-batches"
                //           ? students
                //           : students.filter(
                //               (s) => s.studentBatch === selectedBatch
                //             )
                //       }
                //       batchName={selectedBatch}
                //       reportType={reportType}
                //     />
                //   }
                //   fileName={`${selectedBatch}_batch_report.pdf`}
                //   className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                // >
                //   {({ loading }) =>
                //     loading ? "Preparing document..." : "Download Batch Report"
                //   }
                // </PDFDownloadLink>

                <p> I will generate report of all batches</p>
              )}
              {selectedBatch !== "all-batches" && (
                // <PDFDownloadLink
                //   document={
                //     <MyDocument
                //       students={
                //         selectedBatch === "all-batches"
                //           ? students
                //           : students.filter(
                //               (s) => s.studentBatch === selectedBatch
                //             )
                //       }
                //       batchName={selectedBatch}
                //       reportType={reportType}
                //     />
                //   }
                //   fileName={`${selectedBatch}_batch_report.pdf`}
                //   className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                // >
                //   {({ loading }) =>
                //     loading ? "Preparing document..." : "Download Batch Report"
                //   }
                // </PDFDownloadLink>

                <p> I will generate report of selected batch</p>
              )}
            </div>
          </>
        )}

        {reportType === "section" && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Batch
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  setSelectedSection("all-sections"); // Reset section
                }}
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch.batchName}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </div>

            {selectedBatch && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Section
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedSection}
                  onChange={(e) => {
                    setSelectedSection(e.target.value);
                  }}
                >
                  <option key="all" value="all-sections">
                    All Sections
                  </option>
                  {getSectionsForBatch(selectedBatch).map((section, index) => (
                    <option key={index} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedBatch && selectedSection && (
              <div className="mt-8">
                {/* <PDFDownloadLink
                  document={
                    <MyDocument
                      students={selectedSection === "all-sections"}
                      batchName={selectedBatch}
                      sectionName={selectedSection}
                      reportType={reportType}
                    />
                  }
                  fileName={`${selectedBatch}_${selectedSection}_section_report.pdf`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                  {({ loading }) =>
                    loading
                      ? "Preparing document..."
                      : "Download Section Report"
                  }
                </PDFDownloadLink> */}
                {selectedSection == "all-sections" && (
                  <p>
                    I will generate report of all sections of selected batch
                  </p>
                )}
                {selectedSection != "all-sections" && (
                  <p>
                    I will generate report of selected section of selected batch
                  </p>
                )}
              </div>
            )}

            {selectedBatch && !selectedSection && (
              <p className="text-gray-500 mt-4">
                Please select a section to generate report
              </p>
            )}
          </>
        )}

        {reportType === "student" && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Batch
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  setSelectedSection("");
                  setSelectedStudent("");
                }}
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch.batchName}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </div>

            {selectedBatch && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Section
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedSection}
                  onChange={(e) => {
                    setSelectedSection(e.target.value);
                    setSelectedStudent("all-students");
                  }}
                >
                  <option value="">Select Section</option>
                  {getSectionsForBatch(selectedBatch).map((section, index) => (
                    <option key={index} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedBatch && selectedSection && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  <option value="all-students">All Students</option>
                  {getStudentsForBatchAndSection(
                    selectedBatch,
                    selectedSection
                  ).map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} ({student.studentId})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-8">
              {selectedBatch && selectedSection && selectedStudent ? (
                selectedStudent === "all-students" ? (
                  <p>
                    I will generate report of all students of selected section
                    of selected batch
                  </p>
                ) : (
                  <p>
                    I will generate report of selected student of selected
                    section of selected batch
                  </p>
                )
              ) : (
                <p className="text-gray-500">
                  {!selectedBatch
                    ? "Please select a batch first"
                    : !selectedSection
                    ? "Please select a section"
                    : "Please select a student to generate report"}
                </p>
              )}
            </div>
          </>
        )}

        {reportType === "course" && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Batch
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  setSelectedSection("");
                  setSelectedStudent("");
                  setSelectedCourse("");
                }}
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch.batchName}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </div>

            {selectedBatch && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Section
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedSection}
                  onChange={(e) => {
                    setSelectedSection(e.target.value);
                    setSelectedStudent("");
                    setSelectedCourse("");
                  }}
                >
                  <option value="">Select Section</option>
                  {getSectionsForBatch(selectedBatch).map((section, index) => (
                    <option key={index} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedBatch && selectedSection && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedStudent}
                  onChange={(e) => {
                    setSelectedStudent(e.target.value);
                    setSelectedCourse("all-courses");
                  }}
                >
                  <option value="">Select Student</option>
                  {getStudentsForBatchAndSection(
                    selectedBatch,
                    selectedSection
                  ).map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName} (
                      {student.studentId})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedBatch && selectedSection && selectedStudent && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="all-courses">All Courses</option>
                  {getCoursesForStudent(selectedStudent).map((course) => (
                    <option key={course._id} value={course._id}>
                      {courseNames[course._id] || "Loading..."}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-8">
              {selectedBatch &&
              selectedSection &&
              selectedStudent &&
              selectedCourse ? (
                selectedCourse === "all-courses" ? (
                  <p>
                    I will generate report of all courses of selected student of
                    selected section and batch
                  </p>
                ) : (
                  <p>
                    I will generate report of selected course of selected
                    student of selected section and batch
                  </p>
                )
              ) : (
                <p className="text-gray-500">
                  {!selectedBatch
                    ? "Please select a batch first"
                    : !selectedSection
                    ? "Please select a section"
                    : !selectedStudent
                    ? "Please select a student"
                    : "Please select a course to generate report"}
                </p>
              )}
            </div>
          </>
        )}
        {reportType === "assessment" && (
          <>
            {/* Batch Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Batch
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  setSelectedSection("");
                  setSelectedStudent("");
                  setSelectedCourse("");
                  setSelectedAssessment("");
                }}
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch.batchName}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Selection */}
            {selectedBatch && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Section
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedSection}
                  onChange={(e) => {
                    setSelectedSection(e.target.value);
                    setSelectedStudent("");
                    setSelectedCourse("");
                    setSelectedAssessment("");
                  }}
                >
                  <option value="">Select Section</option>
                  {getSectionsForBatch(selectedBatch).map((section, index) => (
                    <option key={index} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Student Selection */}
            {selectedBatch && selectedSection && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedStudent}
                  onChange={(e) => {
                    setSelectedStudent(e.target.value);
                    setSelectedCourse("all-courses");
                    setSelectedAssessment("");
                  }}
                >
                  <option value="">Select Student</option>
                  {getStudentsForBatchAndSection(
                    selectedBatch,
                    selectedSection
                  ).map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName} (
                      {student.studentId})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Course Selection */}
            {selectedBatch && selectedSection && selectedStudent && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    setSelectedAssessment("all-assessments");
                  }}
                >
                  <option value="all-courses">All Courses</option>
                  {getCoursesForStudent(selectedStudent).map((course) => (
                    <option key={course._id} value={course._id}>
                      {courseNames[course._id] || "Loading..."}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Assessment Selection */}
            {selectedBatch &&
              selectedSection &&
              selectedStudent &&
              selectedCourse &&
              selectedCourse !== "all-courses" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Assessment
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedAssessment}
                    onChange={(e) => setSelectedAssessment(e.target.value)}
                  >
                    <option value="all-assessments">All Assessments</option>
                    {getAssessmentsForStudentCourse(
                      selectedStudent,
                      selectedCourse
                    ).map((assessment) => (
                      <option key={assessment._id} value={assessment._id}>
                        {assessment.assessmentName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            {/* Report Text */}
            <div className="mt-8">
              {selectedBatch &&
              selectedSection &&
              selectedStudent &&
              selectedCourse &&
              selectedAssessment ? (
                selectedAssessment === "all-assessments" ? (
                  <p>
                    I will generate report of all assessments of selected course
                    for selected student of selected section and batch.
                  </p>
                ) : (
                  <PDFDownloadLink
                    document={pdfDocument}
                    fileName="assessment-report.pdf"
                  >
                    {({ loading }) =>
                      loading ? (
                        "Generating PDF..."
                      ) : (
                        <button>
                          I will generate report of selected assessment of
                          selected course for selected student of selected
                          section and batch.
                        </button>
                      )
                    }
                  </PDFDownloadLink>
                )
              ) : (
                <p className="text-gray-500">
                  {!selectedBatch
                    ? "Please select a batch first"
                    : !selectedSection
                    ? "Please select a section"
                    : !selectedStudent
                    ? "Please select a student"
                    : !selectedCourse
                    ? "Please select a course"
                    : "Please select an assessment to generate report"}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GraphicalReport;
