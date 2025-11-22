import mongoose from 'mongoose';

const assignedStudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },  // FIXED
    semester: { type: String, required: true },
    subjects: [{ type: String, required: true }]
}, { timestamps: true });

const AssignedStudent = mongoose.models.AssignedStudent || mongoose.model('AssignedStudent', assignedStudentSchema);

export default AssignedStudent;
