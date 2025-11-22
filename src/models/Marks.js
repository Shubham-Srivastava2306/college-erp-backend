import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
  rollNo: { type: String, required: true },
  subject: { type: String, required: true },
  examType: { type: String, required: true },
  marks: { type: Number, required: true }
}, { timestamps: true });

marksSchema.index({ rollNo: 1, subject: 1, examType: 1 }, { unique: true });

export default mongoose.model("Marks", marksSchema);
