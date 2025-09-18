import Exam from "../models/examModel.js";
import Result from "../models/resultModel.js";

// Simple grading function
const calculateGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  return "F";
};

// Student submits exam answers → auto result generated
export const submitExam = async (req, res) => {
  try {
    const studentId = req.auth._id;  // ✅ from JWT
    const { examId, obtainedMarks } = req.body;

    // Get exam info
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    // Prevent duplicate result
    const existingResult = await Result.findOne({ student: studentId, exam: examId });
    if (existingResult) {
      return res.status(400).json({ error: "Result already submitted for this exam" });
    }

    // Calculate percentage & grade
    const percentage = ((obtainedMarks / exam.total_marks) * 100).toFixed(2);
    const grade = calculateGrade(percentage);

    // Save result
    const result = new Result({
      student: studentId,
      exam: examId,
      obtainedMarks,
      totalMarks: exam.total_marks,
      percentage,
      grade,
    });
    await result.save();

    res.status(201).json({ msg: "Result submitted successfully", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Student views their own results
export const getMyResults = async (req, res) => {
  try {
    const studentId = req.auth._id; // ✅ from JWT
    const results = await Result.find({ student: studentId }).populate("exam", "title date total_marks");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin/Instructors can view all results
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find().populate("student", "name email").populate("exam", "title date");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
