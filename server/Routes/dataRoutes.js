import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import {
  instructor,
  instructorById,
  researchById,
  research,
  deleteResearch,
  updateResearchPaper,
  createCourse,
  getAllCoursesByInstructorId,
  getAllCourses,
  updateCourseById,
  updateCoursePrerequisites,
  editOfficeLocation,
  editOfficeNumber,
  deleteOfficeNumber,
  deleteOfficeLocation,
  department,
  getAllDepartments,
  getSpecificCourseByCourseId,
  getDepartmentById,
  ongoingCourses,
  getAllInstructors,
  editCLO,
  deleteCLO,
  updatePLO,
  deletePLO,
  addNewCLO,
  addNewPLO,
  updateDepartmentSchema,
  deleteDepartmentSchema,
  uploadExcelFile,
} from "../Controllers/authController.js";
import Course from "../Models/course-model.js";
import Instructor from "../Models/instructor-model.js";
const router = express.Router();

router.post("/instructors", instructor);
router.get("/instructors", getAllInstructors);
router.get("/instructor/:id", instructorById);
router.put("/instructor/:id", async (req, res, next) => {
  const { action } = req.body;

  if (action === "editOfficeNumber") {
    return editOfficeNumber(req, res, next);
  } else if (action === "editOfficeLocation") {
    return editOfficeLocation(req, res, next);
  } else if (action === "deleteOfficeNumber") {
    return deleteOfficeNumber(req, res, next);
  } else if (action === "deleteOfficeLocation") {
    return deleteOfficeLocation(req, res, next);
  }
  res.status(400).send("Invalid action");
});
// In your router file (e.g., routes.js)
router.post("/research", research);
router.get("/research/:id", researchById);
router.delete("/research/:id", deleteResearch); // Changed from :paperId to :id
router.put("/research/:id", updateResearchPaper); // Changed from :paperId to :id

router.post("/course/:instructorId", createCourse);
router.get("/course/instructor/:instructorId", getAllCoursesByInstructorId);
router.get("/course/id/:courseId", getSpecificCourseByCourseId);
router.get("/courses", getAllCourses);
router.put("/course/id/:courseId", updateCourseById);
router.put("/course/id/:courseId/prerequisites", updateCoursePrerequisites);
router.put("/course/:courseId/add-clo", addNewCLO);
router.put("/course/:courseId/clo", editCLO);
router.delete("/course/:courseId/delete-clo", deleteCLO);
// DELETE /courses/:courseId
router.delete("/courses/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.post("/department", department);
router.get("/departments", getAllDepartments);
router.get("/department/:departmentId", getDepartmentById);
router.get("/department/id/:departmentId", ongoingCourses);
router.put("/department/:id/plo", updatePLO);
router.delete("/department/:id/plo", deletePLO);
router.put("/department/:departmentId/add-plo", addNewPLO);
router.put("/department/:id/schema", updateDepartmentSchema);
router.delete("/department/:id/schema", deleteDepartmentSchema);
// backend/routes/instructor.js
router.put("/instructor/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { action, ...fields } = req.body;

  try {
    let update = {};
    if (action?.startsWith("edit")) {
      update = fields;
    } else if (action?.startsWith("delete")) {
      const key = Object.keys(fields)[0];
      update[key] = "";
    }

    const updatedInstructor = await Instructor.findByIdAndUpdate(id, update, {
      new: true,
    });

    res.status(200).json(updatedInstructor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating instructor" });
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post("/upload", upload.single("file"), uploadExcelFile);
// router.post('/api/students/upload', uploadExcelFile )



export default router;
