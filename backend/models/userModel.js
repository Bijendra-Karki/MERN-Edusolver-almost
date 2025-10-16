// User.js (Mongoose Model)

import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    
    // --- Primary User Authentication Fields ---
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'expert', 'admin'],
        default: 'student',
        required: true
    },
    isVerified: { type: Boolean, default: false },

    // --- Profile Detail Fields ---
    phone: {
        type: String,
        trim: true,
        default: null,
    },
    semester: {
        type: String,
        trim: true,
        default: null,
    },
    experience: {
        type: String,
        trim: true,
        default: null,
    },
    about: {
        type: String,
        trim: true,
        default: null,
    },
    payScale: {
        type: String,
        trim: true,
        default: null,
    },
    address: { // Corresponds to location prop in frontend
        type: String,
        trim: true,
        default: null,
    },
    availability: {
        type: String,
        trim: true,
        default: null,
    },
    company:{
        type: String,
        trim: true,
        default: null,
    },
    response_time: {
        type: String,
        trim: true,
        default: null
    },
    is_active: {
        type: Boolean,
        default: false
    },
    
    // 🌟 FIX: Array Fields must use [String] 🌟
    specialization: {
        type: [String], 
        trim: true,
        default: [],
    },
    skills: {
        type: [String], 
        trim: true,
        default: [],
    },
    qualification: {
        type: [String], 
        trim: true,
        default: [],
    },
    certifications: {
        type: [String], 
        trim: true,
        default: [],
    },
    rate:{
        type: Number,
        default: 0
    },
    title: {
        type: String,
        trim: true,
        default: null,
    },
    languages: {    
        type: [String],
        trim: true,
        default: [],
    },

}, { timestamps: true });

export default mongoose.model('User', userSchema);