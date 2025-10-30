import mongoose from "mongoose";

const { Schema } = mongoose;

const examAttemptSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    examSet: {
      type: Schema.Types.ObjectId,
      ref: "ExamSet",
      required: true,
    },
    answers: [
      {
        question: { type: Schema.Types.ObjectId, ref: "Question" },
        selectedAnswer: { type: String },
        isCorrect: { type: Boolean, default: false },
        marksObtained: { type: Number, default: 0 },
      },
    ],
    totalMarks: { type: Number, default: 0 },
    obtainedMarks: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("ExamAttempt", examAttemptSchema);
