import mongoose from "mongoose";
import { department } from "../Controllers/authController.js";
const { Schema } = mongoose;
const departmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
    unique: true,
  },
  departmentSchema: {
    type: String,
  },
  PLO: {
    type: [String], // Defines an array of strings
    // Ensures PLO is always provided as an array
  },
});

const Department = new mongoose.model("Department", departmentSchema);

export default Department;
