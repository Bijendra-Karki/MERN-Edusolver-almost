import e from 'express';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    // Looking to send emails in production? Check out our Email API/SMTP product!

    name: {
        type: String,
        required: true,
        trim: true
    },
      phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      
    },
    semester: {
        type: String,
        trim: true,
        default: null,
        // required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    }
    ,
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student',
        required: true
    },
    is_active: {
    type: Boolean,
    default: true
    },
      isVerified: { type: Boolean, default: false }



}, { timestamps: true });

export default mongoose.model('User', userSchema);