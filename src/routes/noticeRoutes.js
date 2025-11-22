import express from "express";
import { createNotice, getNotices } from "../controllers/noticeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin uploads notice
router.post("/", protect, admin, createNotice);

// Faculty/Students view notices
router.get("/", protect, getNotices);

export default router;
