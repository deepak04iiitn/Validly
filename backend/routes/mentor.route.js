import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { 
    applyMentor, 
    getMentorApplications, 
    getMentorApplicationsByStatus,
    updateApplicationStatus, 
    getMentorDashboard,
    updateMentorApplication
} from '../controllers/mentor.controller.js';

const router = express.Router();

// Apply for mentorship
router.post('/apply', verifyUser, applyMentor);

// Get all mentor applications (admin only)
router.get('/applications', verifyUser, getMentorApplications);

// Get mentor applications by status (admin only)
router.get('/applications/:status', verifyUser, getMentorApplicationsByStatus);

// Approve/Reject mentor application (admin only)
router.post('/application/:userId', verifyUser, updateApplicationStatus);

// Mentor dashboard data
router.get('/dashboard', verifyUser, getMentorDashboard);

// Update mentor application
router.put('/update-application', verifyUser, updateMentorApplication);

export default router;