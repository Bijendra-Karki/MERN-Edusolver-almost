// ===== Imports =====
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan'
// ===== Load environment variables FIRST =====
dotenv.config();

import authRoutes from './routes/authRoutes.js';
import queryRoutes from './routes/queryRoutes.js';
import examRoutes from './routes/examRoutes.js';
import paymentRoutes from "./routes/enroll/paymentRoutes.js"
import responseRoutes from "./routes/responseRoutes.js"
import questionRoutes from './routes/questionRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';


// ===== DB Connection =====
import connection from './db/connection.js';


const app = express();


// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'));  // serve uploaded files



// ===== Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/response', responseRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subjects', subjectRoutes);
app.use("/api/enrollments", paymentRoutes);



// ===== Error handling =====
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Invalid token' });
  } else {
    res.status(500).json({ error: err.message });
  }
});

// ===== Server Startup =====
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`✅ Server started on port ${port}`);
});
