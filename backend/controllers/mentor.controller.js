import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

// Apply for mentorship
export const applyMentor = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const mentorApplication = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        if (user.isMentor && user.mentorProfile.mentorStatus === 'approved') {
            return next(errorHandler(400, 'User is already an approved mentor'));
        }

        // Check if user already has a pending application
        if (user.isMentor && user.mentorProfile.mentorStatus === 'pending') {
            return next(errorHandler(400, 'You already have a pending mentor application'));
        }

        user.mentorProfile = {
            ...mentorApplication,
            mentorStatus: 'pending'
        };
        user.isMentor = true;

        await user.save();
        
        res.status(200).json({ 
            success: true, 
            message: 'Mentor application submitted successfully' 
        });
    } catch (error) {
        next(error);
    }
};

// Get all mentor applications (admin only)
export const getMentorApplications = async (req, res, next) => {
    try {
        if (!req.user.isUserAdmin) {
            return next(errorHandler(403, 'Admin access required'));
        }

        const { status } = req.query; // 'pending', 'approved', 'rejected', or undefined for all

        let query = { isMentor: true };
        
        if (status && ['pending', 'approved', 'rejected'].includes(status)) {
            query['mentorProfile.mentorStatus'] = status;
        }

        const applications = await User.find(query, '-password');
        
        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// Get mentor applications by status (admin only)
export const getMentorApplicationsByStatus = async (req, res, next) => {
    try {
        if (!req.user.isUserAdmin) {
            return next(errorHandler(403, 'Admin access required'));
        }

        const { status } = req.params; // 'pending', 'approved', 'rejected'

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return next(errorHandler(400, 'Invalid status parameter'));
        }

        const applications = await User.find({ 
            isMentor: true,
            'mentorProfile.mentorStatus': status 
        }, '-password');
        
        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// Approve/Reject mentor application (admin only)
export const updateApplicationStatus = async (req, res, next) => {
    try {
        if (!req.user.isUserAdmin) {
            return next(errorHandler(403, 'Admin access required'));
        }

        const { userId } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return next(errorHandler(400, 'Invalid status'));
        }

        const user = await User.findById(userId);
        if (!user || !user.isMentor) {
            return next(errorHandler(404, 'Mentor application not found'));
        }

        user.mentorProfile.mentorStatus = status;
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: `Mentor application ${status} successfully` 
        });
    } catch (error) {
        next(error);
    }
};

// Mentor dashboard data
export const getMentorDashboard = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        if (!user.isMentor) {
            return next(errorHandler(403, 'Mentor access required'));
        }

        res.status(200).json({
            success: true,
            mentorProfile: user.mentorProfile,
            mentorStatus: user.mentorProfile.mentorStatus
        });
    } catch (error) {
        next(error);
    }
};