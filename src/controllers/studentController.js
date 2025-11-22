import Attendance from "../models/Attendance.js";
import Marks from "../models/Marks.js";

// ✅ Student Attendance (JWT rollNo based)
// ✅ Student Attendance (JWT rollNo based, subject optional) — fixed overall calc
export const getStudentAttendance = async (req, res) => {
  try {
    const { rollNo } = req.user;
    const { subject } = req.query;

    const matchQuery = { rollNo };
    if (subject) matchQuery.subject = subject;

    // Daily records (for cards)
    const records = await Attendance.find(matchQuery).sort({ date: 1 });

    // Subject-wise summary (unchanged)
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

    // ✅ True overall: sum present/total across all matched records (not average of subjects)
    const overallAgg = await Attendance.aggregate([
      { $match: matchQuery },
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
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ Student Marks (JWT rollNo based)
export const getStudentMarks = async (req, res) => {
  try {
    const { rollNo } = req.user;   // JWT payload mein rollNo

    const records = await Marks.find({ rollNo }).sort({ createdAt: 1 });

    if (!records.length) {
      return res.json({ success: true, summary: [], records: [], overall: 0 });
    }

    // Subject-wise summary
    const summary = await Marks.aggregate([
      { $match: { rollNo } },
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
          average: { $round: [{ $divide: ["$obtained", "$count"] }, 2] }
        }
      }
    ]);

    // Overall average across subjects/exams
    const overall =
      summary.length > 0
        ? Math.round(summary.reduce((acc, s) => acc + s.average, 0) / summary.length)
        : 0;

    res.json({ success: true, summary, records, overall });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
