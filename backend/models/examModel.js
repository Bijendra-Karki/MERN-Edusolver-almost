import mongoose from 'mongoose';

const { Schema, Schema: { ObjectId } } = mongoose;

const examSchema = new Schema({
    subject_id: {
        type: ObjectId,
        required: true,
        ref: 'Subject'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    total_marks: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    }
}, { timestamps: true });

export default mongoose.model('Exam', examSchema);