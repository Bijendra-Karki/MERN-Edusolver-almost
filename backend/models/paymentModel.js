// paymentModel.js (No changes needed, the existing model is fine)
import mongoose from 'mongoose';

const { Schema, Schema: { ObjectId } } = mongoose;

const paymentSchema = new Schema({
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
    amount: {
        type: Number,
        required: true
    },
 
    method: {
        type: String,
        enum: ['eSewa', 'Khalti', 'Cash', 'Other'],
        default: 'eSewa'
    },
    // CRUCIAL: External transaction reference ID. 
    // Pre-redirection: Stores the payment's own _id.toHexString() (Our internal UUID)
    // Post-verification: Stores the actual eSewa Reference ID (CRN)
    gateway_ref_id: { 
        type: String,
        unique: true,
        sparse: true 
    },
    // 1. Transaction status (from the gateway)
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    // 2. Verification status (from your server-to-server check)
    verification_status: { 
        type: String,
        enum: ['unverified', 'verified', 'invalid_data'],
        default: 'unverified'
    },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);