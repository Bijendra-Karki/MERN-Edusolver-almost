import Query from '../models/queryModel.js';
import Response from '../models/responseModel.js';

// GET all queries
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

// GET query by ID
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

// CREATE query
export const createQuery = async (req, res) => {
    try {
        const query = new Query(req.body);
        await query.save();
        res.status(201).json(query);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE query (status, text, etc.)
export const updateQuery = async (req, res) => {
    try {
        const query = await Query.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!query) return res.status(404).json({ error: 'Query not found' });
        res.json(query);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE query
export const deleteQuery = async (req, res) => {
    try {
        const query = await Query.findByIdAndDelete(req.params.id);
        if (!query) return res.status(404).json({ error: 'Query not found' });
        // Also delete all associated responses
        await Response.deleteMany({ query_id: query._id });
        res.json({ msg: 'Query and related responses deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
