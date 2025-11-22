import AssignedStudent from '../models/AssignedStudent.js';
import Student from '../models/Student.js';

export const assignStudent = async (req, res) => {
  try {
    const { name, rollNo, semester, subjects } = req.body;

    if (!name || !rollNo || !semester || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if student exists in main Students collection
    const studentExists = await Student.findOne({ rollNo });
    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: "Student not found. Add student first."
      });
    }

    // Check if already assigned
    let assigned = await AssignedStudent.findOne({ rollNo });

    if (assigned) {
      assigned.name = name;
      assigned.semester = semester;
      assigned.subjects = subjects;
      await assigned.save();

      return res.json({
        success: true,
        message: "Subjects updated successfully",
        data: assigned
      });
    }

    // Create new
    assigned = new AssignedStudent({
      name,
      rollNo,
      semester,
      subjects
    });

    await assigned.save();

    res.status(201).json({
      success: true,
      message: "Subjects assigned successfully",
      data: assigned
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get Assigned Students
export const getAssignedStudents = async (req, res) => {
  try {
    const assigned = await AssignedStudent.find({}, {
      name: 1,
      rollNo: 1,
      semester: 1,
      subjects: 1
    });

    res.json({
      success: true,
      assigned
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// DELETE assigned student
export const deleteAssignedStudent = async (req, res) => {
  try {
    const { rollNo } = req.params;

    const deleted = await AssignedStudent.findOneAndDelete({ roll: rollNo });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Assigned student not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Assigned student deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
