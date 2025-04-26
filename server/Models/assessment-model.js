import mongoose from "mongoose";
const { Schema } = mongoose;

// Assessment Schema
const assessmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // This refers to the Course model
    required: true,
  },
  assessmentName: {
    type: String,
    required: true,
  },
  assessmentType: {
    type: String,
    enum: ["Exam", "Quiz", "Assignment", "Project", "Other"], // Example types
    required: true,
  },
  dueDate: {
    type: Date,
  },
  totalMarks: {
    type: Number, // Total marks for the assessment
  },
  questions: [
    {
      marks: {
        type: Number, // Marks allocated to this question
        required: true,
      },
      CLOs: [
        {
          CLOId: {
            type: Number, // Unique identifier for CLO
            required: true,
          },
          weight: {
            type: Number, // Weight of this CLO in this question
            required: true,
          },
        },
      ],
    },
  ],
});

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;
