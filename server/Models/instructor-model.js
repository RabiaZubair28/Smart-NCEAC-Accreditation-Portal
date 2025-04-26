import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const instructorSchema = new mongoose.Schema({
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  userID: {
    type: String,
    required: true,
    unique: true,
    match: /^INS-\d+$/i, // Added 'i' flag for case-insensitive matching
    uppercase: true, // This will convert the value to uppercase before saving
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  firstName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  prefix: {
    type: String,
  },
  lastName: {
    type: String,

    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  cnicNumber: {
    type: String,
    unique: true,
    match: /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/,
  },
  contactNumber: {
    type: String,
    match: /^[0-9]{4}-[0-9]{7}$/,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  city: {
    type: String,
    maxlength: 50,
  },
  districtOfDomicile: {
    type: String,
    maxlength: 50,
  },
  province: {
    type: String,
    maxlength: 50,
  },
  religion: {
    type: String,
    maxlength: 50,
  },
  officeNumber: {
    type: String,
    default: "",
  },
  officeLocation: {
    type: String,
    maxlength: 200,
    default: "",
  },
  designation: {
    type: String,
    maxlength: 100,
  },
  role: {
    type: String,
    required: true,
  },
});

// Password hashing middleware
instructorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Convert userID to uppercase before saving
  if (this.isModified("userID")) {
    this.userID = this.userID.toUpperCase();
  }
});

// Password matching method
instructorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Case-insensitive static method for finding by userID
instructorSchema.statics.findByUserID = async function (userID) {
  return this.findOne({ userID: new RegExp(`^${userID}$`, "i") });
};

const Instructor = mongoose.model("Instructor", instructorSchema);

export default Instructor;
