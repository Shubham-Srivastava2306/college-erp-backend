import express from "express";
import Attendance from "../models/Attendance.js";
import Marks from "../models/Marks.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ Student Profile
 */
router.get("/profile", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({
      success: true,
      student: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        rollNo: req.user.rollNo
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ✅ Attendance (overall + subject-wise + daily records)
 */
router.get("/attendance", protect, async (req, res) => {
  try {
    const { rollNo } = req.user;
    const { subject } = req.query;

    let matchQuery = { rollNo };
    if (subject) matchQuery.subject = subject;

    // Daily records
    const records = await Attendance.find(matchQuery).sort({ date: 1 });

    // Subject-wise summary
    const summary = await Attendance.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$subject",
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          subject: "$_id",
          present: 1,
          total: 1,
          percentage: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 0] }
            ]
          }
        }
      }
    ]);

    // Overall summary (across all subjects)
    const overallAgg = await Attendance.aggregate([
      { $match: { rollNo } },
      {
        $group: {
          _id: null,
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          present: 1,
          total: 1,
          absent: { $subtract: ["$total", "$present"] },
          percentage: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 0] }
            ]
          }
        }
      }
    ]);

    const overall = overallAgg.length
      ? overallAgg[0]
      : { present: 0, total: 0, absent: 0, percentage: 0 };

    res.json({ success: true, summary, records, overall });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * ✅ Marks (examType + subject-wise + overall average)
 */
router.get("/marks/:examType/:subject?", protect, async (req, res) => {
  try {
    const { rollNo } = req.user;
    const { subject, examType } = req.params;

    if (!examType) {
      return res.status(400).json({ success: false, message: "Exam Type is required" });
    }

    // Filtered query
    let matchQuery = { rollNo, examType };
    if (subject) matchQuery.subject = subject;

    // Records
    const records = await Marks.find(matchQuery).sort({ createdAt: 1 });

    // Subject-wise summary
    const summary = await Marks.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { subject: "$subject", examType: "$examType" },
          obtained: { $sum: "$marks" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          subject: "$_id.subject",
          examType: "$_id.examType",
          obtained: 1,
          count: 1,
          average: {
            $cond: [
              { $eq: ["$count", 0] },
              0,
              { $round: [{ $divide: ["$obtained", "$count"] }, 2] }
            ]
          }
        }
      }
    ]);

    // Global overall average
    const overallAgg = await Marks.aggregate([
      { $match: { rollNo } },
      {
        $group: {
          _id: null,
          obtained: { $sum: "$marks" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          average: {
            $cond: [
              { $eq: ["$count", 0] },
              0,
              { $round: [{ $divide: ["$obtained", "$count"] }, 2] }
            ]
          }
        }
      }
    ]);

    const overall = overallAgg.length ? overallAgg[0].average : 0;

    res.json({ success: true, summary, records, overall });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
