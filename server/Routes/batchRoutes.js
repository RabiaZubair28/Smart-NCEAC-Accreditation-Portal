import express from "express";
import {
  createBatch,
  getAllBatches,
  getAllBatchesById,
} from "../Controllers/authController.js";
import Batch from "../Models/batch-model.js";
const router = express.Router();

router.post("/create-batch", createBatch);
router.get("/all-batches", getAllBatches);
router.get("/all-batches/:id", getAllBatchesById);
// GET /api/students/sections/by-batch-name/:batchName
router.get("/sections/by-batch-name/:studentBatch", async (req, res) => {
  const { studentBatch } = req.params;

  try {
    const sections = await Batch.find({
      batchName: studentBatch,
    });

    res.json(sections);
  } catch (error) {
    console.error("Error fetching sections by batch name:", error);
    res.status(500).json({ message: "Server error fetching sections" });
  }
});

export default router;