import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: String,
  roll: String,
  semester: Number,
  subjects: [String], // e.g., ["Data Structures", "DBMS"]
});

export default mongoose.model('Student', studentSchema);
