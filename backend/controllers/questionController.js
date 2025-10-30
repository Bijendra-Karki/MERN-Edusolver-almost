import Question from "../models/questionModel.js";
import ExamSet from "../models/examSetModel.js";

// ====================================================
// 1️⃣ CREATE QUESTION(S) (Admin/Expert)
// ====================================================
export const createQuestion = async (req, res) => {
  try {
    const createdBy = req.auth?._id || null; // if you use auth middleware

    // Check if payload is an array (bulk creation)
    const isBulk = Array.isArray(req.body);

    // ---------- SINGLE QUESTION ----------
    if (!isBulk) {
      const { examSet, questionText, options, correctAnswer, marks } = req.body;

      // Check if ExamSet exists
      const foundSet = await ExamSet.findById(examSet).populate("subject_id", "title");
      if (!foundSet) {
        return res.status(404).json({ message: "Exam set not found." });
      }

      const newQuestion = new Question({
        examSet,
        questionText,
        options,
        correctAnswer,
        marks,
        createdBy,
      });

      const savedQuestion = await newQuestion.save();
      const populatedQuestion = await savedQuestion
        .populate({
          path: "examSet",
          select: "setName description subject_id",
          populate: { path: "subject_id", select: "title" },
        })
        .populate("createdBy", "name role");

      return res.status(201).json({
        message: "Question created successfully.",
        question: populatedQuestion,
      });
    }

    // ---------- BULK CREATION ----------
    if (isBulk && req.body.length === 0) {
      return res.status(400).json({ message: "No questions provided" });
    }

    // Validate all examSets exist
    const examSetIds = [...new Set(req.body.map((q) => q.examSet))];
    const foundSets = await ExamSet.find({ _id: { $in: examSetIds } });
    if (foundSets.length !== examSetIds.length) {
      return res.status(404).json({ message: "One or more exam sets not found." });
    }

    // Add createdBy to each question
    const questionsToInsert = req.body.map((q) => ({ ...q, createdBy }));

    const insertedQuestions = await Question.insertMany(questionsToInsert);

    // Populate examSet and createdBy fields
    const populatedQuestions = await Question.find({ _id: { $in: insertedQuestions.map(q => q._id) } })
      .populate({
        path: "examSet",
        select: "setName description subject_id",
        populate: { path: "subject_id", select: "title" },
      })
      .populate("createdBy", "name role");

    res.status(201).json({
      message: "Questions created successfully.",
      questions: populatedQuestions,
    });

  } catch (err) {
    console.error("Error creating question(s):", err);
    res.status(500).json({ error: err.message });
  }
};

// ====================================================
// 2️⃣ GET ALL QUESTIONS (Optionally by Exam Set)
// ====================================================
export const getQuestions = async (req, res) => {
  try {
    const { examSet } = req.query;
    const filter = examSet ? { examSet } : {};

    const questions = await Question.find(filter)
      .populate({
        path: "examSet",
        select: "setName description subject_id",
        populate: { path: "subject_id", select: "title" },
      })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: err.message });
  }
};

// ====================================================
// 3️⃣ GET SINGLE QUESTION BY ID
// ====================================================
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate({
        path: "examSet",
        select: "setName description subject_id",
        populate: { path: "subject_id", select: "title" },
      })
      .populate("createdBy", "name role");

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.json(question);
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({ error: err.message });
  }
};

// ====================================================
// 4️⃣ UPDATE QUESTION
// ====================================================
export const updateQuestion = async (req, res) => {
  try {
    const updates = req.body;

    const question = await Question.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate({
        path: "examSet",
        select: "setName description subject_id",
        populate: { path: "subject_id", select: "title" },
      })
      .populate("createdBy", "name role");

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.json({ message: "Question updated successfully.", question });
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(500).json({ error: err.message });
  }
};

// ====================================================
// 5️⃣ DELETE QUESTION
// ====================================================
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.json({ message: "Question deleted successfully." });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ error: err.message });
  }
};
