import mongoose from "mongoose";
const { Schema, Schema: { ObjectId } } = mongoose;

const resultSchema = new Schema({
  student: { type: ObjectId, ref: "User", required: true },
  exam: { type: ObjectId, ref: "Exam", required: true },
  obtainedMarks: { type: Number, required: true, min: 0 },
  totalMarks: { type: Number, required: true, min: 0 },
  percentage: { type: Number, required: true },
  grade: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Result", resultSchema);
