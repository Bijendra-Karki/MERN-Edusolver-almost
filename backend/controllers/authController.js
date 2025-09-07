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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * =====================
 * Register a new user
 * =====================
 */
export const postUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
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
        emailTemplate=emailTemplate.replace('{{url}}',verificationUrl)

        await sendEmail({
            from: 'no-reply@edusolver.com',
            to: user.email,
            subject: 'Email Verification Link',
            html: emailTemplate
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
        const user = await User.findOne({ email });
        if (!user) return res.status(403).json({ error: 'Email not registered' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Incorrect password' });
        if (!user.isVerified) return res.status(400).json({ error: 'Please verify your email first' });

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

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

        const templatePath = path.join(__dirname, 'passwordResetTemplate.html');
        let emailTemplate = await fs.readFile(templatePath, "utf-8");
        const verificationUrl = `${process.env.FRONTEND_URL}/reset/password/${token.token}`;
        emailTemplate=emailTemplate.replace('{{url}}',verificationUrl)

        await sendEmail({
            from: 'no-reply@edusolver.com',
            to: user.email,
            subject: 'Password Reset Link',
            html: emailTemplate
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
 * Middleware for Role-based Access
 * =====================
 */

// Require authentication
export const requireUser = expressjwt({
    
    secret: "hello",
    algorithms: ['HS256'],
    requestProperty: 'auth'
});


export const requireSignin = expressjwt({
  secret: "hello",   // must exist in your .env file
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
