import Subject from '../models/subjectModel.js';

// ======================
// CREATE SUBJECT (Admin)
// ======================
export const createSubject = async (req, res) => {
  try {
    const {
      title,
      instructor,
      duration,
      level,
      category,
      description,
      price,
      skills,
      lessons,
      certificates,
      language,
      estimatedHours
    } = req.body;

    if (!req.files?.image) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const newSubject = new Subject({
      title,
      instructor,
      instructorAvatar: req.body.instructorAvatar, // Optional, falls back to default
      duration,
      level,
      category,
      description,
      price,
      skills,
      lessons,
      certificates,
      language,
      estimatedHours,
      image: req.files.image[0].path,
      subjectFile: req.files.subjectFile ? req.files.subjectFile[0].path : undefined,
    });

    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================
// GET ALL SUBJECTS
// ======================
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('category'); // populate category field
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================
// GET SINGLE SUBJECT BY ID
// ======================
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('category'); // populate category
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================
// UPDATE SUBJECT (Admin)
// ======================
export const updateSubject = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.files?.image) updates.image = req.files.image[0].path;
    if (req.files?.subjectFile) updates.subjectFile = req.files.subjectFile[0].path;

    const subject = await Subject.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================
// DELETE SUBJECT (Admin)
// ======================
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json({ msg: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================
// UPDATE RATING (User submits rating)
// ======================
export const updateRating = async (req, res) => {
  try {
    const { rating } = req.body;

    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    // Use subject.students and subject.reviews
    const totalRatings = subject.rating * subject.reviews;
    const newReviews = subject.reviews + 1;
    const newRating = (totalRatings + rating) / newReviews;

    subject.rating = newRating;
    subject.reviews = newReviews;

    // This is where you would also increment the students field
    subject.students = (subject.students || 0) + 1;

    await subject.save();
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};