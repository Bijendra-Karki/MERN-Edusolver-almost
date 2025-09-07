import mongoose from 'mongoose';
const { Schema } = mongoose;

const enrollmentSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subject_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Subject'
    },
    date: {
        type: Date,
        default: Date.now
    },
    exam_score: {
        type: Number,
        default: null
    }
}, { timestamps: true });

export default mongoose.model('Enrollment', enrollmentSchema);
