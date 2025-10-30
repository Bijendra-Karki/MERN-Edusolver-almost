import mongoose from "mongoose";
import Exam from "./examModel.js";
import Subject from"./subjectModel.js";

const { Schema } = mongoose;

const examSetSchema = new Schema({
  exam_id: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
  subject_id:{type: Schema.Types.ObjectId, ref: "Subject", required: true },
  exam_tittle:{type: String, required: true},
  setName: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
 description:{ type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });


// 🧩 When a new ExamSet is created → add its ID to Exam.set_ids
examSetSchema.post("save", async function (doc) {
  try {
    await Exam.findByIdAndUpdate(doc.exam_id, {
      $addToSet: { set_ids: doc._id },
    });
  } catch (err) {
    console.error("❌ Error updating Exam.set_ids after ExamSet create:", err);
  }
});


// 🧹 When an ExamSet is deleted → remove its ID from Exam.set_ids
examSetSchema.post("findOneAndDelete", async function (doc) {
  try {
    if (doc?.exam_id) {
      await Exam.findByIdAndUpdate(doc.exam_id, {
        $pull: { set_ids: doc._id },
      });
    }
  } catch (err) {
    console.error("❌ Error removing ExamSet from Exam.set_ids:", err);
  }
});

export default mongoose.model("ExamSet", examSetSchema);
