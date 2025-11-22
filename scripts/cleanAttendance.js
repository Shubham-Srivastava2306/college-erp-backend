import mongoose from "mongoose";
import dotenv from "dotenv";
import Attendance from "../src/models/Attendance.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

async function migrateAttendance() {
  try {
    // ⚡ Step 1: Update old records (replace Student._id with AssignedStudent._id)
    const oldId = new mongoose.Types.ObjectId("691ebae8b2568bbc490b0fd0"); // ❌ wrong Student._id
    const correctId = new mongoose.Types.ObjectId("691ebb27b2568bbc490b0fd7"); // ✅ correct AssignedStudent._id

    const result = await Attendance.updateMany(
      { studentId: oldId },
      { $set: { studentId: correctId } }
    );

    console.log(`✅ Migrated ${result.modifiedCount} records to correct AssignedStudent._id`);

    // ⚡ Step 2: Add unique compound index to prevent duplicates
    await Attendance.collection.createIndex(
      { studentId: 1, subject: 1, date: 1 },
      { unique: true }
    );

    console.log("✅ Unique index created on studentId+subject+date");

    process.exit(0);
  } catch (err) {
    console.error("❌ Migration error:", err);
    process.exit(1);
  }
}

migrateAttendance();
