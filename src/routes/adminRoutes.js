import express from "express";
import { 
  addStudent, 
  addFaculty, 
  getAllFaculty, 
  deleteFaculty,      // ← Add this
  getAllStudents, 
  deleteStudent,
getNotices, deleteNotice,
  addNotice 
} from "../controllers/adminController.js";
import { addTimetable,getAllTimetable, deleteTimetable,} from "../controllers/timetableController.js";
import { assignStudent, getAssignedStudents, deleteAssignedStudent, } from '../controllers/assignedStudentController.js';
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {  admin } from '../middleware/authMiddleware.js';


const router = express.Router();

// Admin routes
router.post("/add-student", protect, authorizeRoles("admin"), addStudent);
router.get("/all-students", protect, authorizeRoles("admin"), getAllStudents);
router.delete("/delete-student/:id", protect, authorizeRoles("admin"), deleteStudent);
router.post("/add-faculty", protect, authorizeRoles("admin"), addFaculty);
router.get("/all-faculty", protect, authorizeRoles("admin"), getAllFaculty);
router.delete('/delete-faculty/:id', protect, authorizeRoles('admin'), deleteFaculty);
 // <--- add this
// adminRoutes.js
router.get('/all-timetable', protect, authorizeRoles('admin'), getAllTimetable);
router.post('/add-timetable', protect, authorizeRoles('admin'), addTimetable);
router.delete('/delete-timetable/:id', protect, authorizeRoles('admin'), deleteTimetable);
router.post("/add-notice", protect, authorizeRoles("admin"), addNotice);
router.get("/notice", protect, getNotices); // no role restriction for viewing
router.delete("/delete-notice/:id", protect, authorizeRoles("admin"), deleteNotice);
router.post('/assign-student', protect, authorizeRoles("admin"), assignStudent);


// Get all assigned students
router.get('/assigned-students', protect, authorizeRoles("admin"), getAssignedStudents);

// Delete assigned student
router.delete('/assigned-students/:id', protect, authorizeRoles("admin"), deleteAssignedStudent);

// Get students by semester & subject (for faculty attendance)

export default router;
