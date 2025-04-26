import mongoose from "mongoose";
const { Schema } = mongoose;

const studentSchema = new mongoose.Schema(
  {
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    studentId: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          // Allows any combination of numbers/hyphens in ***-**-**** pattern
          return /^[0-9]{3}-[0-9]{2}-[0-9]{4}$/.test(v);
        },
        message:
          "UserID must be in ###-##-#### number format (e.g., 123-45-6789)",
      },
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    dateOfBirth: {
      type: Date,
    },
    contactNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    degreeProgram: {
      type: String,
      required: true,
    },
    studentBatch: {
      type: String,
      required: true,
    },
    studentSection: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    achievedPLOs: [
      {
        type: Number,
      },
    ],

    courses: [
      {
        instructorId: {
          type: Schema.Types.ObjectId,
          ref: "Instructor",
        },
        departmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Department",
        },
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },

        assessments: [
          {
            totalMarks: {
              type: Number,
            },
            obtainedMarks: {
              type: Number,
              default: 0,
            },
            assessmentName: {
              type: String,
            },
            assessmentType: {
              type: String,
            },
            assessmentId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Assessment",
            },
            questions: [
              {
                questionNumber: {
                  type: String,
                },
                threshold: {
                  type: Number,
                },
                totalQuestionMarks: {
                  type: Number,
                },
                obtainedMarks: {
                  type: Number,
                  default: 0,
                },
                assignedPLO: {
                  type: String,
                },
                clos: [
                  {
                    cloId: {
                      type: String,
                    },
                    cloWeight: {
                      type: Number,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
