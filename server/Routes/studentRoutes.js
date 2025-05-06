import express from "express";
import multer from "multer";
import { uploadExcelFile } from "../Controllers/authController.js";
import {
  getStudentsByBatchandSection,
  getStudentInfo,
  getEnrolledCoursesByStudent,
  getCourseById,
  updateStudentAssessmentMarks,
} from "../Controllers/authController.js";
import Student from "../Models/student-model.js";
import Course from "../Models/course-model.js";
const router = express.Router();

// Multer configuration for file upload
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage });

// Route to handle Excel upload
router.post("/upload", upload.single("file"), uploadExcelFile);
router.get("/fetchByBatch", getStudentsByBatchandSection);

router.put("/:id/add-course", async (req, res) => {
  const { id } = req.params;
  const { courseId } = req.body;

  try {
    // Validate student exists
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Validate course exists and get full details with assessments
    const course = await Course.findById(courseId)
      .populate("assessments") // Populate assessments
      .populate("instructorId", "name")
      .populate("departmentId", "departmentName");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check for duplicate enrollment
    const isAlreadyEnrolled = student.courses.some((c) =>
      c.courseId.equals(course._id)
    );
    if (isAlreadyEnrolled) {
      return res.status(400).json({
        message: "Student already enrolled in this course",
      });
    }

    // Prepare assessments array with course assessments
    const assessments = course.assessments.map((assessment) => ({
      assessmentId: assessment._id,
      assessmentName: assessment.assessmentName,
      assessmentType: assessment.assessmentType,
      totalMarks: assessment.totalMarks,
      obtainedMarks: 0, // Initialize with 0 marks
      questions: assessment.questions.map((question) => ({
        questionNumber: question.questionNumber,
        totalQuestionMarks: question.totalQuestionMarks,
        threshold: question.threshold,
        assignedPLO: question.assignedPLO,
        obtainedMarks: 0, // Initialize with 0 marks
        clos: question.clos.map((clo) => ({
          cloId: clo.cloId,
          cloWeight: clo.weight,
        })),
      })),
    }));

    // Prepare the complete course object with assessments
    const courseToAdd = {
      instructorId: course.instructorId,
      departmentId: course.departmentId,
      courseId: course._id,
      assessments: assessments, // Include populated assessments
    };

    // Add to student's courses
    student.courses.push(courseToAdd);
    await student.save();

    // Add student to course's students array
    await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { students: id } },
      { new: true }
    );

    return res.status(200).json({
      message: "Course added successfully with assessments",
      updatedStudent: student,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.get("/id/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("courses.courseId")
      .populate("courses.assessments.assessmentId") // Populate assessment details
      .exec();

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Error fetching student" });
  }
});

router.post("/add-student", async (req, res) => {
  try {
    const studentData = req.body;
    const newStudent = new Student(studentData);
    await newStudent.save();
    res
      .status(201)
      .json({ message: "Student added successfully!", student: newStudent });
  } catch (error) {
    res.status(500).json({ message: "Error adding student", error });
  }
});

router.get("/info/:id", getStudentInfo);
router.get("/student/:id", getEnrolledCoursesByStudent);

router.get("/course/id/:id", async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findById(courseId)
      .populate("assessments")
      .populate("instructorId", "name")
      .populate("departmentId", "departmentName");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({
      ...course.toObject(),
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/course/id/:id", getCourseById);

router.put(
  "/:studentId/courses/:courseId/assessments/:assessmentId",
  updateStudentAssessmentMarks
);

router.get("/allStudents/:departmentId", async (req, res) => {
  const { departmentId } = req.params;

  try {
    const students = await Student.find({ departmentId });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
});

router.get("/allStudents", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
});

router.post("/unenroll/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const { studentIds } = req.body;

  if (!studentIds || !Array.isArray(studentIds)) {
    return res.status(400).json({ message: "Invalid student IDs provided" });
  }

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $pull: { students: { $in: studentIds } } },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updateResult = await Student.updateMany(
      { _id: { $in: studentIds } },
      { $pull: { courses: { courseId: courseId } } }
    );

    res.status(200).json({
      message: "Students unenrolled successfully",
      course: updatedCourse,
      studentsUpdated: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error("Error unenrolling students:", error);
    res.status(500).json({
      message: "Error unenrolling students",
      error: error.message,
    });
  }
});

router.get("/:batchId/:section", async (req, res) => {
  const { batchId, section } = req.params;

  try {
    const students = await Student.find({
      studentBatch: batchId,
      studentSection: section,
    });

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error fetching students" });
  }
});
// PUT /api/students/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { newSection } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { studentSection: newSection },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student section:", error);
    res.status(500).json({ message: "Server error updating section" });
  }
});
// PUT /api/students/:id/updatePLO
router.put("/:id/updatePLO", async (req, res) => {
  try {
    const studentId = req.params.id;

    // Fetch student from DB
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Initialize an array of 12 PLOs with default "0"
    const achievedPLOs = Array(12).fill("0");

    student.courses.forEach((course) => {
      course.assessments.forEach((assessment) => {
        assessment.questions.forEach((question) => {
          const { totalQuestionMarks, obtainedMarks, threshold, assignedPLO } =
            question;

          const ploIndex = parseInt(assignedPLO?.replace("PLO", ""), 10) - 1;
          if (
            !isNaN(ploIndex) &&
            obtainedMarks >= (threshold / 100) * totalQuestionMarks
          ) {
            achievedPLOs[ploIndex] = "1";
          }
        });
      });
    });

    // Update achievedPLOs using findOneAndUpdate (no .save, no version error)
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: studentId },
      { $set: { achievedPLOs } },
      { new: true }
    );

    res.json({
      message: "PLOs updated successfully",
      PLO: updatedStudent.achievedPLOs,
    });
  } catch (error) {
    console.error("Error updating PLOs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/department/:id", async (req, res) => {
  try {
    const departmentId = req.params.id;

    // Correct usage of findById
    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
