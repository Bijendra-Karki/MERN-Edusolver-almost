import Exam from '../models/examModel.js';
import Subject from '../models/subjectModel.js';

// GET all exams
export const getExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate('subject_id', 'title');
        res.json(exams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET exam by ID
export const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id).populate('subject_id', 'title');
        if (!exam) return res.status(404).json({ error: 'Exam not found' });
        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE exam
export const createExam = async (req, res) => {
    try {
        const exam = new Exam(req.body);
        await exam.save();
        res.status(201).json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE exam
export const updateExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!exam) return res.status(404).json({ error: 'Exam not found' });
        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE exam
export const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);
        if (!exam) return res.status(404).json({ error: 'Exam not found' });
        res.json({ msg: 'Exam deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
