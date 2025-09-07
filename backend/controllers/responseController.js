import Response from '../models/responseModel.js';

// GET all responses
export const getResponses = async (req, res) => {
    try {
        const responses = await Response.find()
            .populate('user_id', 'name email')
            .populate('query_id', 'text');
        res.json(responses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET responses by query ID
export const getResponsesByQuery = async (req, res) => {
    try {
        const responses = await Response.find({ query_id: req.params.queryId })
            .populate('user_id', 'name email');
        res.json(responses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE response
export const createResponse = async (req, res) => {
    try {
        const response = new Response(req.body);
        await response.save();
        res.status(201).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE response
export const updateResponse = async (req, res) => {
    try {
        const response = await Response.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!response) return res.status(404).json({ error: 'Response not found' });
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE response
export const deleteResponse = async (req, res) => {
    try {
        const response = await Response.findByIdAndDelete(req.params.id);
        if (!response) return res.status(404).json({ error: 'Response not found' });
        res.json({ msg: 'Response deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
