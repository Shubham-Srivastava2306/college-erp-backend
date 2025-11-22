import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: String,
  email: String,
  subjects: [
    {
      name: String,
      semester: Number
    }
  ]
});

export default mongoose.model('Faculty', facultySchema);
