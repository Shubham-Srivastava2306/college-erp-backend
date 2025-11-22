import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNo: { type: String, required: true, unique: true }, // ✅ only once
  department: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "student" },
  photo: { type: String }, // optional profile photo
  semester: { type: Number }, // optional semester
});

const Student = mongoose.model("Student", StudentSchema);
export default Student;
