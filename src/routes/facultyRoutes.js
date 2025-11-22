import express from "express";
import {
  getFacultyLectures,
  getStudentsBySubject,
  submitAttendance,
  submitMarks,
  markAttendance,
  getStudentAttendance

} from "../controllers/facultyController.js";
import { protect } from "../middleware/authMiddleware.js";   // ✅ use protect consistently
import Faculty from "../models/Faculty.js";
const router = express.Router();

// ✅ Routes
router.get("/students/:subject", protect, getStudentsBySubject);
router.post("/attendance/mark", protect, markAttendance);   // fixed: use protect instead of authMiddleware
router.post("/attendance", protect, submitAttendance);
router.post("/marks", protect, submitMarks);
router.get("/lectures", protect, getFacultyLectures);
router.get(
  "/attendance/student/:studentId/:subject",
  protect,
  getStudentAttendance
);
router.get("/profile", protect, async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user.id).select("name");
    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }
    res.json({ success: true, faculty }); // ✅ faculty object ke andar name hoga
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
export default router;
