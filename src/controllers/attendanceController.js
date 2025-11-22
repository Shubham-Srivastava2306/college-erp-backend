// src/controllers/attendanceController.js
export const markAttendance = async (req, res) => {
  try {
    // your logic here
    res.json({ success: true, message: "Attendance marked" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    // your logic here
    res.json({ success: true, attendance: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
