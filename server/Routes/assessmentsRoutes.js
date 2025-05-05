// authRoutes.js
import mongoose from "mongoose";
import express from "express"; // Named import
import Assessment from "../Models/assessment-model.js";
import Course from "../Models/course-model.js";
import Student from "../Models/student-model.js";
const router = express.Router();

router.post("/addAssessment", async (req, res) => {
  try {
    const { courseId, newAssessment } = req.body;
    console.log("Course ID:", courseId);
    console.log("New Assessment:", newAssessment);

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Validate newAssessment
    if (
      !newAssessment ||
      !newAssessment.assessmentName ||
      !newAssessment.questions
    ) {
      return res.status(400).json({ message: "Invalid new assessment data" });
    }

    const totalMarks = parseFloat(newAssessment.totalMarks);
    if (isNaN(totalMarks)) {
      return res
        .status(400)
        .json({ message: "Invalid totalMarks for new assessment" });
    }

    // Check for duplicate assessment name
    const isDuplicate = course.assessments.some(
      (a) =>
        a.assessmentName.trim().toLowerCase() ===
        newAssessment.assessmentName.trim().toLowerCase()
    );

    if (isDuplicate) {
      return res
        .status(409)
        .json({ message: "Assessment with this name already exists" });
    }

    // Process questions
    const processedQuestions = newAssessment.questions.map(
      (question, questionIndex) => {
        const totalQuestionMarks = parseFloat(question.totalQuestionMarks);
        const totalQuestionPLO = question.assignedPLO;
        if (isNaN(totalQuestionMarks)) {
          throw new Error(
            `Invalid totalQuestionMarks for question #${questionIndex + 1}`
          );
        }

        const processedCLOs = question.clos.map((CLO, CLOIndex) => {
          const cloId = CLO.cloId;
          const cloWeight = parseFloat(CLO.cloWeight);

          if (!cloId || isNaN(cloWeight)) {
            throw new Error(
              `Invalid CLOId or cloWeight for CLO #${
                CLOIndex + 1
              } in question #${questionIndex + 1}`
            );
          }

          return {
            cloId,
            cloWeight,
          };
        });

        return {
          questionNumber: question.questionNumber,
          threshold: question.totalQuestionThreshold,
          assignedPLO: totalQuestionPLO,
          totalQuestionMarks,
          clos: processedCLOs,
        };
      }
    );

    const updatedAssessment = {
      assessmentName: newAssessment.assessmentName,
      assessmentType: newAssessment.assessmentType,
      totalMarks,
      obtainedMarks: newAssessment.obtainedMarks || 0,
      questions: processedQuestions,
    };

    // Add the assessment to the course
    course.assessments.push(updatedAssessment);
    await course.save();

    // Update each student document to add the new assessment in their respective courses
    const updateStudentPromises = course.students.map(async (studentId) => {
      return Student.findOneAndUpdate(
        { _id: studentId, "courses.courseId": courseId },
        {
          $push: {
            "courses.$.assessments": updatedAssessment,
          },
        },
        { new: true }
      );
    });

    await Promise.all(updateStudentPromises);

    res.status(201).json({
      message: "Assessment added successfully to course and students",
      updatedCourse: course,
    });
  } catch (error) {
    console.error("Error adding new assessment:", error);
    res.status(500).json({
      message: "Error adding new assessment",
      error: error.message,
    });
  }
});

// router.get("/getAssessments/:courseId", async (req, res) => {
//   try {
//     const { courseId } = req.params;

//     // Validate courseId
//     if (!mongoose.Types.ObjectId.isValid(courseId)) {
//       return res.status(400).json({ message: "Invalid course ID" });
//     }

//     // Find all assessments for the given courseId
//     const assessments = await Assessment.find({ courseId }).populate(
//       "courseId"
//     );

//     if (assessments.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No assessments found for this course" });
//     }

//     res.status(200).json({ assessments });
//   } catch (error) {
//     console.error("Error fetching assessments:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching assessments", error: error.message });
//   }
// });

router.put("/:assessmentId/addQuestion", async (req, res) => {
  try {
    const { assessmentId } = req.params; // Assessment ID from URL params
    const { marks, CLOs } = req.body; // Question data from request body
    console.log("Received Assessment ID:", assessmentId);

    // Validate assessment ID
    if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
      return res.status(400).json({ message: "Invalid assessment ID" });
    }

    // Validate and parse marks
    const parsedMarks = parseFloat(marks);
    if (isNaN(parsedMarks)) {
      return res.status(400).json({ message: "Invalid marks value" });
    }

    // Validate and process CLOs array
    if (!Array.isArray(CLOs) || CLOs.length === 0) {
      return res.status(400).json({ message: "CLOs array is required" });
    }

    const processedCLOs = CLOs.map((CLO, index) => {
      const CLOId = parseInt(CLO.CLOId, 10);
      const weight = parseFloat(CLO.weight);

      if (isNaN(CLOId) || isNaN(weight)) {
        throw new Error(`Invalid CLO data at index ${index}`);
      }

      return { CLOId, weight };
    });

    // Add the question to the assessment
    const updatedAssessment = await Assessment.findById(assessmentId);
    console.log(updatedAssessment);
    updatedAssessment.questions.push(req.body);
    await updatedAssessment.save();

    if (!updatedAssessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.status(200).json({
      message: "Question added successfully",
      assessment: updatedAssessment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add question", error: error.message });
  }
});

// Add a question to a specific assessment inside a course
router.post("/add-question/:courseId/:assessmentId", async (req, res) => {
  try {
    const { courseId, assessmentId } = req.params;
    const {
      questionNumber,
      totalQuestionMarks,
      clos,
      totalQuestionThreshold,
      totalQuestionPLO,
    } = req.body;

    console.log(req.body);

    // Step 1: Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Step 2: Find assessment inside the course
    const assessment = course.assessments.find(
      (a) => a._id.toString() === assessmentId
    );
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Step 3: Prepare new question
    const newQuestion = {
      questionNumber,
      totalQuestionMarks,
      clos,
      threshold: totalQuestionThreshold,
      assignedPLO: totalQuestionPLO,
    };

    // Step 4: Add question to course
    assessment.questions.push(newQuestion);
    await course.save();

    // Step 5: Add question to each student's matching course/assessment
    const updatePromises = course.students.map(async (studentId) => {
      return Student.updateOne(
        {
          _id: studentId,
          "courses.courseId": courseId,
          "courses.assessments.assessmentName": assessment.assessmentName,
        },
        {
          $push: {
            "courses.$[course].assessments.$[assessment].questions":
              newQuestion,
          },
        },
        {
          arrayFilters: [
            { "course.courseId": courseId },
            { "assessment.assessmentName": assessment.assessmentName },
          ],
        }
      );
    });

    await Promise.all(updatePromises);

    res
      .status(200)
      .json({ message: "Question added to course and students", course });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// DELETE route to remove a question from an assessment inside a course
router.delete(
  "/delete-question/:assessmentId/:questionId",
  async (req, res) => {
    try {
      const { assessmentId, questionId } = req.params;
      const assessmentObjId = new mongoose.Types.ObjectId(assessmentId);
      const questionObjId = new mongoose.Types.ObjectId(questionId);

      // Step 1: Find course that contains the assessment
      const course = await Course.findOne({
        "assessments._id": assessmentObjId,
      });

      if (!course) {
        return res
          .status(404)
          .json({ message: "Assessment not found in any course" });
      }

      // Step 2: Find the assessment in the course
      const assessment = course.assessments.find(
        (a) => a._id.toString() === assessmentObjId.toString()
      );
      if (!assessment) {
        return res
          .status(404)
          .json({ message: "Assessment not found in course" });
      }

      const assessmentName = assessment.assessmentName;

      // Step 3: Find the question using questionId
      const question = assessment.questions.find(
        (q) => q._id.toString() === questionId
      );

      if (!question) {
        return res
          .status(404)
          .json({ message: "Question not found in assessment" });
      }

      const questionNumberToDelete = question.questionNumber;

      // Step 4: Remove question from the course document
      const updatedCourse = await Course.findOneAndUpdate(
        { "assessments._id": assessmentObjId },
        {
          $pull: { "assessments.$.questions": { _id: questionObjId } }, // Remove the question
        },
        { new: true }
      );

      if (!updatedCourse) {
        return res
          .status(404)
          .json({ message: "Failed to remove question from course" });
      }

      // Step 5: Remove question from students based on questionNumber and assessmentName
      const updateStudents = await Student.updateMany(
        {
          "courses.assessments.assessmentName": assessmentName,
        },
        {
          $pull: {
            "courses.$[].assessments.$[].questions": {
              questionNumber: questionNumberToDelete,
            },
          },
        }
      );

      res.status(200).json({
        message: "Question deleted successfully from course and students",
        questionNumberDeleted: questionNumberToDelete,
        studentsMatched: updateStudents.matchedCount,
        studentsModified: updateStudents.modifiedCount,
      });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

router.delete("/deleteAssessment/:courseId/:assessmentId", async (req, res) => {
  try {
    const { courseId, assessmentId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(assessmentId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid course ID or assessment ID" });
    }

    // Step 1: Remove the assessment from the Course itself
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const assessmentIndex = course.assessments.findIndex(
      (a) => a._id.toString() === assessmentId
    );

    if (assessmentIndex === -1) {
      return res
        .status(404)
        .json({ message: "Assessment not found in course" });
    }

    // Get the assessmentName before removing it
    const assessmentNameToDelete =
      course.assessments[assessmentIndex].assessmentName;

    course.assessments.splice(assessmentIndex, 1);
    await course.save();

    // Step 2: Remove assessment from student documents using assessmentName
    const updateResult = await Student.updateMany(
      {
        "courses.courseId": courseId,
      },
      {
        $pull: {
          "courses.$[].assessments": {
            assessmentName: assessmentNameToDelete,
          },
        },
      }
    );

    res.status(200).json({
      message: "Assessment deleted successfully from course and students",
      courseUpdated: true,
      studentsMatched: updateResult.matchedCount,
      studentsModified: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error("Error deleting assessment:", error);
    res.status(500).json({
      message: "Error deleting assessment",
      error: error.message,
    });
  }
});

// PUT /api/assessments/:assessmentId
router.put("/:assessmentId", async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const updatedAssessment = req.body;

    // Step 1: Find the course containing the assessment
    const course = await Course.findOne({ "assessments._id": assessmentId });
    if (!course) {
      return res
        .status(404)
        .json({ message: "Assessment not found in course" });
    }

    const oldAssessment = course.assessments.find(
      (a) => a._id.toString() === assessmentId
    );

    if (!oldAssessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const oldAssessmentName = oldAssessment.assessmentName;
    const newAssessmentName = updatedAssessment.assessmentName?.trim();

    // Step 2: Check uniqueness only if name is changed
    if (
      newAssessmentName &&
      newAssessmentName.toLowerCase() !== oldAssessmentName.toLowerCase()
    ) {
      const isDuplicate = course.assessments.some(
        (a) =>
          a.assessmentName.trim().toLowerCase() ===
            newAssessmentName.toLowerCase() && a._id.toString() !== assessmentId
      );

      if (isDuplicate) {
        return res.status(409).json({
          message:
            "Another assessment with this name already exists in this course",
        });
      }
    }

    // Step 3: Update the assessment in the course document
    const updatedCourse = await Course.findOneAndUpdate(
      { "assessments._id": assessmentId },
      {
        $set: {
          "assessments.$.assessmentName": updatedAssessment.assessmentName,
          "assessments.$.assessmentType": updatedAssessment.assessmentType,
          "assessments.$.totalMarks": updatedAssessment.totalMarks,
          "assessments.$.questions": updatedAssessment.questions,
        },
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res
        .status(404)
        .json({ message: "Failed to update assessment in course" });
    }

    // Step 4: Update assessment in students
    const updateStudents = await Student.updateMany(
      {
        "courses.courseId": course._id,
        "courses.assessments.assessmentName": oldAssessmentName,
      },
      {
        $set: {
          "courses.$[c].assessments.$[a].assessmentName":
            updatedAssessment.assessmentName,
          "courses.$[c].assessments.$[a].assessmentType":
            updatedAssessment.assessmentType,
          "courses.$[c].assessments.$[a].totalMarks":
            updatedAssessment.totalMarks,
          "courses.$[c].assessments.$[a].questions":
            updatedAssessment.questions,
        },
      },
      {
        arrayFilters: [
          { "c.courseId": course._id },
          { "a.assessmentName": oldAssessmentName },
        ],
        multi: true,
      }
    );

    res.status(200).json({
      message: "Assessment updated in course and student records",
      updatedCourse,
      studentsMatched: updateStudents.matchedCount,
      studentsModified: updateStudents.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating assessment:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/assessments/:assessmentId/questions/:questionId
router.put("/:assessmentId/questions/:questionId", async (req, res) => {
  try {
    const { assessmentId, questionId } = req.params;
    const updatedQuestion = req.body;

    const assessmentObjId = new mongoose.Types.ObjectId(assessmentId);
    const questionObjId = new mongoose.Types.ObjectId(questionId);

    // Step 1: Find the course containing the assessment
    const course = await Course.findOne({ "assessments._id": assessmentObjId });

    if (!course) {
      return res
        .status(404)
        .json({ message: "Assessment not found in course" });
    }

    const assessment = course.assessments.find(
      (a) => a._id.toString() === assessmentId
    );

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const assessmentName = assessment.assessmentName;
    const question = assessment.questions.find(
      (q) => q._id.toString() === questionId
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const oldQuestionNumber = question.questionNumber;

    // Step 2: Update the question in the course model
    const updatedCourse = await Course.findOneAndUpdate(
      {
        "assessments._id": assessmentId,
        "assessments.questions._id": questionId,
      },
      {
        $set: {
          "assessments.$[a].questions.$[q].questionNumber":
            updatedQuestion.questionNumber,
          "assessments.$[a].questions.$[q].totalQuestionMarks":
            updatedQuestion.totalQuestionMarks,
          "assessments.$[a].questions.$[q].clos": updatedQuestion.clos,
        },
      },
      {
        arrayFilters: [
          { "a._id": assessmentObjId },
          { "q._id": questionObjId },
        ],
        new: true,
      }
    );

    if (!updatedCourse) {
      return res
        .status(404)
        .json({ message: "Failed to update course question" });
    }

    // Step 3: Update question in student documents
    const updateStudents = await Student.updateMany(
      {
        "courses.assessments.assessmentName": assessmentName,
      },
      {
        $set: {
          "courses.$[].assessments.$[].questions.$[q].questionNumber":
            updatedQuestion.questionNumber,
          "courses.$[].assessments.$[].questions.$[q].totalQuestionMarks":
            updatedQuestion.totalQuestionMarks,
          "courses.$[].assessments.$[].questions.$[q].clos":
            updatedQuestion.clos,
        },
      },
      {
        arrayFilters: [{ "q.questionNumber": oldQuestionNumber }],
        multi: true,
      }
    );

    res.status(200).json({
      message: "Question updated successfully in course and student records",
      updatedCourse,
      studentsMatched: updateStudents.matchedCount,
      studentsModified: updateStudents.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
