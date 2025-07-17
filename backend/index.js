import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.route.js';
import cron from 'node-cron';
import ideaRoutes from './routes/idea.route.js';
import { autoDeleteExpiredIdeas } from './controllers/idea.controller.js';
import hackathonRoutes from './routes/hackathon.route.js';

dotenv.config();


const __dirname = path.resolve();
const app = express();

// Configure CORS with specific options
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


app.use('/backend/auth', authRoutes);
app.use('/backend/ideas', ideaRoutes);
app.use('/backend/hackathon-posts', hackathonRoutes);

// Serve resumes as static files
app.use('/uploads/resumes', express.static(path.resolve('uploads/resumes')));


// Ping endpoint to keep backend awake
app.get('/backend/ping', (req, res) => {
  res.status(200).send('pong');
});


app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Handle frontend routes - only catch routes that don't start with /backend
app.get(/^(?!\/backend).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
});

// Cron job: run every day at midnight
cron.schedule('0 0 * * *', async () => {
  await autoDeleteExpiredIdeas();
  console.log('Auto-deleted expired ideas');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

