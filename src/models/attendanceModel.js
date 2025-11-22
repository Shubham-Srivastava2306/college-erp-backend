import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  semester: Number,
  subject: String,
  date: Date,
  status: { type: String, enum: ['present','absent'], default: 'absent' }
});

export default mongoose.model('Attendance', attendanceSchema);
