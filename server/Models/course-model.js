import mongoose from "mongoose";

const { Schema } = mongoose;

// Course Schema
const courseSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    maxlength: 100,
  },
  courseName: {
    type: String,
    required: true,
    maxlength: 100,
  },
  courseType: {
    type: String,
    enum: ["Core", "Elective", "Optional"],
  },
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  creditHours: {
    type: Number,
    min: 1,
    max: 6,
  },
  prerequisites: {
    type: [String],
    default: [],
  },
  courseDescription: {
    type: String,
    maxlength: 1000,
  },
  startingDate: {
    type: String,
  },
  endingDate: {
    type: String,
  },
  CLO: {
    type: [String],
    default: [],
  },
  PLO: {
    type: [Number],
    default: [],
  },
  instructorId: {
    type: Schema.Types.ObjectId,
    ref: "Instructor",
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  // Embedded Assessments Schema
  assessments: [
    {
      totalMarks: {
        type: String,
      },
      obtainedMarks: {
        type: String,
      },
      assessmentName: {
        type: String,
      },
      assessmentType: {
        type: String,
      },
      questions: [
        {
          questionNumber: {
            type: String,
          },
          totalQuestionMarks: {
            type: String,
          },
          threshold: {
            type: Number,
          },
          clos: [
            {
              cloId: {
                type: String,
              },
              cloWeight: {
                type: String,
              },
            },
          ],
          assignedPLO: {
            type: String,
          },
        },
      ],
    },
  ],
});

// Course Model Export
const Course = mongoose.model("Course", courseSchema);

export default Course;