import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { 
    createSession,
    getAllSessions,
    getMentorSessions,
    getSessionById,
    updateSession,
    deleteSession,
    joinSession,
    getMentorProfile
} from '../controllers/session.controller.js';

const router = express.Router();

// Create session (mentor only)
router.post('/create', verifyUser, createSession);

// Get all active sessions (public)
router.get('/all', getAllSessions);

// Get sessions by mentor (mentor only)
router.get('/my-sessions', verifyUser, getMentorSessions);

// Get mentor profile (public)
router.get('/mentor/:mentorId', getMentorProfile);

// Get session by ID
router.get('/:sessionId', getSessionById);

// Update session (mentor only)
router.put('/:sessionId', verifyUser, updateSession);

// Delete session (mentor only)
router.delete('/:sessionId', verifyUser, deleteSession);

// Join session (user)
router.post('/:sessionId/join', verifyUser, joinSession);

export default router; 