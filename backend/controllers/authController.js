import User from '../models/userModel.js';
import Token from '../models/tokenModel.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import path from 'path';
import fs from "fs/promises";
import bcrypt from 'bcryptjs';
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * =====================
 * Register a new user
 * =====================
 */
export const postUser = async (req, res) => {
    try {
        const { name, email, password, phone, role, semester } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, phone, role, semester });
        await user.save();

        // create email verification token
        let token = new Token({
            token: crypto.randomBytes(16).toString('hex'),
            userId: user._id
        });
        await token.save();

        // load template and send email
        // load email template
        const templatePath = path.join(__dirname, "emailTemplate.html");
        let emailTemplate = await fs.readFile(templatePath, "utf-8");

        const verificationUrl = `${process.env.FRONTEND_URL}/email/confirmation/${token.token}`;
        //replace placeholder by verification url
        emailTemplate = emailTemplate.replace('{{url}}', verificationUrl)
        let urldata = `http://localhost:8000/api/auth/confirmation/${token.token}`

        await sendEmail({
            from: 'no-reply@edusolver.com',
            to: user.email,
            subject: 'Email Verification Link',
            html: emailTemplate,
            text: `verify your account:
                 ${urldata}
                  `
        });

        res.status(201).json({ msg: 'User registered successfully. Please verify your email.', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * =====================
 * Confirm email
 * =====================
 */
export const postEmailConfirmation = async (req, res) => {
    try {
        const token = await Token.findOne({ token: req.params.token });
        if (!token) return res.status(400).json({ error: 'Invalid or expired token' });

        const user = await User.findById(token.userId);
        if (!user) return res.status(400).json({ error: 'User not found' });
        if (user.isVerified) return res.status(400).json({ error: 'Email already verified' });

        user.isVerified = true;
        await user.save();

        res.json({ msg: 'Email verified successfully. You can now log in.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * =====================
 * Sign-in
 * =====================
 */
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(403).json({ error: 'Email not registered' });

        // ✅ Check password using bcrypt
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Incorrect password' });

        // Check email verification
        if (!user.isVerified) return res.status(400).json({ error: 'Please verify your email first' });

        // Generate JWT token
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set token in httpOnly cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        // Return token and user info
        const { _id, name, role } = user;
        res.json({ token, user: { _id, name, email, role } });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * =====================
 * Forget Password
 * =====================
 */
export const forgetPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ error: 'Email not found' });

        const token = new Token({ userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        await token.save();

        const templatePath = path.join(__dirname, 'passwordReset.html');
        let emailTemplate = await fs.readFile(templatePath, "utf-8");
        const verificationUrl = `${process.env.FRONTEND_URL}/reset/password/${token.token}`;
        emailTemplate = emailTemplate.replace('{{url}}', verificationUrl)
        let urldata = `http://localhost:8000/api/auth/reset/password/${token.token}`

        await sendEmail({
            from: 'no-reply@edusolver.com',
            to: user.email,
            subject: 'Password Reset Link',
            html: emailTemplate,
            text: `Reset your account:
                 ${urldata}`
        });

        res.json({ msg: 'Password reset link sent to your email' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * =====================
 * Reset Password
 * =====================
 */
export const resetPassword = async (req, res) => {
    try {
        const token = await Token.findOne({ token: req.params.token });
        if (!token) return res.status(400).json({ error: 'Invalid or expired token' });

        const user = await User.findById(token.userId);
        if (!user) return res.status(400).json({ error: 'User not found' });

        user.password = await bcrypt.hash(req.body.password, 10);
        await user.save();

        res.json({ msg: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * =====================
 * User List & Details
 * =====================
 */
export const userList = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const userDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * =====================
 * Update a user
 * =====================
 */
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, phone, semester } = req.body;

        // Ensure only the authenticated user or an admin can update
        if (req.auth._id !== userId && req.auth.role !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to update this profile.' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Check if the new email already exists for another user
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Email is already taken by another user' });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        
        // This is the corrected line to handle empty strings
        if (Object.prototype.hasOwnProperty.call(req.body, 'semester')) {
            user.semester = semester;
        }

        await user.save();

        res.json({ msg: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * =====================
 * Middleware for Role-based Access
 * =====================
 */
// ... (rest of your middleware code remains the same)
export const requireUser = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'auth'
});


export const requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,   // must exist in your .env file
    algorithms: ["HS256"],            // algorithm used when signing
    requestProperty: "auth"           // this will attach decoded token to req.auth
});

// Admin only
export const requireAdmin = (req, res, next) => {
    if (req.auth.role !== 'admin') return res.status(403).json({ error: 'Access denied. Admins only.' });
    next();
};

// Instructor (teacher) only
export const requireInstructor = (req, res, next) => {
    if (req.auth.role !== 'instructor' && req.auth.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Instructors only.' });
    }
    next();
};

// Student only
export const requireStudent = (req, res, next) => {
    if (req.auth.role !== 'student') return res.status(403).json({ error: 'Access denied. Students only.' });
    next();
};

/**
 * =====================
 * Signout
 * =====================
 */
export const signout = (req, res) => {
    res.clearCookie('token');
    res.json({ msg: 'Signout success' });
};