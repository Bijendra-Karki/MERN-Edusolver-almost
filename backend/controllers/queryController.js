import Query from '../models/queryModel.js';
import Response from '../models/responseModel.js';

// GET all queries (admin/instructor)
export const getQueries = async (req, res) => {
    try {
        const queries = await Query.find()
            .populate('user_id', 'name email')
            .populate('subject_id', 'title');
        res.json(queries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET query by ID (students can view their own)
export const getQueryById = async (req, res) => {
    try {
        const query = await Query.findById(req.params.id)
            .populate('user_id', 'name email')
            .populate('subject_id', 'title');
        if (!query) return res.status(404).json({ error: 'Query not found' });
        res.json(query);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE query (students)
export const submitQuery = async (req, res) => {
    try {
        const query = new Query({ ...req.body, user_id: req.user._id });
        await query.save();
        res.status(201).json(query);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE query (students can edit their query)
export const editQuery = async (req, res) => {
    try {
        const query = await Query.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user._id },
            req.body,
            { new: true }
        );
        if (!query) return res.status(404).json({ error: 'Query not found or not authorized' });
        res.json(query);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE query (students can delete their query)
export const deleteQuery = async (req, res) => {
    try {
        const query = await Query.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
        if (!query) return res.status(404).json({ error: 'Query not found or not authorized' });
        await Response.deleteMany({ query_id: query._id });
        res.json({ msg: 'Query and related responses deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
