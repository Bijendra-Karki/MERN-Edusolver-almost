import mongoose from 'mongoose';

const { Schema, Schema: { ObjectId } } = mongoose;

const paymentSchema = new Schema({
    user_id: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    enrollment_id: {
        type: ObjectId,
        required: true,
        ref: 'Enrollment'
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    method: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);