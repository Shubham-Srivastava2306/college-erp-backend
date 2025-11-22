import AssignedStudent from "../models/AssignedStudent.js";
import Attendance from "../models/Attendance.js";
import Marks from "../models/Marks.js";
import Timetable from "../models/Timetable.js";
import mongoose from "mongoose";

// ✅ Get faculty lectures
export const getStudentAttendance = async (req, res) => {
    try {
        const { studentId, subject } = req.params;

        // 🔍 get records for one student in one subject
        const records = await Attendance.find({
            studentId,
            subject
        }).sort({ date: 1 });

        if (!records.length) {
            return res.json({
                success: true,
                summary: {
                    totalLectures: 0,
                    present: 0,
                    absent: 0,
                    percentage: 0
                },
                records: [],
                overall: 0
            });
        }

        const total = records.length;
        const present = records.filter(r => r.status === "present").length;
        const absent = total - present;

        const percentage = ((present / total) * 100).toFixed(2);

        res.json({
            success: true,
            summary: {
                totalLectures: total,
                present,
                absent,
                percentage
            },
            records,
            overall: percentage
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};
export const getFacultyLectures = async (req, res) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) {
      return res.status(401).json({ success: false, message: "Unauthorized: facultyId missing" });
    }

    const lectures = await Timetable.find({ facultyId });
    res.json({ success: true, lectures });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Submit marks
// ✅ Submit marks (faculty side)
export const submitMarks = async (req, res) => {
  try {
    const { subject, examType, marks } = req.body;

    await Promise.all(
      marks.map(m =>
        Marks.updateOne(
          { rollNo: m.rollNo, subject, examType },   // ✅ rollNo based query
          { $set: { marks: m.marks } },
          { upsert: true }
        )
      )
    );

    res.json({ success: true, message: "Marks submitted successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Marks already uploaded for this exam" });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// ✅ Fetch students by subject
export const getStudentsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;

    const students = await AssignedStudent.find({
  subjects: { $regex: new RegExp(`^${subject}$`, "i") }
}).select("_id name rollNo ");


    res.json({ success: true, students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// ✅ Mark single student attendance (faculty side)
export const markAttendance = async (req, res) => {
  try {
    const { studentId, subject, date, status } = req.body;

if (!studentId) {
  return res.status(400).json({ success: false, message: "studentId missing" });
}

const attendance = new Attendance({
  studentId: new mongoose.Types.ObjectId(studentId), // AssignedStudent._id
  subject,
  date: new Date(date),
  status
});


    await attendance.save();
    res.json({ success: true, attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Submit attendance
export const submitAttendance = async (req, res) => {
  try {
    const { subject, date, attendance } = req.body;
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    await Promise.all(
      attendance.map(async (a) => {
        return Attendance.updateOne(
          { studentId: a.studentId, subject, date: normalizedDate },
          {
            $set: {
              status: a.status,
              rollNo: a.rollNo   // ✅ rollNo bhi save hoga
            }
          },
          { upsert: true }
        );
      })
    );

    res.json({ success: true, message: "Attendance submitted successfully for all students" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


