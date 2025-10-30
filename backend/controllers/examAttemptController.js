import ExamAttempt from "../models/examAttemptModel.js";
import Question from "../models/questionModel.js";
import ExamSet from "../models/examSetModel.js";
import { getMe } from "./authController.js";

// ---------------------------------------------------
// 🧩 Submit Exam Attempt (POST /api/exam-attempts/submit)
// ---------------------------------------------------
export const submitExamAttempt = async (req, res) => {
  try {
    const { examSetId, answers } = req.body;
    const studentId = req.auth?._id; // use req.auth, not req.user

    if (!studentId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (!examSetId || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Invalid submission data" });
    }

    const examSet = await ExamSet.findById(examSetId);
    if (!examSet) {
      return res.status(404).json({ message: "Exam Set not found" });
    }

    const questions = await Question.find({ examSet: examSetId });
    if (!questions.length) {
      return res.status(404).json({ message: "No questions found for this exam set" });
    }

    let totalMarks = 0;
    let obtainedMarks = 0;
    let correctAnswers = 0;

    const answerRecords = questions.map((q) => {
      const userAns = answers.find((a) => String(a.questionId) === String(q._id));
      const selected = userAns?.selectedAnswer || null;
      const isCorrect = selected === q.correctAnswer;
      const marksObtained = isCorrect ? q.marks || 0 : 0;

      totalMarks += q.marks || 0;
      if (isCorrect) obtainedMarks += q.marks || 0;
      if (isCorrect) correctAnswers++;

      return {
        question: q._id,
        selectedAnswer: selected,
        isCorrect,
        marksObtained,
      };
    });

    const wrongAnswers = questions.length - correctAnswers;
    const percentage =
      totalMarks > 0 ? Number(((obtainedMarks / totalMarks) * 100).toFixed(2)) : 0;

    const attempt = new ExamAttempt({
      student: studentId, // ✅ correct now
      examSet: examSetId,
      answers: answerRecords,
      totalMarks,
      obtainedMarks,
      correctAnswers,
      wrongAnswers,
      percentage,
      completedAt: new Date(),
    });

    await attempt.save();

    res.status(201).json({
      message: "Exam submitted successfully",
      result: {
        totalMarks,
        obtainedMarks,
        correctAnswers,
        wrongAnswers,
        percentage,
      },
    });
  } catch (err) {
    console.error("❌ Error submitting exam:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};


// ---------------------------------------------------
// 📋 Get All Student Attempts (GET /api/exam-attempts/studentResults)
// ---------------------------------------------------
export const getStudentAttempts = async (req, res) => {
  try {
    const attempts = await ExamAttempt.find()
      .populate("student", "name email")
      .populate({
        path: "examSet",
        select: "setName exam_tittle subject_id",
        populate: { path: "subject_id", select: "title" } // populate subject inside examSet
      })
      .sort({ completedAt: -1 });

    res.status(200).json(attempts);
  } catch (err) {
    console.error("❌ Error fetching student results:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};


// ---------------------------------------------------
// 📄 Get Attempts for a Specific Student (GET /api/exam-attempts/result/:id)
// ---------------------------------------------------
export const getUserAttempts = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const attempts = await ExamAttempt.find({ student: studentId })
      .populate("examSet", "setName description")
      .sort({ completedAt: -1 });

    res.status(200).json(attempts);
  } catch (err) {
    console.error("❌ Error fetching student attempts:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// ---------------------------------------------------
// 🔍 Get Single Attempt Details (GET /api/exam-attempts/attempt/:id)
// ---------------------------------------------------
export const getAttemptById = async (req, res) => {
  try {
    const { id } = req.params;
    const attempt = await ExamAttempt.findById(id)
      .populate("student", "name email")
      .populate("examSet", "setName description")
      .populate("answers.question", "questionText options correctAnswer");

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    res.status(200).json(attempt);
  } catch (err) {
    console.error("❌ Error fetching attempt by ID:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
