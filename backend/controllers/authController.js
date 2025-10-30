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
        // Destructure all fields from the request body, including the new ones
        const {
            name,
            email,
            password,
            phone,
            role,
            semester,
            specialization,
            skills,
            experience,
            about,
            payScale,
            address,
            availability,
            qualification,
            certifications
        } = req.body;

        // Validation for existing email remains
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new User instance, including all available fields from the request body
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            semester,
            specialization,
            skills,
            experience,
            about,
            payScale,
            address,
            availability,
            qualification,
            certifications,
            isVerified: false, // Explicitly set if needed, though default is 'false'
        });
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

        // Respond with success message and user data
        res.status(201).json({ msg: 'User registered successfully. Please verify your email.', user });
    } catch (err) {
        // Handle server-side errors
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Server error during registration.', details: err.message });
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
 * Sign-in (Updated to set is_active: true)
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

        // ⭐ ACTION: Set user status to active and save
        user.is_active = true;
        await user.save();
        // ⭐

        const token = jwt.sign({ _id: user._id, role: user.role ,semester: user.semester}, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        const { _id, name, role, semester, is_active } = user;
        res.json({ token, user: { _id, name, email, semester, role, is_active } });

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
 * Get Current Authenticated User (user/me)
 * =====================
 */
export const getMe = async (req, res) => {
    try {
        // req.auth is set by the requireSignin middleware and contains the decoded JWT payload
        const userId = req.auth._id; 
        
        // Find the user by ID and exclude the password field
        const user = await User.findById(userId).select('-password');

        if (!user) {
            // This case should ideally not happen if the token is valid, 
            // but it's a good safety check if the user was deleted after the token was issued.
            return res.status(404).json({ error: 'Authenticated user not found' });
        }

        res.json(user);
    } catch (err) {
        // Handle server-side errors
        console.error(err);
        res.status(500).json({ error: 'Server error retrieving user data.', details: err.message });
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
        
        // 1. Destructure ALL fields sent from the frontend request body
        const { 
            name, email, phone, semester, specialization, experience, about, payScale, address, qualification,
            title, company, location, availability, 
            languages, skills, certifications 
        } = req.body;

        // Ensure only the authenticated user or an admin can update (Authorization check remains)
        if (req.auth._id !== userId && req.auth.role !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to update this profile.' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Check if the new email already exists for another user (Email check remains)
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Email is already taken by another user' });
            }
        }
        
        // 2. Explicitly assign all fields, using hasOwnProperty to allow saving empty strings/arrays
        
        // Primary user fields
        if (Object.prototype.hasOwnProperty.call(req.body, 'name')) user.name = name;
        if (Object.prototype.hasOwnProperty.call(req.body, 'email')) user.email = email;
        if (Object.prototype.hasOwnProperty.call(req.body, 'phone')) user.phone = phone;
        if (Object.prototype.hasOwnProperty.call(req.body, 'specialization')) user.specialization = specialization;
        if (Object.prototype.hasOwnProperty.call(req.body, 'experience')) user.experience = experience;
        if (Object.prototype.hasOwnProperty.call(req.body, 'about')) user.about = about;
        if (Object.prototype.hasOwnProperty.call(req.body, 'payScale')) user.payScale = payScale;
        if (Object.prototype.hasOwnProperty.call(req.body, 'address')) user.address = address;
     
        // if (Object.prototype.hasOwnProperty.call(req.body, 'role')) user.role = role; // Role should typically not be updated here
       
        // Academic fields
        if (Object.prototype.hasOwnProperty.call(req.body, 'semester')) user.semester = semester;

        // General Profile detail fields
        if (Object.prototype.hasOwnProperty.call(req.body, 'title')) user.title = title;
        if (Object.prototype.hasOwnProperty.call(req.body, 'qualification')) user.qualification = qualification;
        if (Object.prototype.hasOwnProperty.call(req.body, 'company')) user.company = company;
        if (Object.prototype.hasOwnProperty.call(req.body, 'location')) user.location = location;
        if (Object.prototype.hasOwnProperty.call(req.body, 'availability')) user.availability = availability;
        
        // Array/List fields
        if (Object.prototype.hasOwnProperty.call(req.body, 'languages')) user.languages = languages;
        if (Object.prototype.hasOwnProperty.call(req.body, 'skills')) user.skills = skills;
        if (Object.prototype.hasOwnProperty.call(req.body, 'certifications')) user.certifications = certifications;
        
        // Other fields
        if (Object.prototype.hasOwnProperty.call(req.body, 'semester')) {
            user.semester = semester;
        }
        
        // 3. Save the updated document
        await user.save();

        res.json({ msg: 'User updated successfully', user });
    } catch (err) {
        // Send a 500 error if any server/database error occurs
        res.status(500).json({ error: err.message });
    }
};

/**
 * =====================
 * Middleware for Role-based Access
 * =====================
 */
// ... (rest of your middleware code remains the same)
export const requireUser = (req, res, next) => {
  const allowedRoles = ["admin", "expert", "student"];
  if (!req.auth || !allowedRoles.includes(req.auth.role)) {
    return res
      .status(403)
      .json({ error: "Access denied. Role not assigned to user." });
  }
  next();
};



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

// Expert only
export const requireInstructor = (req, res, next) => {
    if (req.auth.role !== 'expert' && req.auth.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Experts only.' });
    }
    next();
};

// Student only
export const requireStudent = (req, res, next) => {
  if (!req.auth) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  if (req.auth.role !== "student") {
    return res.status(403).json({ message: "Access denied. Students only." });
  }
  next();
};

/**
 * =====================
 * Signout (Ensures is_active is set to false)
 * =====================
 */
export const signout = async (req, res) => {
    // 🛑 CRITICAL: This relies on your router having requireSignin middleware.
    if (req.auth && req.auth._id) {
        try {
            // Use findByIdAndUpdate for a direct, atomic update without fetching the whole document first.
            await User.findByIdAndUpdate(
                req.auth._id,
                { is_active: false }
                // We don't need { new: true } since we aren't returning the user data
            );
            
            // Log for confirmation (optional, but good for debugging)
            console.log(`User ID ${req.auth._id} set to inactive.`);

        } catch (error) {
            // Log the database error but proceed with clearing the cookie
            console.error("MongoDB error during signout status update:", error);
            // NOTE: Even if DB update fails, the user is still logged out by clearing the cookie.
        }
    } else {
        // This runs if the user clears their cookie manually or the token expired
        console.warn("Attempted signout without valid token (no req.auth found).");
    }

    // Always clear the cookie
    res.clearCookie('token');
    res.json({ msg: 'Signout success' });
};