import Exam from "../models/examModel.js";
import Question from "../models/questionModel.js";

export const getExamList = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate({
        path: "subject_id",
        select: "title image",
      })
      .populate({
        path: "set_ids",
        select: "setName description duration totalMarks",
      })
      .exec();

    // Add questionCount for each set
    for (const exam of exams) {
      for (const set of exam.set_ids) {
        const count = await Question.countDocuments({ examSet: set._id });
        set._doc.questionCount = count;
        set._doc.totalMarks = exam.total_marks;
        set._doc.duration = exam.duration;
      }
    }

    res.status(200).json(exams);
  } catch (err) {
    console.error("Error fetching exam list:", err);
    res.status(500).json({ message: "Failed to fetch exam list" });
  }
};

// GET exam by ID
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("subject_id", "title")
      .populate("set_ids", "setName description duration totalMarks");
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE exam
export const createExam = async (req, res) => {
  try {
    const { subject_id, title, date, total_questions, total_marks, duration } =
      req.body;

    if (
      !subject_id ||
      !title ||
      !total_questions ||
      !total_marks ||
      !duration
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled" });
    }

    const exam = new Exam({
      subject_id,
      title,
      date,
      total_questions,
      total_marks,
      duration,
      createdBy: req.user?._id, // optional if using auth
    });

    await exam.save();
    res.status(201).json({ message: "Exam created successfully", exam });
  } catch (err) {
    console.error("❌ Error creating exam:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE exam
export const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE exam
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.json({ msg: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
