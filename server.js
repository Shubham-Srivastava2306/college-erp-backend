import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

// Import routes
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import studentRoutes from "./src/routes/studentRoutes.js";
import facultyRoutes from "./src/routes/facultyRoutes.js";
import timetableRoutes from "./src/routes/timetableRoutes.js";
import noticeRoutes from "./src/routes/noticeRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";
import chatbotRoutes from "./src/routes/chatbotRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ CORS fix: allow GitHub Pages + localhost
app.use(cors({
  origin: [
    "http://127.0.0.1:5500", 
    "https://Shubham-Srivastava2306.github.io"
  ],
  credentials: true
}));

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/notice", noticeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => res.send("College ERP Backend Running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
