// authRoutes.js
import mongoose from "mongoose";
import express from "express";
import {
  addAccreditationData,
  getAccreditation, updateAccreditation
} from "../Controllers/authController.js"; // Named import
const router = express.Router();

router.post("/addAccreditationData", addAccreditationData);
router.get("/getAccreditation/:departmentId", getAccreditation);
router.put('/:id', updateAccreditation);

export default router;
