import mongoose from 'mongoose';

const { Schema, Schema: { ObjectId } } = mongoose;

const querySchema = new Schema({
    user_id: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    subject_id: {
        type: ObjectId,
        required: true,
        ref: 'Subject'
    },
    text: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'in-progress'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.model('Query', querySchema);