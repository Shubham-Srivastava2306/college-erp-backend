import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  password: { type: String, required: true },
  subjects: [{ type: String }], // subjects they teach
  role: { type: String, default: "faculty" }
});

const Faculty = mongoose.model("Faculty", FacultySchema);
export default Faculty;
