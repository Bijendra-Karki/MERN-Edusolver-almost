import Enrollment from '../models/enrollmentModel.js';
import User from '../models/userModel.js';
import Subject from '../models/subjectModel.js';
import crypto from 'crypto'; // import crypto for HMAC

// GET all enrollments
export const getEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate('user_id', 'name email')
            .populate('subject_id', 'title');
        res.json(enrollments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET enrollment by ID
export const getEnrollmentById = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id)
            .populate('user_id', 'name email')
            .populate('subject_id', 'title');
        if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
        res.json(enrollment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE enrollment
export const createEnrollment = async (req, res) => {
    try {
        const { user_id, subject_id } = req.body;
        const existing = await Enrollment.findOne({ user_id, subject_id });
        if (existing) return res.status(409).json({ error: 'User already enrolled in this subject' });

        const enrollment = new Enrollment(req.body);
        await enrollment.save();
        res.status(201).json(enrollment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE enrollment
export const updateEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
        res.json(enrollment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE enrollment
export const deleteEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
        if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
        res.json({ msg: 'Enrollment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Esewa signature generation
export const generateSignature = (req, res) => {
  const { total_amount, transaction_uuid, product_code } = req.body;

  const dataToSign = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  // use secret key to create HMAC SHA256 signature
  const secretKey = process.env.ESEWA_SECRET_KEY;
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(dataToSign)
    .digest('base64');

  res.json({ signature });
};
