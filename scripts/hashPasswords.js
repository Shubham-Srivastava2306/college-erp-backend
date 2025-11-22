import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../src/models/Admin.js";
import Faculty from "../src/models/Faculty.js";
import Student from "../src/models/Student.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"));

const hashAllPasswords = async () => {
  const users = [
    ...(await Admin.find()),
    ...(await Faculty.find()),
    ...(await Student.find())
  ];

  for (let user of users) {
    if (user.password && !user.password.startsWith("$2a$")) { // not hashed yet
      const hashed = await bcrypt.hash(user.password, 10);
      user.password = hashed;
      await user.save();
      console.log(`Password hashed for: ${user.email}`);
    }
  }
  console.log("All passwords hashed!");
  process.exit();
};

hashAllPasswords();
