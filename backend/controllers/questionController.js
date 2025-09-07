import Question from '../models/questionModel.js';
import Exam from '../models/examModel.js';

// GET all questions
export const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find().populate('exam_id', 'title');
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET question by ID
export const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id).populate('exam_id', 'title');
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE question
export const createQuestion = async (req, res) => {
    try {
        const question = new Question(req.body);
        await question.save();
        res.status(201).json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE question
export const updateQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE question
export const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.json({ msg: 'Question deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
