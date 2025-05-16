import express from "express";
import Course from "../Models/course-model.js";
import Student from "../Models/student-model.js";
const router = express.Router();
import mongoose from "mongoose";

// GET /api/dashboard/:instructorId
router.get("/:instructorId", async (req, res) => {
  const { instructorId } = req.params;

  if (!instructorId) {
    return res.status(400).json({ error: "instructorId is required" });
  }

  try {
    const courses = await Course.find({ instructorId });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// import the Student model

router.post("/students/by-courses", async (req, res) => {
  const { courseIds } = req.body;
  console.log(courseIds);
  if (!Array.isArray(courseIds)) {
    return res.status(400).json({ error: "courseIds must be an array" });
  }

  try {
    const objectIds = courseIds.map((id) => new mongoose.Types.ObjectId(id));
    const students = await Student.find({
      "courses.courseId": { $in: objectIds },
    });
    console.log(students);
    res.json(students);
  } catch (error) {
    console.error("Error fetching students by courseIds:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
