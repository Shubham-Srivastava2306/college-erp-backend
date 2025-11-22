import Timetable from "../models/Timetable.js";

export const addTimetable = async (req, res) => {
  try {
    const { facultyId, facultyName, subject, day, time, semester, course } = req.body;

    // Validate all required fields
    if (!facultyId || !facultyName || !subject || !day || !time || !semester || !course) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const timetable = new Timetable({ facultyId, facultyName, subject, day, time, semester, course });
    await timetable.save();

    res.status(201).json({
      success: true,
      message: "Lecture added successfully",
      data: timetable,
    });
  } catch (err) {
    console.error("Add Timetable Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// Get all timetable entries (optionally by semester)
export const getAllTimetable = async (req, res) => {
  try {
    const { semester } = req.params; // optional
    const filter = semester ? { semester } : {};
    const timetable = await Timetable.find(filter);

    res.json({
      success: true,
      data: timetable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a timetable entry
export const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    await Timetable.findByIdAndDelete(id);
    res.json({ success: true, message: "Timetable deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
