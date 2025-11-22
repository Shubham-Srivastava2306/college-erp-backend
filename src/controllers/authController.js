import Admin from "../models/Admin.js";
import Faculty from "../models/Faculty.js";
import Student from "../models/Student.js";
import AssignedStudent from "../models/AssignedStudent.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id, role, rollNo = "") => {
  return jwt.sign({ id, role, rollNo }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Unified login controller
export const login = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: "Role is required" });
    }

    let user;
    let token;
    let rollNo = "";

    // 🔹 Admin & Faculty → email + password
    if (role === "admin" || role === "faculty") {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password required" });
      }

      if (role === "admin") user = await Admin.findOne({ email });
      if (role === "faculty") user = await Faculty.findOne({ email });

      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" });

      token = generateToken(user._id, role);

      return res.json({
        success: true,
        token,
        role,
        user: { id: user._id, name: user.name, email: user.email }
      });
    }

    // 🔹 Student → rollNo + password
    if (role === "student") {
      const { rollNo: inputRollNo, password } = req.body;
      if (!inputRollNo || !password) {
        return res.status(400).json({ success: false, message: "RollNo and password required" });
      }

      user = await Student.findOne({ rollNo: inputRollNo });
      if (!user) return res.status(404).json({ success: false, message: "Student not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" });

      // If student is mapped in AssignedStudent
      rollNo = user.rollNo;
      if (user.assignedId) {
        const assigned = await AssignedStudent.findById(user.assignedId);
        if (assigned) rollNo = assigned.rollNo;
      }

      token = generateToken(user._id, role, rollNo);

      return res.json({
        success: true,
        token,
        role,
        user: { id: user._id, name: user.name, rollNo }
      });
    }

    return res.status(400).json({ success: false, message: "Invalid role" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
