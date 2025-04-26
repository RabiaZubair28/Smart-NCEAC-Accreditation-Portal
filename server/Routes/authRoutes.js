// authRoutes.js
import mongoose from "mongoose";
import express from "express";
import { login,logout,studentLogin } from "../Controllers/authController.js"; // Named import
const router = express.Router();

router.post("/login", login);
router.post('/student-login', studentLogin);
router.post("/logout", logout);


export default router;
