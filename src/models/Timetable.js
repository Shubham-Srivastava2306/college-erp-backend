import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  facultyId: { type: String, required: true },
  facultyName: { type: String, required: true },
  subject: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  semester: { type: String, required: true }, // NEW
  course: { type: String, required: true }    // NEW
});

export default mongoose.model("Timetable", timetableSchema);
