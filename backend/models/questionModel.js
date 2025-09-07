import mongoose from 'mongoose';

const { Schema, Schema: { ObjectId } } = mongoose;

const questionSchema = new Schema({
    exam_id: {
        type: ObjectId,
        required: true,
        ref: 'Exam'
    },
    text: {
        type: String,
        required: true
    },
    options: {
        type: [String]
    },
    correct_answer: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);