// authController.js

import bcrypt from "bcryptjs"; // Import bcrypt
import Instructor from "../Models/instructor-model.js";
import Research from "../Models/research-model.js";
import Department from "../Models/department-model.js";
import xlsx from "xlsx";
import Student from "../Models/student-model.js";
import Batch from "../Models/batch-model.js";
import mongoose from "mongoose";
// Function to read the users.json file and parse it
import Accreditation from "../Models/accreditation-model.js"; // adjust path as needed

// Backend: Updated getAccreditation controller
// Backend: Updated getAccreditation controller

export const getAllBatchesById = async (req, res) => {
  const { id } = req.params; // department ID
  try {
    const batches = await Batch.find({ departmentId: id }); // Filter by departmentId
    if (batches.length === 0) {
      return res
        .status(404)
        .json({ msg: "No batches found for this department" });
    }
    res.status(200).json(batches);
  } catch (error) {
    console.error("Error fetching all batches:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
export const getAccreditation = async (req, res) => {
  const { departmentId } = req.params; // Get departmentId from request parameters

  try {
    // Fetch accreditation data based on departmentId
    const accreditation = await Accreditation.findOne({ departmentId });
    console.log(accreditation);
    if (!accreditation) {
      return res
        .status(404)
        .json({ msg: "No accreditation data found for this department." });
    }

    res.status(200).json(accreditation);
  } catch (error) {
    console.error("Error fetching accreditation data:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const addAccreditationData = async (req, res) => {
  try {
    const data = req.body;

    const newRecord = new Accreditation(data);
    await newRecord.save();

    res.status(201).json({
      message: "Accreditation data added successfully",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error adding accreditation data:", error);
    res.status(500).json({
      message: "Failed to add accreditation data",
      error: error.message,
    });
  }
};

import jwt from "jsonwebtoken";
// Login Controller
export const login = async (req, res) => {
  const { userID, password } = req.body;
  console.log("Received login request:", { userID, password });

  try {
    const user = await Instructor.findOne({ userID });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      role: user.role,
      object_id: user._id,
      token, // Send token to frontend
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const studentLogin = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    // Find student by studentId
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Create JWT token (without role)
    const token = jwt.sign(
      {
        id: student._id,
        studentId: student.studentId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      success: true,
      token,
      studentId: student.studentId,
      object_id: student._id,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Student login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
};

// logout controller
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      path: "/", // Ensure it clears globally
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const instructor = async (req, res) => {
  try {
    const {
      userID,
      password,
      firstName,
      lastName,
      email,
      gender,
      cnicNumber,
      contactNumber,
      dateOfBirth,
      city,
      districtOfDomicile,
      province,
      religion,
      officeNumber,
      officeLocation,
      designation,
      role,
      prefix,
    } = req.body;

    // Validate firstName
    if (!firstName || typeof firstName !== "string" || firstName.length > 50) {
      return res.status(400).json({
        msg: "Invalid firstName. It should be a string and less than 50 characters.",
      });
    }

    // Validate lastName
    if (!lastName || typeof lastName !== "string" || lastName.length > 50) {
      return res.status(400).json({
        msg: "Invalid lastName. It should be a string and less than 50 characters.",
      });
    }

    // Validate INS-id format (case-insensitive)
    const insIdPattern = /^ins-\d+$/i;
    if (!userID || !insIdPattern.test(userID)) {
      return res.status(400).json({
        msg: "Invalid INS-id format. Correct format: INS- followed by numbers (e.g., INS-12345).",
      });
    }

    // Validate password length and complexity
    if (!password || password.length < 8) {
      return res.status(400).json({
        msg: "Invalid password. Password must be at least 8 characters long.",
      });
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      return res.status(400).json({ msg: "Invalid email format." });
    }

    // Validate CNIC Number format
    const cnicPattern = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
    if (!cnicNumber || !cnicPattern.test(cnicNumber)) {
      return res
        .status(400)
        .json({ msg: "Invalid CNIC format. Correct format: 12345-1234567-1." });
    }

    // Create a new instructor in the database
    const instructorCreated = await Instructor.create({
      userID: userID.toUpperCase(), // Convert to uppercase before saving
      password,
      firstName,
      lastName,
      email,
      gender,
      cnicNumber,
      contactNumber,
      dateOfBirth,
      city,
      districtOfDomicile,
      province,
      religion,
      officeNumber,
      officeLocation,
      designation,
      role,
      prefix,
    });

    res.status(201).json({
      msg: "Instructor created successfully",
    });
  } catch (error) {
    console.error("Error in instructor creation:", error);
    res.status(500).json({
      msg: "Internal server error, instructor creation unsuccessful",
      error: error.message,
    });
  }
};

// Login controller with case-insensitive userID matching
export const loginInstructor = async (req, res) => {
  try {
    const { userID, password } = req.body;

    // Find instructor with case-insensitive userID
    const instructor = await Instructor.findOne({
      userID: { $regex: new RegExp(`^${userID}$`, "i") },
    });

    if (!instructor) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await instructor.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    res.status(200).json({
      msg: "Login successful",
      instructor: {
        userID: instructor.userID,
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        email: instructor.email,
        role: instructor.role,
      },
    });
  } catch (error) {
    console.error("Error in instructor login:", error);
    res.status(500).json({
      msg: "Internal server error during login",
      error: error.message,
    });
  }
};
// Get Instructor By ID
export const instructorById = async (req, res) => {
  try {
    const instructorId = req.params.id;
    const instructor = await Instructor.findById(instructorId);

    if (!instructor) {
      return res.status(404).json({ msg: "Instructor not found" });
    }

    res.status(200).json(instructor);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const deleteOfficeNumber = async (req, res) => {
  const { id } = req.params;
  const { officeNumber } = req.body;

  console.log("Received ID:", id);
  console.log("Received officeNumber:", officeNumber);

  try {
    const updatedInstructor = await Instructor.findByIdAndUpdate(
      id,
      { officeNumber: officeNumber || "" },
      { new: true }
    );

    if (!updatedInstructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    console.log("Updated Instructor:", updatedInstructor);
    res.status(200).json(updatedInstructor);
  } catch (error) {
    console.error("Error updating Office Number:", error);
    res
      .status(500)
      .json({ message: "Error updating instructor's office number", error });
  }
};
export const editOfficeNumber = async (req, res) => {
  const { id } = req.params;
  const { officeNumber } = req.body;

  if (!officeNumber || typeof officeNumber !== "string") {
    return res.status(400).json({ message: "Invalid office number" });
  }

  try {
    const updatedInstructor = await Instructor.findByIdAndUpdate(
      id,
      { officeNumber }, // Update with the provided value
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedInstructor);
  } catch (error) {
    res.status(500).json({
      message: "Error updating instructor's office number",
      error,
    });
  }
};
export const editOfficeLocation = async (req, res) => {
  const { id } = req.params;
  const { officeLocation } = req.body;

  if (!officeLocation || typeof officeLocation !== "string") {
    return res.status(400).json({ message: "Invalid office location" });
  }

  try {
    const updatedInstructor = await Instructor.findByIdAndUpdate(
      id,
      { officeLocation }, // Update with the provided value
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedInstructor);
  } catch (error) {
    res.status(500).json({
      message: "Error updating instructor's office location",
      error,
    });
  }
};

export const deleteOfficeLocation = async (req, res) => {
  const { id } = req.params;
  const { officeLocation } = req.body;

  try {
    const updatedInstructor = await Instructor.findByIdAndUpdate(
      id,
      { officeLocation: officeLocation || "" }, // Ensure it sets to an empty string if provided
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedInstructor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating instructor's office location", error });
  }
};

export const research = async (req, res) => {
  try {
    const {
      doiLink,
      paperTitle,
      researchGateLink,
      googleScholarLink,
      instructorId,
    } = req.body;

    // Validate if instructorId exists in the Instructor collection
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(400).json({ msg: "Instructor not found" });
    }

    // Create the research paper
    const researchCreated = await Research.create({
      doiLink,
      paperTitle,
      researchGateLink: researchGateLink || undefined, // Set to undefined if empty string
      googleScholarLink: googleScholarLink || undefined, // Set to undefined if empty string
      instructorId,
    });

    // Send success response
    res.status(201).json({
      msg: "Research Added successfully",
      research: researchCreated,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        msg: "Validation error",
        errors,
      });
    }
    res.status(500).json({
      msg: "Internal server error, research add unsuccessful",
      error: error.message,
    });
  }
};

export const updateResearchPaper = async (req, res) => {
  const { id } = req.params;
  const { doiLink, paperTitle, researchGateLink, googleScholarLink } = req.body;

  try {
    // Validate ID format first
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid research paper ID",
        details: "The provided ID is not a valid MongoDB ObjectId",
      });
    }

    // Find the research paper
    const researchPaper = await Research.findById(id);
    if (!researchPaper) {
      return res.status(404).json({
        error: "Research paper not found",
        details: `No research paper found with ID: ${id}`,
      });
    }

    // Rest of your validation and update logic...
    // ... (keep the existing validation code)

    // Update fields
    const updateData = {
      ...(doiLink && { doiLink }),
      ...(paperTitle && { paperTitle }),
      researchGateLink: researchGateLink || null,
      googleScholarLink: googleScholarLink || null,
    };

    const updatedPaper = await Research.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Research paper updated successfully",
      research: updatedPaper,
    });
  } catch (error) {
    console.error("Error updating research paper:", error);
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        error: "Validation error",
        details: errors,
      });
    }
    return res.status(500).json({
      error: "An error occurred while updating the research paper",
      details: error.message,
    });
  }
};
export const researchById = async (req, res) => {
  try {
    const instructorId = req.params.id;
    const research = await Research.find({ instructorId });

    if (!research || research.length === 0) {
      return res
        .status(404)
        .json({ msg: "No research papers found for this instructor" });
    }

    res.status(200).json(research);
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteResearch = async (req, res) => {
  try {
    const { id } = req.params; // Now using MongoDB _id

    // Find and delete the research paper
    const researchToDelete = await Research.findByIdAndDelete(id);

    if (!researchToDelete) {
      return res.status(404).json({ msg: "Research paper not found" });
    }

    res.status(200).json({
      msg: "Research paper deleted successfully",
      deletedResearch: researchToDelete,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Internal server error, delete unsuccessful",
      error: error.message,
    });
  }
};

//For Courses

import Course from "../Models/course-model.js"; // Change this based on your actual model path

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { instructorId } = req.params; // Get the instructorId from the URL
    const {
      departmentName,
      courseName,
      courseType,
      courseCode,
      creditHours,
      prerequisites,
      courseDescription,
      startingDate,
      endingDate,
      CLO,
      students,
      departmentId,
      assessments,
      PLO,
    } = req.body;

    // Validate instructorId exists
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({ msg: "Invalid instructor ID" });
    }

    // Check if the instructor exists (optional, but good practice)
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ msg: "Instructor not found" });
    }

    // Create the course
    const courseCreated = await Course.create({
      departmentName,
      courseName,
      courseType,
      courseCode,
      creditHours,
      prerequisites,
      courseDescription,
      startingDate,
      endingDate,
      CLO,
      students,
      instructorId: req.params.instructorId,
      departmentId,
      assessments,
      PLO,
    });

    res.status(201).json({
      msg: "Course created successfully",
      course: courseCreated,
    });
  } catch (error) {
    console.error("Error in course creation:", error.message);
    res.status(500).json({
      msg: "Internal server error, course creation unsuccessful",
      error: error.message,
    });
  }
};

// Get Course by ID
export const getAllCoursesByInstructorId = async (req, res) => {
  try {
    const instructorId = req.params.instructorId;
    const course = await Course.find({
      instructorId: instructorId,
    });

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching all courses:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
// Update Course by ID
export const updateCourseById = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const updates = req.body;

    console.log("Course ID:", courseId);
    console.log("Updates:", updates);

    // Step 1: Update the course
    const course = await Course.findByIdAndUpdate(courseId, updates, {
      new: true,
    });

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Step 2: Check if there are student updates
    if (updates.studentUpdates && Array.isArray(updates.studentUpdates)) {
      const studentUpdatePromises = updates.studentUpdates.map(
        async (studentUpdate) => {
          // Ensure the studentId and the update are valid
          if (studentUpdate.studentId) {
            const student = await Student.findById(studentUpdate.studentId);
            if (student) {
              // Update the student based on the studentId
              await Student.findByIdAndUpdate(
                studentUpdate.studentId,
                studentUpdate.updateFields,
                {
                  new: true,
                }
              );
            }
          }
        }
      );

      // Wait for all student updates to complete
      await Promise.all(studentUpdatePromises);

      res.status(200).json({
        msg: "Course and student records updated successfully",
        course,
      });
    } else {
      // If no student updates are provided
      res.status(200).json({ msg: "Course updated successfully", course });
    }
  } catch (error) {
    console.error("Error updating course and students:", error);
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export const updateCoursePrerequisites = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Validate if courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ msg: "Invalid course ID" });
    }

    // Find and update the course by ID, setting the prerequisites field to an empty string
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $set: { prerequisites: "" } },
      { new: true } // Return the updated course
    );

    // If no course was found
    if (!updatedCourse) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Step 2: Update the prerequisites for all students enrolled in this course
    const students = await Student.find({ "courses.courseId": courseId });

    let modifiedCount = 0;

    for (const student of students) {
      const courseEntry = student.courses.find((c) =>
        c.courseId.equals(courseId)
      );

      if (courseEntry) {
        courseEntry.prerequisites = ""; // Set prerequisites to empty string
        modifiedCount++;
        await student.save();
      }
    }

    // Send success response with the updated course and number of students modified
    res.status(200).json({
      msg: "Course prerequisites cleared and updated for students",
      course: updatedCourse,
      studentsModified: modifiedCount,
    });
  } catch (error) {
    console.error("Error clearing prerequisites:", error);

    // Return internal server error if there's an exception
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

export const getSpecificCourseByCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const editCLO = async (req, res) => {
  const { courseId } = req.params;
  const { index, value, departmentId } = req.body;

  try {
    if (!value || typeof value !== "string" || !value.trim()) {
      return res
        .status(400)
        .json({ message: "CLO value cannot be empty or invalid" });
    }

    // Step 1: Find and validate course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.departmentId.equals(departmentId)) {
      return res.status(400).json({ message: "Department ID mismatch" });
    }

    // Step 2: Update CLO in course
    course.CLO[index] = value;
    await course.save();

    // Step 3: Update CLO in all students who have this course
    const updateResult = await Student.updateMany(
      { "courses.courseId": course._id },
      {
        $set: {
          [`courses.$[courseElem].CLO.${index}`]: value,
        },
      },
      {
        arrayFilters: [{ "courseElem.courseId": course._id }],
      }
    );

    res.status(200).json({
      message: "CLO updated successfully in course and students",
      course,
      studentsMatched: updateResult.matchedCount,
      studentsModified: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error("Error in editCLO:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteCLO = async (req, res) => {
  const { courseId } = req.params;
  const { index } = req.body;

  try {
    // Step 1: Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Step 2: Validate the index
    if (index < 0 || index >= course.CLO.length) {
      return res.status(400).json({ message: "Invalid CLO index" });
    }

    // Step 3: Remove the CLO from the course
    course.CLO.splice(index, 1);
    await course.save();

    // Step 4: Update all students' CLOs for this course
    const students = await Student.find({ "courses.courseId": course._id });

    let modifiedCount = 0;

    for (const student of students) {
      const courseEntry = student.courses.find((c) =>
        c.courseId.equals(course._id)
      );

      if (courseEntry && Array.isArray(courseEntry.CLO)) {
        courseEntry.CLO.splice(index, 1);
        modifiedCount++;
        await student.save();
      }
    }

    res.status(200).json({
      message: "CLO deleted successfully from course and students",
      course,
      studentsModified: modifiedCount,
    });
  } catch (error) {
    console.error("Error in deleteCLO:", error);
    res.status(500).json({ message: "Error deleting CLO", error });
  }
};

export const department = async (req, res) => {
  try {
    const { departmentName, departmentSchema, PLO } = req.body;

    // Check if a department with the same name already exists
    const existing = await Department.findOne({ departmentName });

    if (existing) {
      return res.status(400).json({
        msg: "A department with this name already exists.",
      });
    }

    // Create a new department in the database
    const departmentCreated = await Department.create({
      departmentName,
      departmentSchema,
      PLO,
    });

    res.status(201).json({
      msg: "Department created successfully",
    });
  } catch (error) {
    console.error("Error in Department creation:", error);
    res.status(500).json({
      msg: "Internal server error, Department creation unsuccessful",
      error: error.message,
    });
  }
};

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find(); // This retrieves all departments from the collection
    res.status(200).json(departments); // Send the departments data back to the client
  } catch (error) {
    console.error("Error retrieving departments:", error);
    res.status(500).send("Error retrieving departments");
  }
};
export const getDepartmentById = async (req, res) => {
  try {
    const departmentId = req.params.departmentId;
    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({ msg: "Department not found" });
    }

    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};
export const ongoingCourses = async (req, res) => {
  try {
    const departmentId = req.params.departmentId;
    console.log(departmentId);
    const course = await Course.find({
      departmentId: departmentId,
    });

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateDepartmentSchema = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).send("Department not found");
    }
    if (!req.body.schema) {
      return res.status(400).send("Schema value is required");
    }
    department.departmentSchema = req.body.schema;
    await department.save();
    res.status(200).send("Schema updated successfully");
  } catch (error) {
    console.error("Error updating schema:", error);
    res.status(500).send("Internal server error");
  }
};

// Delete department schema
export const deleteDepartmentSchema = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).send("Department not found");
    }
    department.departmentSchema = null; // Clear the schema field
    await department.save();
    res.status(200).json({ message: "Schema deleted successfully" });
  } catch (error) {
    console.error("Error deleting schema:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Edit a specific PLO in a department
export const updatePLO = async (req, res) => {
  const { id } = req.params;
  const { ploIndex, newPLO } = req.body;

  try {
    const department = await Department.findById(id);

    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    if (!department.PLO || department.PLO[ploIndex] === undefined) {
      return res
        .status(404)
        .json({ success: false, message: "PLO not found at the given index" });
    }

    // Update the PLO at the specified index
    department.PLO[ploIndex] = newPLO;

    await department.save(); // Save the updated department document

    return res.json({ success: true, updatedPLO: department.PLO });
  } catch (error) {
    console.error("Error in updatePLO:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Controller to handle deleting a specific PLO
export const deletePLO = async (req, res) => {
  const { id } = req.params;
  const { ploIndex } = req.body;

  try {
    const department = await Department.findById(id);

    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    if (!department.PLO || department.PLO[ploIndex] === undefined) {
      return res
        .status(404)
        .json({ success: false, message: "PLO not found at the given index" });
    }

    // Remove the PLO at the specified index
    department.PLO.splice(ploIndex, 1);

    await department.save(); // Save the updated department document

    return res.json({
      success: true,
      message: "PLO deleted successfully",
      updatedPLOs: department.PLO,
    });
  } catch (error) {
    console.error("Error in deletePLO:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.status(200).json(instructors);
  } catch (error) {
    console.error("Error fetching all courses:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const addNewCLO = async (req, res) => {
  const { courseId } = req.params;
  const { clo } = req.body;

  if (!clo || typeof clo !== "string") {
    return res.status(400).json({ error: "A valid CLO string is required" });
  }

  try {
    // Step 1: Add new CLO to the course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { CLO: clo } },
      { new: true } // Return the updated course document
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Step 2: Add the new CLO to all students enrolled in this course
    const students = await Student.find({ "courses.courseId": courseId });

    let modifiedCount = 0;

    for (const student of students) {
      const courseEntry = student.courses.find((c) =>
        c.courseId.equals(courseId)
      );

      if (courseEntry && Array.isArray(courseEntry.CLO)) {
        courseEntry.CLO.push(clo);
        modifiedCount++;
        await student.save();
      }
    }

    res.status(200).json({
      message: "CLO added successfully to course and students",
      course: updatedCourse,
      studentsModified: modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const addNewPLO = async (req, res) => {
  const { departmentId } = req.params;
  const { plo } = req.body;

  if (!plo || typeof plo !== "string") {
    return res.status(400).json({ error: "A valid PLO string is required" });
  }

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId,
      { $push: { PLO: plo } },
      { new: true } // Return the updated course document
    );

    if (!updatedDepartment) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.status(200).json({
      message: "PLO added successfully",
      department: updatedDepartment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

//student

export const uploadExcelFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Parse the uploaded Excel file
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) {
      return res
        .status(400)
        .json({ message: "No valid data found in the Excel file." });
    }

    // Map the rows to student objects with password
    const studentsToInsert = await Promise.all(
      sheetData.map(async (row) => {
        let dateOfBirth = null;
        if (row.dateOfBirth) {
          const [day, month, year] = row.dateOfBirth.split("-");
          dateOfBirth = new Date(`${year}-${month}-${day}`);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(
          row.Password || row.password || "defaultPassword123",
          salt
        );

        // Validate departmentId if provided
        let departmentId = null;
        let achievedPLOs = null;
        if (row.departmentId) {
          if (!mongoose.Types.ObjectId.isValid(row.departmentId)) {
            throw new Error(
              `Invalid departmentId format for student ${row.StudentId}`
            );
          }
          const deptExists = await Department.findById(row.departmentId);
          if (!deptExists) {
            throw new Error(`Department not found for ID: ${row.departmentId}`);
          }
          departmentId = row.departmentId;

          const department = await Department.findById(departmentId);
          if (!department) {
            throw new Error("Department not found");
          }

          const numberOfPLOs = department.PLO.length;
          console.log(numberOfPLOs);
          achievedPLOs = Array(numberOfPLOs).fill(0);
        }

        return {
          studentId: row.StudentId || row.studentId,
          firstName: row.FirstName || row.firstName,
          lastName: row.LastName || row.lastName,
          studentEmail: row.StudentEmail || row.studentEmail,
          gender: row.Gender || row.gender,
          degreeProgram: row.DegreeProgram || row.degreeProgram,
          studentBatch: row.studentBatch || row.StudentBatch,
          studentSection: row.studentSection || row.StudentSection,
          password: hashedPassword,
          dateOfBirth: dateOfBirth,
          contactNumber: row.contactNumber || row.ContactNumber || "",
          address: row.address || row.Address || "",
          city: row.city || row.City || "",
          country: row.country || row.Country || "",
          departmentId: departmentId,
          courses: [],
          achievedPLOs: achievedPLOs,
          batchSchema: row.batchSchema || row.BatchSchema || "",
        };
      })
    );

    // Insert new students
    const insertedStudents = await Student.insertMany(studentsToInsert);

    // ============= Batch Creation & Section Assignment with Department =============
    const batchMap = new Map();

    insertedStudents.forEach((student) => {
      const { studentBatch, studentSection, departmentId, batchSchema } =
        student;
      if (!batchMap.has(studentBatch)) {
        batchMap.set(studentBatch, {
          departmentId,
          degreeProgram: student.degreeProgram,
          batchSchema: "",
          sections: new Map(),
        });
      }

      const batchData = batchMap.get(studentBatch);
      const sectionMap = batchData.sections;

      if (!sectionMap.has(studentSection)) {
        sectionMap.set(studentSection, []);
      }

      sectionMap.get(studentSection).push(student._id);
    });

    // Create or update batch
    for (const [batchName, batchData] of batchMap.entries()) {
      let batch = await Batch.findOne({ batchName });

      if (!batch) {
        batch = new Batch({
          batchName: batchName,
          numberOfSections: 0,
          sections: new Map(),
          degreeProgram: batchData.degreeProgram,
          departmentId: batchData.departmentId,
          batchSchema: "",
          startDate: new Date(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 4)
          ),
          status: "Active",
        });
      }

      // Add new sections and students
      for (const [sectionName, studentIds] of batchData.sections.entries()) {
        if (!batch.sections.has(sectionName)) {
          batch.sections.set(sectionName, []);
          batch.numberOfSections = batch.sections.size;
        }
        batch.sections.get(sectionName).push(...studentIds);
      }

      await batch.save();
    }
    // ============= End Batch Creation =============

    res
      .status(200)
      .json({ message: "Students uploaded and batches created successfully!" });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({
      message: "Error processing file",
      error: error.message,
      ...(process.env.NODE_ENV === "development" && {
        stack: error.stack,
        errorDetails: error,
      }),
    });
  }
};

export const createBatch = async (req, res) => {
  const { batchName, numberOfSections } = req.body;

  // Check if a batch with the same name already exists
  const existingBatch = await Batch.findOne({ batchName: batchName });

  if (existingBatch) {
    return res
      .status(409)
      .json({ message: "A batch with this name already exists." });
  }

  try {
    const newBatch = new Batch({
      batchName: batchName,
      numberOfSections: numberOfSections,
      batchSchema: batchSchema,
      sections: new Map(),
    });

    // Dynamically create sections
    for (let i = 1; i <= numberOfSections; i++) {
      const sectionName = String.fromCharCode(64 + i); // Converts 1 to 'A', 2 to 'B', etc.
      newBatch.sections.set(sectionName, []); // Initialize each section as an empty array
    }

    // Save the batch to the database
    await newBatch.save();
    res.status(200).json({
      message: `Batch ${batchName} with ${numberOfSections} sections created successfully!`,
    });
  } catch (error) {
    console.error("Error creating batch:", error);
    res.status(500).json({ message: "Error creating batch." });
  }
};

export const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find();
    res.status(200).json(batches);
  } catch (error) {
    console.error("Error fetching all batches:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getStudentsByBatchandSection = async (req, res) => {
  const { batchName, section } = req.query;

  try {
    // Find students matching the batch and section
    const students = await Student.find({
      studentBatch: batchName,
      studentSection: section,
    });

    if (students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found for the given batch and section" });
    }

    res.json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentInfo = async (req, res) => {
  try {
    // Try both MongoDB _id and studentId
    const student = await Student.findOne({
      $or: [{ _id: req.params.id }, { studentId: req.params.id }],
    })
      .populate("departmentId", "name code")
      .select("-password -courses -__v");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...student._doc,
        department: student.departmentId?.name,
        departmentCode: student.departmentId?.code,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all enrolled courses for a specific student
export const getEnrolledCoursesByStudent = async (req, res) => {
  const studentId = req.params.id;

  try {
    // 1. Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2. Get the enrolled course IDs
    const enrolledCourseIds = student.enrolledCourses;

    // 3. Fetch course details for those IDs
    const enrolledCourses = await Course.find({
      _id: { $in: enrolledCourseIds },
    });

    // 4. Return the courses
    res.json(enrolledCourses);
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/courseController.js
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("assessments")
      .populate("instructorId", "name email")
      .populate("departmentId", "departmentName");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateStudentAssessmentMarks = async (req, res) => {
  const { studentId, courseId, assessmentId } = req.params;
  const { obtainedMarks, questions } = req.body;

  try {
    // Find the student
    const student = await Student.findOne({ _id: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find the course in student's courses
    const courseIndex = student.courses.findIndex(
      (c) => c._id.toString() === courseId
    );
    if (courseIndex === -1) {
      return res
        .status(404)
        .json({ message: "Course not found for this student" });
    }

    // Find the assessment in the course
    const assessmentIndex = student.courses[courseIndex].assessments.findIndex(
      (a) => a._id.toString() === assessmentId
    );
    if (assessmentIndex === -1) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Update the assessment marks and questions
    student.courses[courseIndex].assessments[assessmentIndex].obtainedMarks =
      obtainedMarks;

    student.courses[courseIndex].assessments[assessmentIndex].questions =
      questions;

    // Save the updated student
    await student.save();

    res.status(200).json({
      message: "Marks updated successfully",
      updatedStudent: student,
    });
  } catch (error) {
    console.error("Error updating marks:", error);
    res
      .status(500)
      .json({ message: "Failed to update marks", error: error.message });
  }
};

export const updateAccreditation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("Updating accreditation with ID:", id); // Add this for debugging
    console.log("Update data:", updateData); // Add this for debugging

    const updatedDoc = await Accreditation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      console.log("No document found with ID:", id); // Debug log
      return res.status(404).json({
        success: false,
        message: "Accreditation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedDoc,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
import crypto from "crypto";
import nodemailer from "nodemailer";

// Hardcoded email credentials (TEMPORARY FIX)
const EMAIL_USER = "nceacaccreditation@gmail.com";
const EMAIL_PASS = "cbymxsmctgefvhuu"; // Replace with your actual app password if 2FA is enabled

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465 (SSL), false for 587 (TLS)
  auth: {
    user: EMAIL_USER, // Directly use hardcoded value
    pass: EMAIL_PASS, // Directly use hardcoded value
  },
  tls: {
    rejectUnauthorized: false, // Bypass SSL errors (dev only)
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("SMTP Ready");
  }
});
export const forgotPassword = async (req, res) => {
  const { email, userType } = req.body; // Get email and userType from request body

  try {
    console.log(`Password reset request for ${userType}:`, email);

    // Find user based on type
    let user;
    if (userType === "instructor") {
      user = await Instructor.findOne({ email });
    } else if (userType === "student") {
      user = await Student.findOne({ studentEmail: email });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user type specified",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `${userType} with this email not found`,
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // Create reset link (pointing to your frontend)
    const resetLink = `https://iba-nceac.site/reset-password?token=${resetToken}&userType=${userType}`;

    // Send email with reset link
    const mailOptions = {
      from: `"NCEAC Support" <${EMAIL_USER}>`,
      to: userType === "student" ? user.studentEmail : user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a237e;">Password Reset</h2>
          <p>You requested a password reset for your ${userType} account.</p>
          <p>Click this link to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #1a237e; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reset link sent to ${userType}:`, email);

    res.status(200).json({
      success: true,
      message: `Password reset link sent to your ${userType} email`,
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing password reset request",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, userType, newPassword } = req.body;

    // Find user by token and check expiration
    let user;
    if (userType === "instructor") {
      user = await Instructor.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
    } else if (userType === "student") {
      user = await Student.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user type specified",
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password and clear reset token
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send confirmation email
    const mailOptions = {
      to: userType === "student" ? user.studentEmail : user.email,
      from: `"NCEAC Support" <${EMAIL_USER}>`,
      subject: "Password Changed Successfully",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a237e;">Password Updated</h2>
          <p>Your ${userType} account password has been successfully changed.</p>
          <p>If you didn't make this change, please contact us immediately.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};
