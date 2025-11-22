import express from "express";
import { markAttendance, getAttendance } from "../controllers/attendanceController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/mark", protect, authorizeRoles("faculty"), markAttendance);
router.get("/all", protect, authorizeRoles("admin", "faculty"), getAttendance);

export default router;  // <- add this
