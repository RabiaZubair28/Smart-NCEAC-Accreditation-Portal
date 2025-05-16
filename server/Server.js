import express from "express";
import cors from "cors";
import multer from "multer";
import xlsx from "xlsx";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./Config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import dataRoutes from "./Routes/dataRoutes.js";
import studentRoutes from "./Routes/studentRoutes.js";
import batchRoutes from "./Routes/batchRoutes.js";
import assessmentsRoutes from "./Routes/assessmentsRoutes.js";
import Instructor from "./Models/instructor-model.js";
import accreditationRoutes from "./Routes/accreditationRoutes.js";
import mongoose from "mongoose";
import Batch from "./Models/batch-model.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://extensions.aitopia.ai/languages/lang/get/lang/en",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  credentials: true,
  optionSuccessStatus: 200,
};

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDB();
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// Cloudinary config
cloudinary.config({
  cloud_name: "dxokfhkhu",
  api_key: "161123786321295",
  api_secret: "otxDLjGJUARacVH8mNo_FfDSgdw",
});

// Multer setup (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Use the auth routes
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/assessments", assessmentsRoutes);
app.use("/api/accreditation", accreditationRoutes);

app.post("/upload-pdf/:batchId", upload.single("file"), async (req, res) => {
  try {
    const fileStr = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;
    const batchId = req.params.batchId;

    const result = await cloudinary.uploader.upload(fileStr, {
      resource_type: "raw", // Important for PDFs
      folder: "pdfs",
    });

    const fileUrl = result.secure_url;

    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { $set: { pdfReportUrl: fileUrl } }, // 👈 Update correct field name
      { new: true }
    );

    if (!updatedBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.json({ url: fileUrl, batch: updatedBatch });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "PDF upload failed" });
  }
});

app.put("/api/updateCover/:id", async (req, res) => {
  const { id } = req.params;
  const { avatar } = req.body;

  console.log("Received ID:", id);
  console.log(avatar);

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    // Ensure img01 is valid
    if (avatar && typeof avatar !== "string") {
      return res.status(400).json({ message: "Invalid img01 URL" });
    }

    const updatedClient = await Instructor.findByIdAndUpdate(
      id,
      { avatar: avatar },
      { new: true } // Return the updated document
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
