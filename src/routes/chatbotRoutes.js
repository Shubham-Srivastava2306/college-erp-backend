import express from "express";
import Attendance from "../models/Attendance.js";
import Marks from "../models/Marks.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/student/chatbot
router.post("/chatbot", protect, async (req, res) => {
  const { query } = req.body;
  const { rollNo } = req.user;

  try {
    let reply = "Sorry, I didn't understand your query. Try asking: 'Show my total attendance', 'DBMS attendance', or 'Attendance on 21 Nov'.";

    const lowerQuery = query.toLowerCase();

    // ✅ Overall Attendance
    if (lowerQuery.includes("attendance") && lowerQuery.includes("total")) {
      const overall = await Attendance.aggregate([
        { $match: { rollNo } },
        {
          $group: {
            _id: null,
            present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
            total: { $sum: 1 }
          }
        }
      ]);
      if (overall.length) {
        const { present, total } = overall[0];
        const absent = total - present;
        const percentage = total ? Math.round((present / total) * 100) : 0;
        reply = `📊 Your overall attendance: ${percentage}% (Present: ${present}, Absent: ${absent}, Total: ${total})`;
      } else {
        reply = "No attendance records found.";
      }
    }

    // ✅ Subject-wise Attendance
    else if (lowerQuery.includes("attendance")) {
      const subjectMatch = query.match(/dbms|os|maths|english|dsa|ai|ml/i);
      if (subjectMatch) {
        const subject = subjectMatch[0].toUpperCase();
        const records = await Attendance.find({ rollNo, subject });
        const present = records.filter(r => r.status === "present").length;
        const total = records.length;
        const absent = total - present;
        const percentage = total ? Math.round((present / total) * 100) : 0;
        reply = `📚 ${subject} Attendance: ${percentage}% (Present: ${present}, Absent: ${absent}, Total: ${total})`;
      }
    }

    // ✅ Date-specific Attendance
    const dateMatch = query.match(/(\d{1,2})\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i);
    if (lowerQuery.includes("attendance") && dateMatch) {
      const day = dateMatch[1];
      const month = dateMatch[2];
      const dateStr = `${day} ${month} ${new Date().getFullYear()}`;
      const targetDate = new Date(dateStr).toISOString().split("T")[0];

      const record = await Attendance.findOne({ rollNo, date: targetDate });
      if (record) {
        reply = `📅 Attendance on ${targetDate}: ${record.status}`;
      } else {
        reply = `No attendance record found for ${targetDate}.`;
      }
    }

    // ✅ Marks Queries
    if (lowerQuery.includes("marks")) {
      if (lowerQuery.includes("mid-term")) {
        const marks = await Marks.find({ rollNo, examType: "Mid-term" });
        reply = `📝 You have ${marks.length} mid-term marks records.`;
      } else if (lowerQuery.includes("assignment")) {
        const marks = await Marks.find({ rollNo, examType: "Assignment" });
        reply = `📝 You have ${marks.length} assignment marks records.`;
      } else if (lowerQuery.includes("final")) {
        const marks = await Marks.find({ rollNo, examType: "Final Exam" });
        reply = `📝 You have ${marks.length} final exam marks records.`;
      }
    }

    res.json({ success: true, reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
