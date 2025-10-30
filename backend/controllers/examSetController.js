import ExamSet from "../models/examSetModel.js";
import Exam from "../models/examModel.js";

// ✅ GET all ExamSets
export const getExamSets = async (req, res) => {
  try {
    const sets = await ExamSet.find().populate("exam_id", "title");
    res.json(sets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET single ExamSet by ID
export const getExamSetById = async (req, res) => {
  try {
    const set = await ExamSet.findById(req.params.id).populate("exam_id", "title");
    if (!set) return res.status(404).json({ error: "ExamSet not found" });
    res.json(set);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ CREATE ExamSet (auto adds ID to Exam.set_ids)
export const createExamSet = async (req, res) => {
  try {
    const examSet = await ExamSet.create(req.body);
    res.status(201).json({ message: "Exam set created successfully", examSet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE ExamSet
export const updateExamSet = async (req, res) => {
  try {
    const updatedSet = await ExamSet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedSet) return res.status(404).json({ error: "ExamSet not found" });
    res.json({ message: "Exam set updated successfully", updatedSet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE ExamSet (auto removes ID from Exam.set_ids)
export const deleteExamSet = async (req, res) => {
  try {
    const examSet = await ExamSet.findOneAndDelete({ _id: req.params.id });
    if (!examSet) return res.status(404).json({ error: "Exam set not found" });
    res.json({ message: "Exam set deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
