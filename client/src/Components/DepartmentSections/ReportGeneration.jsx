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
import cloPloMap from "../../Pages/Data.json";

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
    textAlign: "center",
    fontSize: 9,
    width: "12%", // Equal width for all columns
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  questionCell: {
    width: "8%", // Slightly narrower for question numbers
  },
  statusCell: {
    width: "12%",
    borderRight: "none",
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
  achievementText: {
    color: "green",
    fontFamily: "Helvetica-Bold",
  },
  notAchievedText: {
    color: "red",
    fontFamily: "Helvetica-Bold",
  },
  partiallyAchievedText: {
    color: "orange",
    fontFamily: "Helvetica-Bold",
  },
  srNoCell: {
    width: "5%",
    padding: 5,
    borderRight: "1px solid #000",
    textAlign: "center",
    fontSize: 8,
  },
  idCell: {
    width: "10%",
    padding: 5,
    borderRight: "1px solid #000",
    textAlign: "center",
    fontSize: 8,
  },
  nameCell: {
    width: "20%",
    padding: 5,
    borderRight: "1px solid #000",
    textAlign: "center",
    fontSize: 8,
  },
  sectionCell: {
    width: "8%",
    padding: 5,
    borderRight: "1px solid #000",
    textAlign: "center",
    fontSize: 8,
  },
  marksCell: {
    width: "10%",
    padding: 5,
    borderRight: "1px solid #000",
    textAlign: "center",
    fontSize: 8,
  },
  ploCell: {
    width: "47%",
    padding: 5,
    textAlign: "left",
    fontSize: 8,
  },
  ploItem: {
    marginBottom: 2,
  },
  batchHeader: {
    backgroundColor: "#e5e7eb",
    padding: 5,
    marginBottom: 5,
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    textAlign: "center",
  },
  marksHeader: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
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

// Helper functions with improved error handling
const calculateCLOAchievement = (student, courseId, cloId) => {
  try {
    if (!student?.courses) return 0;

    const course = student.courses.find(
      (c) => String(c.courseId) === String(courseId)
    );
    if (!course?.assessments) return 0;

    let totalWeightedMarks = 0;
    let totalWeight = 0;

    course.assessments.forEach((assessment) => {
      assessment.questions?.forEach((question) => {
        question.clos?.forEach((clo) => {
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

    return totalWeight === 0 ? 0 : (totalWeightedMarks / totalWeight) * 100;
  } catch (error) {
    console.error("Error in calculateCLOAchievement:", error);
    return 0;
  }
};

const calculatePLOAchievement = (student, courseId, ploId) => {
  try {
    const courseMap = cloPloMap.find((c) => c.courseId === String(courseId));
    if (!courseMap?.clos) return 0;

    const relevantCLOs = courseMap.clos.filter((clo) => clo.ploId === ploId);
    if (relevantCLOs.length === 0) return 0;

    let totalWeightedAchievement = 0;
    let totalPloWeight = 0;

    relevantCLOs.forEach((clo) => {
      const cloAchievement = calculateCLOAchievement(
        student,
        courseId,
        clo.cloId
      );
      totalWeightedAchievement += (cloAchievement / 100) * clo.weight;
      totalPloWeight += clo.weight;
    });

    return totalPloWeight === 0
      ? 0
      : (totalWeightedAchievement / totalPloWeight) * 100;
  } catch (error) {
    console.error("Error in calculatePLOAchievement:", error);
    return 0;
  }
};

const getAchievementStatus = (value) => {
  if (value >= 70) return { text: "Achieved", style: styles.achievementText };
  if (value >= 40)
    return { text: "Partially Achieved", style: styles.partiallyAchievedText };
  return { text: "Not Achieved", style: styles.notAchievedText };
};

const calculateTotalMarks = (student, courseId) => {
  try {
    if (!student?.courses) return { obtained: 0 };

    const course = student.courses.find(
      (c) => String(c.courseId) === String(courseId)
    );
    if (!course?.assessments) return { obtained: 0 };

    let obtainedMarks = 0;

    course.assessments.forEach((assessment) => {
      obtainedMarks += assessment.obtainedMarks || 0;
    });

    return {
      obtained: obtainedMarks,
    };
  } catch (error) {
    console.error("Error in calculateTotalMarks:", error);
    return { obtained: 0 };
  }
};

const getCoursePLOs = (student, courseId) => {
  try {
    if (!student?.achievedPLOs || student.achievedPLOs.length === 0) {
      return [
        {
          plo: "N/A",
          status: "No Data",
          style: styles.notAchievedText,
        },
      ];
    }

    return student.achievedPLOs.map((achieved, index) => {
      const percentage = achieved ? 100 : 0;
      const status = getAchievementStatus(percentage);
      return {
        plo: `PLO${index + 1}`,
        status: status.text,
        style: status.style,
      };
    });
  } catch (error) {
    console.error("Error in getCoursePLOs:", error);
    return [
      {
        plo: "Error",
        status: "Calculation Failed",
        style: styles.notAchievedText,
      },
    ];
  }
};

// Helper function to get PLO achievement status
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
  return (
    <View>
      {showAssessmentName && (
        <Text style={styles.assessmentHeader}>
          {assessment.assessmentName} ({assessment.assessmentType})
        </Text>
      )}

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.questionCell]}>Question</Text>
          <Text style={styles.tableCell}>CLO Assigned</Text>
          <Text style={styles.tableCell}>CLO Achieved</Text>
          <Text style={styles.tableCell}>Marks Assigned</Text>
          <Text style={styles.tableCell}>Threshold</Text>
          <Text style={styles.tableCell}>Marks Achieved</Text>
          <Text style={styles.tableCell}>PLO Assigned</Text>
          <Text style={[styles.tableCell, styles.statusCell]}>PLO Status</Text>
        </View>

        {assessment.questions?.map((question, index) => {
          const assignedPLO = question.assignedPLO || `PLO${(index % 10) + 1}`;
          const ploStatus = getPLOAchievementStatus(student, assignedPLO);

          return (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.questionCell]}>
                Q{index + 1}
              </Text>
              <Text style={styles.tableCell}>
                {question.clos
                  .map((clo) => `${clo.cloId}: ${clo.cloWeight}%`)
                  .join("\n")}
              </Text>
              <Text style={styles.tableCell}>
                {question.clos
                  .map((clo) => {
                    const percentage =
                      (question.obtainedMarks / question.totalQuestionMarks) *
                      clo.cloWeight;
                    return `${clo.cloId}: ${Math.round(percentage)}%`;
                  })
                  .join("\n")}
              </Text>
              <Text style={styles.tableCell}>
                {question.totalQuestionMarks}
              </Text>
              <Text style={styles.tableCell}>{question.threshold}%</Text>
              <Text style={styles.tableCell}>{question.obtainedMarks}</Text>
              <Text style={styles.tableCell}>{assignedPLO}</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.statusCell,
                  ploStatus === "Achieved"
                    ? styles.achievementText
                    : styles.notAchievedText,
                ]}
              >
                {ploStatus}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// All Assessments Report Component for a single course - Updated version
const AllAssessmentsReport = ({ student, course }) => {
  return (
    <Document>
      {/* First page with header */}
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image
            style={styles.logoLeft}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5NxN6cDfvZhaFGjkftO-NzIEofkdi_bSGUw&s"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}> All Assessment OBE Report</Text>
            <Text style={styles.subtitle}>
              {course.courseId?.courseCode || "N/A"} -{" "}
              {course.courseId?.courseName || "N/A"}
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

        {course.assessments.map(
          (assessment, index) =>
            assessment.questions &&
            assessment.questions.length > 0 && (
              <View key={index} wrap={false}>
                <AssessmentTable
                  assessment={assessment}
                  student={student}
                  showAssessmentName={true}
                />
                {index < course.assessments.length - 1 && (
                  <View style={{ marginBottom: 15 }}></View>
                )}
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

const AllAssessmentsInOneTable = ({ student }) => {
  const coursesWithAssessments = student.courses?.filter(
    (course) => course.assessments?.some((a) => a.questions?.length > 0) || []
  );

  return (
    <Document>
      {/* First page with header */}
      {coursesWithAssessments.length > 0 && (
        <Page style={styles.page}>
          <View style={styles.header}>
            <Image
              style={styles.logoLeft}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5NxN6cDfvZhaFGjkftO-NzIEofkdi_bSGUw&s"
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>All Assessment OBE Report</Text>
              <Text style={styles.subtitle}>
                {coursesWithAssessments[0].courseId?.courseCode || "N/A"} -{" "}
                {coursesWithAssessments[0].courseId?.courseName || "N/A"}
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

          {coursesWithAssessments[0].assessments.map(
            (assessment, index) =>
              assessment.questions &&
              assessment.questions.length > 0 && (
                <View key={index} wrap={false}>
                  <AssessmentTable
                    assessment={assessment}
                    student={student}
                    showAssessmentName={true}
                  />
                  {index < coursesWithAssessments[0].assessments.length - 1 && (
                    <View style={{ marginBottom: 15 }}></View>
                  )}
                </View>
              )
          )}

          <View style={styles.footer}>
            <Text>Page 1 of {coursesWithAssessments.length}</Text>
            <Text>Generated on: {new Date().toLocaleDateString()}</Text>
            <Text>SIBA University - Examination Department</Text>
          </View>
        </Page>
      )}

      {/* Subsequent pages without header but with course title */}
      {coursesWithAssessments.slice(1).map((course, courseIndex) => (
        <Page key={course._id} style={styles.page}>
          {/* Course title only */}
          <View style={{ alignItems: "center", marginBottom: 15 }}>
            <Text style={styles.subtitle}>
              {course.courseId?.courseCode || "N/A"} -{" "}
              {course.courseId?.courseName || "N/A"}
            </Text>
          </View>

          {course.assessments.map(
            (assessment, index) =>
              assessment.questions &&
              assessment.questions.length > 0 && (
                <View key={index} wrap={false}>
                  <AssessmentTable
                    assessment={assessment}
                    student={student}
                    showAssessmentName={true}
                  />
                  {index < course.assessments.length - 1 && (
                    <View style={{ marginBottom: 15 }}></View>
                  )}
                </View>
              )
          )}

          <View style={styles.footer}>
            <Text>
              Page {courseIndex + 2} of {coursesWithAssessments.length}
            </Text>
            <Text>Generated on: {new Date().toLocaleDateString()}</Text>
            <Text>SIBA University - Examination Department</Text>
          </View>
        </Page>
      ))}
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
            <Text style={styles.title}>Assessment OBE Report</Text>
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

// Student Report Component - Updated to match batch report format
const StudentReportPDF = ({ student }) => {
  // Function to get standardized PLO data for a student
  const getStandardizedPLOs = () => {
    if (!student?.achievedPLOs || student.achievedPLOs.length === 0) {
      return [
        {
          plo: "N/A",
          status: "No Data",
          style: styles.notAchievedText,
        },
      ];
    }

    return student.achievedPLOs.map((isAchieved, index) => {
      const ploKey = `PLO${(index + 1).toString().padStart(2, "0")}`;
      const status = isAchieved ? "Achieved" : "Not Achieved";

      return {
        plo: ploKey,
        status: status,
        style: isAchieved ? styles.achievementText : styles.notAchievedText,
      };
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            style={styles.logoLeft}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5NxN6cDfvZhaFGjkftO-NzIEofkdi_bSGUw&s"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Student Comprehensive OBE Report</Text>
            <Text style={styles.studentInfo}>
              Batch: {student.studentBatch || "N/A"} - Section:{" "}
              {student.studentSection || "N/A"}
            </Text>
          </View>
          <Image
            style={styles.logoRight}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsCNIBPctM5RsLsEBsuMV8HhQZO_KSkysM_g&s"
          />
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.srNoCell}>#</Text>
            <Text style={styles.idCell}>CMS ID</Text>
            <Text style={styles.nameCell}>Student Name</Text>
            <Text style={styles.sectionCell}>Batch</Text>
            <Text style={styles.sectionCell}>Section</Text>
            <Text style={styles.ploCell}>PLO Achievement</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.srNoCell}>1</Text>
            <Text style={styles.idCell}>{student.studentId || "N/A"}</Text>
            <Text style={styles.nameCell}>
              {student.firstName || ""} {student.lastName || ""}
            </Text>
            <Text style={styles.sectionCell}>
              {student.studentBatch || "N/A"}
            </Text>
            <Text style={styles.sectionCell}>
              {student.studentSection || "N/A"}
            </Text>
            <Text style={styles.ploCell}>
              {getStandardizedPLOs().map((plo, i) => (
                <Text key={i} style={[styles.ploItem, plo.style]}>
                  {plo.plo}: {plo.status}
                  {i !== getStandardizedPLOs().length - 1 ? "\n" : ""}
                </Text>
              ))}
            </Text>
          </View>
        </View>

        {/* Course-wise details */}
        {student.courses?.map((course, courseIndex) => {
          const courseMap = cloPloMap.find(
            (c) => c.courseId === String(course.courseId)
          );
          if (!courseMap) return null;

          return (
            <View key={course._id} wrap={false}>
              {/* Course header */}
              <View style={styles.courseSeparator}>
                <Text style={styles.subtitle}>
                  {courseMap.courseCode} - {courseMap.courseName}
                </Text>
              </View>

              {/* CLO Achievement Table */}
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.srNoCell}>#</Text>
                  <Text style={styles.idCell}>CLO ID</Text>
                  <Text style={styles.sectionCell}>Achievement %</Text>
                  <Text style={styles.ploCell}>Status</Text>
                </View>

                {courseMap.clos.map((clo, cloIndex) => {
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
                      <Text style={styles.srNoCell}>{cloIndex + 1}</Text>
                      <Text style={styles.idCell}>{clo.cloId}</Text>
                      <Text style={styles.sectionCell}>
                        {achievement.toFixed(2)}%
                      </Text>
                      <Text style={[styles.ploCell, status.style]}>
                        {status.text}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Assessment Reports */}
              {course.assessments?.map((assessment, assessmentIndex) => (
                <View key={assessment._id} style={{ marginTop: 10 }}>
                  <Text style={styles.assessmentSeparator}>
                    Assessment: {assessment.assessmentName} (
                    {assessment.assessmentType})
                  </Text>
                  <AssessmentTable
                    assessment={assessment}
                    student={student}
                    showAssessmentName={false}
                  />
                </View>
              ))}

              {/* Add space between courses except for the last one */}
              {courseIndex < student.courses.length - 1 && (
                <View style={{ marginBottom: 20 }}></View>
              )}
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text>Generated on: {new Date().toLocaleDateString()}</Text>
          <Text>SIBA University - Examination Department</Text>
        </View>
      </Page>
    </Document>
  );
};

// Batch Report Component
const BatchReportPDF = ({ students, batchName }) => {
  const isAllBatches = batchName === "All Batches";

  // Function to get unique PLOs for a student with standardized formatting
  const getUniquePLOs = (student) => {
    if (!student?.achievedPLOs || student.achievedPLOs.length === 0) {
      return [
        {
          plo: "N/A",
          status: "No Data",
          style: styles.notAchievedText,
        },
      ];
    }

    const allPLOs = [];

    // Process achievedPLOs to standard format
    student.achievedPLOs.forEach((isAchieved, index) => {
      const ploNumber = index + 1;
      const ploKey = `PLO${ploNumber.toString().padStart(2, "0")}`; // Standardize to PLO01 format
      const status = isAchieved ? "Achieved" : "Not Achieved";

      allPLOs.push({
        plo: ploKey,
        status: status,
        style: isAchieved ? styles.achievementText : styles.notAchievedText,
      });
    });

    return allPLOs;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            style={styles.logoLeft}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5NxN6cDfvZhaFGjkftO-NzIEofkdi_bSGUw&s"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Batch OBE Report</Text>
            <Text style={styles.studentInfo}>
              {isAllBatches ? "All Batches" : `Batch: ${batchName}`} - Total
              Students: {students.length}
            </Text>
          </View>
          <Image
            style={styles.logoRight}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsCNIBPctM5RsLsEBsuMV8HhQZO_KSkysM_g&s"
          />
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.srNoCell}>#</Text>
            <Text style={styles.idCell}>CMS ID</Text>
            <Text style={styles.nameCell}>Student Name</Text>
            <Text style={styles.sectionCell}>Batch</Text>
            <Text style={styles.sectionCell}>Section</Text>
            <Text style={styles.ploCell}>PLO Achievement</Text>
          </View>

          {students.map((student, index) => {
            const plos = getUniquePLOs(student);

            return (
              <View style={styles.tableRow} key={student._id || index}>
                <Text style={styles.srNoCell}>{index + 1}</Text>
                <Text style={styles.idCell}>{student.studentId || "N/A"}</Text>
                <Text style={styles.nameCell}>
                  {student.firstName || ""} {student.lastName || ""}
                </Text>
                <Text style={styles.sectionCell}>
                  {student.studentBatch || "N/A"}
                </Text>
                <Text style={styles.sectionCell}>
                  {student.studentSection || "N/A"}
                </Text>
                <Text style={styles.ploCell}>
                  {plos.length > 0 ? (
                    plos.map((plo, i) => (
                      <Text key={i} style={[styles.ploItem, plo.style]}>
                        {plo.plo}: {plo.status}
                        {i !== plos.length - 1 ? "\n" : ""}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.notAchievedText}>No PLO Data</Text>
                  )}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text>Generated on: {new Date().toLocaleDateString()}</Text>
          <Text>SIBA University - Examination Department</Text>
        </View>
      </Page>
    </Document>
  );
};

// Section Report Component
const SectionReportPDF = ({ students, batchName, sectionName }) => {
  // Helper function to get standardized PLO data for a student
  const getStandardizedPLOs = (student) => {
    if (!student?.achievedPLOs || student.achievedPLOs.length === 0) {
      return [
        {
          plo: "N/A",
          status: "No Data",
          style: styles.notAchievedText,
        },
      ];
    }

    const uniquePLOs = [];
    const seenPLOs = new Set();

    // Process achievedPLOs to standard format and remove duplicates
    student.achievedPLOs.forEach((isAchieved, index) => {
      const ploNumber = index + 1;
      const ploKey = `PLO${ploNumber.toString().padStart(2, "0")}`; // Standardize to PLO01 format

      if (!seenPLOs.has(ploKey)) {
        seenPLOs.add(ploKey);
        const status = isAchieved ? "Achieved" : "Not Achieved";

        uniquePLOs.push({
          plo: ploKey,
          status: status,
          style: isAchieved ? styles.achievementText : styles.notAchievedText,
        });
      }
    });

    return uniquePLOs;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            style={styles.logoLeft}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5NxN6cDfvZhaFGjkftO-NzIEofkdi_bSGUw&s"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Section OBE Report</Text>
            <Text style={styles.studentInfo}>
              Batch: {batchName} - Section: {sectionName} - Total Students:{" "}
              {students.length}
            </Text>
          </View>
          <Image
            style={styles.logoRight}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsCNIBPctM5RsLsEBsuMV8HhQZO_KSkysM_g&s"
          />
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.srNoCell}>#</Text>
            <Text style={styles.idCell}>CMS ID</Text>
            <Text style={styles.nameCell}>Student Name</Text>
            <Text style={styles.sectionCell}>Batch</Text>
            <Text style={styles.sectionCell}>Section</Text>
            <Text style={styles.ploCell}>PLO Achievement</Text>
          </View>

          {students.map((student, index) => {
            const studentPLOs = getStandardizedPLOs(student);

            return (
              <View style={styles.tableRow} key={student._id || index}>
                <Text style={styles.srNoCell}>{index + 1}</Text>
                <Text style={styles.idCell}>{student.studentId || "N/A"}</Text>
                <Text style={styles.nameCell}>
                  {student.firstName || ""} {student.lastName || ""}
                </Text>
                <Text style={styles.sectionCell}>
                  {student.studentBatch || "N/A"}
                </Text>
                <Text style={styles.sectionCell}>
                  {student.studentSection || "N/A"}
                </Text>
                <Text style={styles.ploCell}>
                  {studentPLOs.map((plo, i) => (
                    <Text key={i} style={[styles.ploItem, plo.style]}>
                      {plo.plo}: {plo.status}
                      {i !== studentPLOs.length - 1 ? "\n" : ""}
                    </Text>
                  ))}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text>Generated on: {new Date().toLocaleDateString()}</Text>
          <Text>SIBA University - Examination Department</Text>
        </View>
      </Page>
    </Document>
  );
};

// Main NumericalReport component with all functionality
const ReportGeneration = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("all-batches");
  const [selectedSection, setSelectedSection] = useState("all-sections");
  const [selectedStudent, setSelectedStudent] = useState("all-students");
  const [selectedCourse, setSelectedCourse] = useState("all-courses");
  const [selectedAssessment, setSelectedAssessment] =
    useState("all-assessments");
  const [reportType, setReportType] = useState("batch");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courseNames, setCourseNames] = useState({});

  const params = useParams();
  const departmentId = params.id;

  const getCourseInfo = async (id) => {
    try {
      // Handle both string and object course IDs
      const courseId = typeof id === "object" ? id._id : id;
      const response = await fetch(
        `https://iba-nceac.site/api/data/course/id/${courseId}`,
        { method: "GET" }
      );
      if (response.ok) {
        const data = await response.json();
        return data.courseName;
      }
    } catch (error) {
      console.error(`Error fetching course info: ${error}`);
    }
    return "Unknown Course";
  };

  useEffect(() => {
    const fetchCourseNames = async () => {
      const studentCourses = getCoursesForStudent(selectedStudent);
      const namesMap = {};
      for (const course of studentCourses) {
        const name = await getCourseInfo(course.courseId);
        namesMap[course._id] = name;
      }
      setCourseNames(namesMap);
    };
    if (selectedStudent) fetchCourseNames();
  }, [selectedStudent]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch students and batches in parallel
        const [studentsRes, batchesRes] = await Promise.all([
          axios.get(
            `https://iba-nceac.site/api/students/allStudents/${departmentId}`
          ),
          axios.get(
            `https://iba-nceac.site/api/batches/all-batches/${departmentId}`
          ),
        ]);

        // Process students to include complete course information
        const studentsWithCourses = await Promise.all(
          studentsRes.data.map(async (student) => {
            if (!student.courses || student.courses.length === 0) {
              return student;
            }

            const coursesWithDetails = await Promise.all(
              student.courses.map(async (course) => {
                try {
                  // Ensure we're using the string ID, not the object
                  const courseIdString =
                    typeof course.courseId === "object"
                      ? course.courseId._id
                      : course.courseId;

                  const courseRes = await axios.get(
                    `https://iba-nceac.site/api/data/course/id/${courseIdString}`
                  );

                  return {
                    ...course,
                    courseId: {
                      _id: courseIdString,
                      courseCode: courseRes.data.courseCode || "N/A",
                      courseName: courseRes.data.courseName || "N/A",
                    },
                  };
                } catch (error) {
                  console.error(
                    `Error fetching course ${course.courseId}:`,
                    error
                  );
                  const courseIdString =
                    typeof course.courseId === "object"
                      ? course.courseId._id
                      : course.courseId;

                  return {
                    ...course,
                    courseId: {
                      _id: courseIdString,
                      courseCode: "N/A",
                      courseName: "Error loading course",
                    },
                  };
                }
              })
            );

            return {
              ...student,
              courses: coursesWithDetails,
            };
          })
        );

        // Filter valid students and update state
        const validStudents = studentsWithCourses.filter(
          (s) => s.studentSection
        );
        const uniqueSections = [
          ...new Set(validStudents.map((s) => s.studentSection)),
        ];

        setStudents(validStudents);
        setBatches(batchesRes.data);
        setSections(uniqueSections);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (departmentId) {
      fetchData();
    }
  }, [departmentId]);

  // Helper functions
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

  // Function to generate reports for all students in the selected section
  const generateSectionReports = () => {
    if (!selectedBatch || !selectedSection) return null;

    const sectionStudents = getStudentsForBatchAndSection(
      selectedBatch,
      selectedSection
    );

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">
          Generate Reports for All Students in {selectedSection}
        </h3>
        <div className="flex flex-wrap gap-2">
          <PDFDownloadLink
            document={
              <SectionReportPDF
                students={sectionStudents}
                batchName={selectedBatch}
                sectionName={selectedSection}
              />
            }
            fileName={`${selectedBatch}_${selectedSection}_Numerical_Report.pdf`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            {({ loading }) =>
              loading ? "Preparing document..." : "Download Section Report"
            }
          </PDFDownloadLink>

          {sectionStudents.map((student) => (
            <PDFDownloadLink
              key={student._id}
              document={<StudentReportPDF student={student} />}
              fileName={`${student.studentId}_Numerical_Report.pdf`}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              {({ loading }) =>
                loading ? "Preparing..." : `${student.studentId} Report`
              }
            </PDFDownloadLink>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div className="text-center py-8">Loading data...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-[#1F2C73] mb-6">
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
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <option value="all-batches">All Batches</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch.batchName}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-8">
              {selectedBatch === "all-batches" ? (
                <PDFDownloadLink
                  document={
                    <BatchReportPDF
                      students={students}
                      batchName="All Batches"
                    />
                  }
                  fileName="All_Batches_Numerical_Report.pdf"
                  className="bg-[#1F2C73] text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                  {({ loading }) =>
                    loading
                      ? "Preparing document..."
                      : "Download All Batches Report"
                  }
                </PDFDownloadLink>
              ) : (
                <PDFDownloadLink
                  document={
                    <BatchReportPDF
                      students={students.filter(
                        (s) => s.studentBatch === selectedBatch
                      )}
                      batchName={selectedBatch}
                    />
                  }
                  fileName={`${selectedBatch}_Numerical_Report.pdf`}
                  className="bg-[#1F2C73] text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                  {({ loading }) =>
                    loading ? "Preparing document..." : "Download Batch Report"
                  }
                </PDFDownloadLink>
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
                  setSelectedSection("all-sections");
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
                  <option value="all-sections">All Sections</option>
                  {getSectionsForBatch(selectedBatch).map((section, index) => (
                    <option key={index} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedBatch && selectedSection && (
              <>
                <div className="mt-8">
                  <PDFDownloadLink
                    document={
                      <SectionReportPDF
                        students={
                          selectedSection === "all-sections"
                            ? students.filter(
                                (s) => s.studentBatch === selectedBatch
                              )
                            : students.filter(
                                (s) =>
                                  s.studentBatch === selectedBatch &&
                                  s.studentSection === selectedSection
                              )
                        }
                        batchName={selectedBatch}
                        sectionName={selectedSection}
                      />
                    }
                    fileName={`${selectedBatch}_${selectedSection}_Numerical_Report.pdf`}
                    className="bg-[#1F2C73] text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    {({ loading }) =>
                      loading
                        ? "Preparing document..."
                        : "Download Section Report"
                    }
                  </PDFDownloadLink>
                </div>

                {selectedSection !== "all-sections" && generateSectionReports()}
              </>
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
                      {student.firstName} {student.lastName} (
                      {student.studentId})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedBatch && selectedSection && selectedStudent && (
              <div className="mt-8">
                {selectedStudent === "all-students" ? (
                  <PDFDownloadLink
                    document={
                      <BatchReportPDF
                        students={getStudentsForBatchAndSection(
                          selectedBatch,
                          selectedSection
                        )}
                        batchName={`${selectedBatch} - ${selectedSection}`}
                      />
                    }
                    fileName={`${selectedBatch}_${selectedSection}_Students_Numerical_Report.pdf`}
                    className="bg-[#1F2C73] text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    {({ loading }) =>
                      loading
                        ? "Preparing document..."
                        : "Download All Students Report"
                    }
                  </PDFDownloadLink>
                ) : (
                  <PDFDownloadLink
                    document={
                      <StudentReportPDF
                        student={students.find(
                          (s) => s._id === selectedStudent
                        )}
                      />
                    }
                    fileName={`${selectedStudent}_Numerical_Report.pdf`}
                    className="bg-[#1F2C73] text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    {({ loading }) =>
                      loading
                        ? "Preparing document..."
                        : "Download Student Report"
                    }
                  </PDFDownloadLink>
                )}
              </div>
            )}
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
                      {course.courseId?.courseCode || "N/A"} -{" "}
                      {course.courseId?.courseName || "Loading..."}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedBatch &&
              selectedSection &&
              selectedStudent &&
              selectedCourse && (
                <div className="mt-8">
                  {selectedCourse === "all-courses" ? (
                    <PDFDownloadLink
                      document={
                        <AllAssessmentsInOneTable
                          student={students.find(
                            (s) => s._id === selectedStudent
                          )}
                        />
                      }
                      fileName={`${selectedStudent}_All_Courses_Numerical_Report.pdf`}
                      className="bg-[#1F2C73] text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                      {({ loading }) =>
                        loading
                          ? "Preparing document..."
                          : "Download All Courses Report"
                      }
                    </PDFDownloadLink>
                  ) : (
                    <PDFDownloadLink
                      document={
                        <AllAssessmentsReport
                          student={students.find(
                            (s) => s._id === selectedStudent
                          )}
                          course={getCoursesForStudent(selectedStudent).find(
                            (c) => c._id === selectedCourse
                          )}
                        />
                      }
                      fileName={`${selectedStudent}_${selectedCourse}_Numerical_Report.pdf`}
                      className="bg-[#1F2C73] text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                      {({ loading }) =>
                        loading
                          ? "Preparing document..."
                          : "Download Course Report"
                      }
                    </PDFDownloadLink>
                  )}
                </div>
              )}
          </>
        )}

        {reportType === "assessment" && (
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

            {selectedBatch &&
              selectedSection &&
              selectedStudent &&
              selectedCourse &&
              selectedAssessment && (
                <div className="mt-8">
                  {selectedAssessment === "all-assessments" ? (
                    <PDFDownloadLink
                      document={
                        <AllAssessmentsReport
                          student={students.find(
                            (s) => s._id === selectedStudent
                          )}
                          course={getCoursesForStudent(selectedStudent).find(
                            (c) => c._id === selectedCourse
                          )}
                        />
                      }
                      fileName={`${selectedStudent}_${selectedCourse}_All_Assessments_Numerical_Report.pdf`}
                      className="bg-[#1F2C73] text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                      {({ loading }) =>
                        loading
                          ? "Preparing document..."
                          : "Download All Assessments Report"
                      }
                    </PDFDownloadLink>
                  ) : (
                    <PDFDownloadLink
                      document={
                        <SingleAssessmentReport
                          student={students.find(
                            (s) => s._id === selectedStudent
                          )}
                          course={
                            getCoursesForStudent(selectedStudent).find(
                              (c) => c._id === selectedCourse
                            ).courseId
                          }
                          assessment={getAssessmentsForStudentCourse(
                            selectedStudent,
                            selectedCourse
                          ).find((a) => a._id === selectedAssessment)}
                        />
                      }
                      fileName={`${selectedStudent}_${selectedCourse}_${selectedAssessment}_Numerical_Report.pdf`}
                      className="bg-[#1F2C73] text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                      {({ loading }) =>
                        loading
                          ? "Preparing document..."
                          : "Download Assessment Report"
                      }
                    </PDFDownloadLink>
                  )}
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportGeneration;
