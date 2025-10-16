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
        ref: 'Subject' // Links to your Subject model
    },
    // CRITICAL: Links to the successful and verified Payment record
    payment_id: { 
        type: Schema.Types.ObjectId,
        required: true, // Enforcement for paid subjects
        ref: 'Payment' // Links to your Payment model
    },
    // Access status (The student's right to view content)
    access_status: { 
        type: String,
        enum: ['active', 'expired', 'suspended'],
        default: 'active'
    },
    
}, { timestamps: true });

// Ensures a user can only be enrolled once per subject
enrollmentSchema.index({ user_id: 1, subject_id: 1 }, { unique: true }); 

export default mongoose.model('Enrollment', enrollmentSchema);