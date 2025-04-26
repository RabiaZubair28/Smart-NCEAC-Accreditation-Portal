import mongoose from "mongoose";
const { Schema } = mongoose;

const researchSchema = new mongoose.Schema({
  doiLink: {
    type: String,
    required: true,
    unique: true,
  },
  paperTitle: {
    type: String,
    required: true,
    unique: true,
  },
  researchGateLink: {
    type: String,
  },
  googleScholarLink: {
    type: String,
  },
  instructorId: {
    type: Schema.Types.ObjectId,
    ref: "Instructor",
    required: true,
  },
});

const Research = mongoose.model("Research", researchSchema);

export default Research;
