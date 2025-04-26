import mongoose from "mongoose";
const { Schema } = mongoose;

const batchSchema = new mongoose.Schema({
  batchName: {
    type: String,
    required: true,
  },
  numberOfSections: {
    type: Number,
    required: true,
  },
  batchSchema: {
    type: String,
  },
  sections: {
    type: Map,
    of: [String], // Array of student IDs for each section
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
});

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;
