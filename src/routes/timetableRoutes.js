// src/routes/timetableRoutes.js
import express from "express";
import { addTimetable } from "../controllers/timetableController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect route: only admin can add timetable entry
router.post("/add-timetable", protect, authorizeRoles("admin"), addTimetable);

export default router; // <-- make it a default export
