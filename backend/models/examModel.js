import mongoose from "mongoose";
const { Schema } = mongoose;

const examSchema = new Schema(
  {
    subject_id: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    set_ids: [{ type: Schema.Types.ObjectId, ref: "ExamSet" }],
    title: { type: String, required: true, trim: true },
    date: { type: Date },
    total_questions: { type: Number, required: true, min: 45 },
    total_marks: { type: Number, required: true, min: 45 },
    duration: { type: Number, required: true, min: 60 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
