import mongoose from "mongoose";

const accreditationSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  facultyMembers: { type: Number, default: 0 },
  visitingFaculty: { type: Number, default: 0 },
  fulltimeFaculty: { type: Number, default: 0 },
  teachingAssistants: { type: Number, default: 0 },
  PhDInstructors: {
    type: [String],
    default: [],
  },
  industryPractitioner: {
    type: [String],
    default: [],
  },

  noOfClassrooms: { type: Number, default: 0 },
  programmingLab: { type: Boolean, default: true },
  systemsLab: { type: Boolean, default: true },
  numberOfSystems: { type: Number, default: 0 },
  hardwareLab: { type: Boolean, default: true },
  numberOfStations: { type: Number, default: 0 },

  totalNumberOfStudentsInDept: { type: Number, default: 0 },
  totalNumberOfComputingBooks: { type: Number, default: 0 },
  ieeeAcmCopies: { type: Number, default: 0 },
  techMagazines: { type: Number, default: 0 },

  transport: { type: Boolean, default: true },
  hostels: { type: Boolean, default: true },
  sportsFacilities: { type: Boolean, default: true },
  prayerArea: { type: Boolean, default: true },
  commonRoomMale: { type: Boolean, default: true },
  commonRoomFemale: { type: Boolean, default: true },

  creditsHours: { type: Number, default: 0 },
});

const Accreditation = mongoose.model("Accreditation", accreditationSchema);

export default Accreditation;
