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
});

// Helper functions
const calculateCLOAchievement = (student, courseId, cloId) => {
  let totalWeightedMarks = 0;
  let totalWeight = 0;

  const course = student.courses?.find(
    (c) => String(c.courseId) === String(courseId)
  );
  if (!course || !course.assessments) return 0;

  course.assessments.forEach((assessment) => {
    assessment.questions?.forEach((question) => {
      if (!question.clos || question.totalQuestionMarks === 0) return;

      question.clos.forEach((clo) => {
        if (clo.cloId === cloId) {
          const weight = clo.cloWeight || 0;
          const obtained = question.obtainedMarks || 0;
          const total = question.totalQuestionMarks || 1;

          totalWeightedMarks += weight * (obtained / total);
          totalWeight += weight;
        }
      });
    });
  });

  if (totalWeight === 0) return 0;
  return (totalWeightedMarks / totalWeight) * 100;
};

const calculatePLOAchievement = (student, ploId) => {
  let totalWeightedAchievement = 0;
  let totalPloWeight = 0;

  cloPloMap.forEach((courseMap) => {
    const courseId = courseMap.courseId;
    const relevantCLOs = courseMap.clos.filter((clo) => clo.ploId === ploId);

    relevantCLOs.forEach((clo) => {
      const cloAchievement = calculateCLOAchievement(
        student,
        courseId,
        clo.cloId
      );
      totalWeightedAchievement += (cloAchievement / 100) * clo.weight;
      totalPloWeight += clo.weight;
    });
  });

  if (totalPloWeight === 0) return 0;
  return (totalWeightedAchievement / totalPloWeight) * 100;
};

const getAchievementStatus = (value) => {
  if (value >= 70) return { text: "Achieved", style: styles.achievementText };
  if (value >= 40)
    return { text: "Partially Achieved", style: styles.partiallyAchievedText };
  return { text: "Not Achieved", style: styles.notAchievedText };
};

// Report Components
const StudentReport = ({ student }) => {
  const plos = ["PLO1", "PLO2", "PLO3", "PLO4", "PLO5", "PLO6"];

  return (
    <View style={styles.section}>
      <View style={styles.studentInfo}>
        <Text style={styles.infoText}>
          Name: {student.firstName} {student.lastName}
        </Text>
        <Text style={styles.infoText}>Roll No: {student.rollNo}</Text>
        <Text style={styles.infoText}>Batch: {student.studentBatch}</Text>
        <Text style={styles.infoText}>Section: {student.studentSection}</Text>
      </View>

      <Text style={styles.sectionTitle}>Course-wise CLO Achievement</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Course Code</Text>
          <Text style={styles.tableCell}>CLO ID</Text>
          <Text style={styles.tableCell}>Achievement %</Text>
          <Text style={[styles.tableCell, styles.lastCell]}>Status</Text>
        </View>

        {student.courses?.map((course) => {
          const courseMap = cloPloMap.find(
            (c) => c.courseId === String(course.courseId)
          );
          if (!courseMap) return null;

          return courseMap.clos.map((clo) => {
            const achievement = calculateCLOAchievement(
              student,
              course.courseId,
              clo.cloId
            );
            const status = getAchievementStatus(achievement);

            return (
              <View
                style={styles.tableRow}
                key={`${course.courseId}-${clo.cloId}`}
              >
                <Text style={styles.tableCell}>{courseMap.courseCode}</Text>
                <Text style={styles.tableCell}>{clo.cloId}</Text>
                <Text style={styles.tableCell}>{achievement.toFixed(2)}%</Text>
                <Text style={[styles.tableCell, styles.lastCell, status.style]}>
                  {status.text}
                </Text>
              </View>
            );
          });
        })}
      </View>

      <Text style={styles.sectionTitle}>PLO Achievement</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>PLO ID</Text>
          <Text style={styles.tableCell}>Achievement %</Text>
          <Text style={[styles.tableCell, styles.lastCell]}>Status</Text>
        </View>

        {plos.map((plo) => {
          const achievement = calculatePLOAchievement(student, plo);
          const status = getAchievementStatus(achievement);

          return (
            <View style={styles.tableRow} key={plo}>
              <Text style={styles.tableCell}>{plo}</Text>
              <Text style={styles.tableCell}>{achievement.toFixed(2)}%</Text>
              <Text style={[styles.tableCell, styles.lastCell, status.style]}>
                {status.text}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const BatchReport = ({ students, batchName }) => {
  const plos = ["PLO1", "PLO2", "PLO3", "PLO4", "PLO5", "PLO6"];

  // Calculate batch statistics
  const totalStudents = students.length;
  const ploStats = plos.map((plo) => {
    const achievements = students.map((student) =>
      calculatePLOAchievement(student, plo)
    );
    const average =
      achievements.reduce((sum, val) => sum + val, 0) / totalStudents || 0;

    const achievedCount = achievements.filter((a) => a >= 70).length;
    const partiallyAchievedCount = achievements.filter(
      (a) => a >= 40 && a < 70
    ).length;
    const notAchievedCount = achievements.filter((a) => a < 40).length;

    return {
      plo,
      average,
      achievedCount,
      partiallyAchievedCount,
      notAchievedCount,
    };
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Batch Report: {batchName}</Text>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Total Students</Text>
          <Text style={styles.summaryValue}>{totalStudents}</Text>
        </View>
      </View>

      <Text style={{ ...styles.sectionTitle, marginTop: 15 }}>
        PLO Achievement Summary
      </Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>PLO ID</Text>
          <Text style={styles.tableCell}>Average %</Text>
          <Text style={styles.tableCell}>Achieved</Text>
          <Text style={styles.tableCell}>Partially Achieved</Text>
          <Text style={[styles.tableCell, styles.lastCell]}>Not Achieved</Text>
        </View>

        {ploStats.map((stats) => {
          const status = getAchievementStatus(stats.average);

          return (
            <View style={styles.tableRow} key={stats.plo}>
              <Text style={styles.tableCell}>{stats.plo}</Text>
              <Text style={styles.tableCell}>{stats.average.toFixed(2)}%</Text>
              <Text style={[styles.tableCell, styles.achievementText]}>
                {stats.achievedCount}
              </Text>
              <Text style={[styles.tableCell, styles.partiallyAchievedText]}>
                {stats.partiallyAchievedCount}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.notAchievedText,
                  styles.lastCell,
                ]}
              >
                {stats.notAchievedCount}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const SectionReport = ({ students, batchName, sectionName }) => {
  const plos = ["PLO1", "PLO2", "PLO3", "PLO4", "PLO5", "PLO6"];

  // Calculate section statistics
  const totalStudents = students.length;
  const ploStats = plos.map((plo) => {
    const achievements = students.map((student) =>
      calculatePLOAchievement(student, plo)
    );
    const average =
      achievements.reduce((sum, val) => sum + val, 0) / totalStudents || 0;

    const achievedCount = achievements.filter((a) => a >= 70).length;
    const partiallyAchievedCount = achievements.filter(
      (a) => a >= 40 && a < 70
    ).length;
    const notAchievedCount = achievements.filter((a) => a < 40).length;

    return {
      plo,
      average,
      achievedCount,
      partiallyAchievedCount,
      notAchievedCount,
    };
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Section Report: {batchName} - {sectionName}
      </Text>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Total Students</Text>
          <Text style={styles.summaryValue}>{totalStudents}</Text>
        </View>
      </View>

      <Text style={{ ...styles.sectionTitle, marginTop: 15 }}>
        PLO Achievement Summary
      </Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>PLO ID</Text>
          <Text style={styles.tableCell}>Average %</Text>
          <Text style={styles.tableCell}>Achieved</Text>
          <Text style={styles.tableCell}>Partially Achieved</Text>
          <Text style={[styles.tableCell, styles.lastCell]}>Not Achieved</Text>
        </View>

        {ploStats.map((stats) => {
          const status = getAchievementStatus(stats.average);

          return (
            <View style={styles.tableRow} key={stats.plo}>
              <Text style={styles.tableCell}>{stats.plo}</Text>
              <Text style={styles.tableCell}>{stats.average.toFixed(2)}%</Text>
              <Text style={[styles.tableCell, styles.achievementText]}>
                {stats.achievedCount}
              </Text>
              <Text style={[styles.tableCell, styles.partiallyAchievedText]}>
                {stats.partiallyAchievedCount}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.notAchievedText,
                  styles.lastCell,
                ]}
              >
                {stats.notAchievedCount}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// Main Report Document
const MyDocument = ({ students, batchName, sectionName, reportType }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Academic Progress Report</Text>
        </View>

        {reportType === "student" &&
          students.map((student) => (
            <StudentReport key={student._id} student={student} />
          ))}

        {reportType === "batch" && batchName && (
          <BatchReport students={students} batchName={batchName} />
        )}

        {reportType === "section" && batchName && sectionName && (
          <SectionReport
            students={students}
            batchName={batchName}
            sectionName={sectionName}
          />
        )}

        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

const NumericalReport = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [reportType, setReportType] = useState("batch"); // Default to batch report
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const params = useParams();
  const departmentId = params.id;

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

  const [numerical, setNumerical] = useState(true);
  const [graphical, setGraphical] = useState(false);

  if (loading) return <div className="text-center py-8">Loading data...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-5 ">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Generate Numerical Reports
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
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <option value="">All Batches</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch.batchName}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-8">
              {selectedBatch ? (
                <PDFDownloadLink
                  document={
                    <MyDocument
                      students={students.filter(
                        (s) => s.studentBatch === selectedBatch
                      )}
                      batchName={selectedBatch}
                      reportType={reportType}
                    />
                  }
                  fileName={`${selectedBatch}_batch_report.pdf`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                  {({ loading }) =>
                    loading ? "Preparing document..." : "Download Batch Report"
                  }
                </PDFDownloadLink>
              ) : (
                <p className="text-gray-500">
                  Please select a batch to generate report
                </p>
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
                  setSelectedSection("");
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
                  onChange={(e) => setSelectedSection(e.target.value)}
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

            <div className="mt-8">
              {selectedBatch && selectedSection ? (
                <PDFDownloadLink
                  document={
                    <MyDocument
                      students={getStudentsForBatchAndSection(
                        selectedBatch,
                        selectedSection
                      )}
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
                </PDFDownloadLink>
              ) : (
                <p className="text-gray-500">
                  {!selectedBatch
                    ? "Please select a batch first"
                    : "Please select a section to generate report"}
                </p>
              )}
            </div>
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
                    setSelectedStudent("");
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
                  <option value="">Select Student</option>
                  {getStudentsForBatchAndSection(
                    selectedBatch,
                    selectedSection
                  ).map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName} ({student.rollNo})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-8">
              {selectedStudent ? (
                <PDFDownloadLink
                  document={
                    <MyDocument
                      students={students.filter(
                        (s) => s._id === selectedStudent
                      )}
                      reportType={reportType}
                    />
                  }
                  fileName={`${selectedBatch}_${selectedSection}_student_report.pdf`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                  {({ loading }) =>
                    loading
                      ? "Preparing document..."
                      : "Download Student Report"
                  }
                </PDFDownloadLink>
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
      </div>
    </div>
  );
};

export default NumericalReport;
