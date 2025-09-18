import Response from '../models/responseModel.js';

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

// CREATE response (instructor/admin)
export const respondToQuery = async (req, res) => {
    try {
        const response = new Response({ ...req.body, user_id: req.user._id });
        await response.save();
        res.status(201).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE response (instructor/admin)
export const editResponse = async (req, res) => {
    try {
        const response = await Response.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user._id },
            req.body,
            { new: true }
        );
        if (!response) return res.status(404).json({ error: 'Response not found or not authorized' });
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE response (instructor/admin)
export const deleteResponse = async (req, res) => {
    try {
        const response = await Response.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
        if (!response) return res.status(404).json({ error: 'Response not found or not authorized' });
        res.json({ msg: 'Response deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
