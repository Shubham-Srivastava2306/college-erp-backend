import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    default: "admin"
  },
  password: {
    type: String,
    required: true,
    default: "admin123" // You can hash later if needed
  },
  role: {
    type: String,
    default: "admin"
  }
});

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
