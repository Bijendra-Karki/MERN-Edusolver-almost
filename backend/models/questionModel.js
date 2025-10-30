// models/questionModel.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    examSet: { type: Schema.Types.ObjectId, ref: "ExamSet", required: true },
    questionText: { type: String, required: true, trim: true },
    options: [{ type: String }], // for MCQs
    correctAnswer: { type: String, required: true },
    marks: { type: Number, default: 1 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Static helper for bulk insert
questionSchema.statics.insertMultiple = async function (questionsArray, options = {}) {
  // questionsArray: [{ examSet, questionText, options, correctAnswer, marks, createdBy }, ...]
  // options: { ordered: true/false } passed to insertMany
  if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
    throw new Error("questionsArray must be a non-empty array");
  }
  return this.insertMany(questionsArray, { ordered: options.ordered ?? true });
};

export default mongoose.model("Question", questionSchema);
