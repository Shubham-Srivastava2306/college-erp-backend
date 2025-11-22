import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";
import Notice from "../models/Notice.js";
import Timetable from "../models/Timetable.js";
import bcrypt from "bcryptjs";         // ERP me already added students
import AssignedStudent from '../models/AssignedStudent.js'; // new model for assigned subjects

// Assign subjects to student
export const assignStudent = async (req, res) => {
  try {
    const { roll, name, semester, subjects } = req.body;

    if (!roll || !name || !semester || !subjects || subjects.length === 0) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // FIX: match with rollNo field
    const studentExists = await Student.findOne({ rollNo: roll, name });

    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: 'Student not found. Add in Manage Students first.'
      });
    }

    const assigned = new AssignedStudent({ roll, name, semester, subjects });
    await assigned.save();

    res.status(201).json({
      success: true,
      message: 'Subjects assigned successfully',
      data: assigned
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get assigned students list
export const getAssignedStudents = async (req, res) => {
    try {
        const assigned = await AssignedStudent.find({});
        res.json({ success:true, assigned });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success:false, message: 'Server Error' });
    }
}

// ADD STUDENT
export const addStudent = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10); // hash password
    const student = new Student(req.body);
    await student.save();

    res.json({
      success: true,
      message: "Student registered successfully",
      student
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL STUDENTS
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password'); // exclude password
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE STUDENT
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD FACULTY
export const addFaculty = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const faculty = new Faculty(req.body);
    await faculty.save();

    res.json({
      success: true,
      message: "Faculty registered successfully",
      faculty
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL FACULTY
// GET ALL FACULTY
export const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().select('-password'); // exclude passwords
    res.json({ success: true, faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE FACULTY
export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    await Faculty.findByIdAndDelete(id);
    res.json({ success: true, message: "Faculty deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// ADD TIMETABLE ENTRY
export const addTimetable = async (req, res) => {
  try {
    const timetable = new Timetable(req.body);
    await timetable.save();

    res.json({
      success: true,
      message: "Timetable entry added",
      timetable
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD NOTICE
// Get all notices
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find();
    res.json({ success: true, notices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add notice
export const addNotice = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const notice = new Notice({ title, description });
    await notice.save();

    res.status(201).json({ success: true, message: "Notice added successfully", data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete notice
export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await Notice.findByIdAndDelete(id);
    res.json({ success: true, message: "Notice deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};