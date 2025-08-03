import Session from '../models/session.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

// Create a new session (mentor only)
export const createSession = async (req, res, next) => {
    try {
        const mentorId = req.user.id;
        const sessionData = req.body;

        // Check if user is an approved mentor
        const user = await User.findById(mentorId);
        if (!user || !user.isMentor || user.mentorProfile.mentorStatus !== 'approved') {
            return next(errorHandler(403, 'Only approved mentors can create sessions'));
        }

        const session = new Session({
            ...sessionData,
            mentorId
        });

        await session.save();

        res.status(201).json({
            success: true,
            message: 'Session created successfully',
            data: session
        });
    } catch (error) {
        next(error);
    }
};

// Get all active sessions
export const getAllSessions = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, mentorId, sessionType } = req.query;
        
        let query = { isActive: true };
        
        if (mentorId) {
            query.mentorId = mentorId;
        }
        
        if (sessionType) {
            query.sessionType = sessionType;
        }

        const sessions = await Session.find(query)
            .populate('mentorId', 'username email mentorProfile')
            .sort({ scheduledDate: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Session.countDocuments(query);

        res.status(200).json({
            success: true,
            data: sessions,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
};

// Get sessions by mentor
export const getMentorSessions = async (req, res, next) => {
    try {
        const mentorId = req.user.id;
        
        const sessions = await Session.find({ mentorId })
            .sort({ scheduledDate: 1 });

        res.status(200).json({
            success: true,
            data: sessions
        });
    } catch (error) {
        next(error);
    }
};

// Get session by ID
export const getSessionById = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        
        const session = await Session.findById(sessionId)
            .populate('mentorId', 'username email mentorProfile')
            .populate('participants.userId', 'username email');

        if (!session) {
            return next(errorHandler(404, 'Session not found'));
        }

        res.status(200).json({
            success: true,
            data: session
        });
    } catch (error) {
        next(error);
    }
};

// Update session (mentor only)
export const updateSession = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const mentorId = req.user.id;
        const updateData = req.body;

        const session = await Session.findById(sessionId);
        
        if (!session) {
            return next(errorHandler(404, 'Session not found'));
        }

        if (session.mentorId.toString() !== mentorId) {
            return next(errorHandler(403, 'You can only update your own sessions'));
        }

        const updatedSession = await Session.findByIdAndUpdate(
            sessionId,
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Session updated successfully',
            data: updatedSession
        });
    } catch (error) {
        next(error);
    }
};

// Delete session (mentor only)
export const deleteSession = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const mentorId = req.user.id;

        const session = await Session.findById(sessionId);
        
        if (!session) {
            return next(errorHandler(404, 'Session not found'));
        }

        if (session.mentorId.toString() !== mentorId) {
            return next(errorHandler(403, 'You can only delete your own sessions'));
        }

        await Session.findByIdAndDelete(sessionId);

        res.status(200).json({
            success: true,
            message: 'Session deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Join session (user)
export const joinSession = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;

        const session = await Session.findById(sessionId);
        
        if (!session) {
            return next(errorHandler(404, 'Session not found'));
        }

        if (!session.isActive) {
            return next(errorHandler(400, 'Session is not active'));
        }

        // Check if user is already registered
        const alreadyRegistered = session.participants.some(
            participant => participant.userId.toString() === userId
        );

        if (alreadyRegistered) {
            return next(errorHandler(400, 'You are already registered for this session'));
        }

        // Check if session is full
        if (session.participants.length >= session.maxParticipants) {
            return next(errorHandler(400, 'Session is full'));
        }

        session.participants.push({
            userId,
            status: 'registered'
        });

        await session.save();

        res.status(200).json({
            success: true,
            message: 'Successfully registered for session'
        });
    } catch (error) {
        next(error);
    }
};

// Get mentor profile for public view
export const getMentorProfile = async (req, res, next) => {
    try {
        const { mentorId } = req.params;
        
        // Validate ObjectId format
        if (!mentorId || !mentorId.match(/^[0-9a-fA-F]{24}$/)) {
            return next(errorHandler(400, 'Invalid mentor ID format'));
        }
        
        const mentor = await User.findById(mentorId)
            .select('username email mentorProfile isMentor')
            .populate('mentorProfile');

        if (!mentor) {
            return next(errorHandler(404, 'Mentor not found'));
        }

        // Check if user has mentor profile data, even if isMentor is false
        if (!mentor.mentorProfile) {
            return next(errorHandler(404, 'Mentor profile not found'));
        }

        // Only show public profile data (excluding sensitive information)
        const publicProfile = {
            username: mentor.username,
            shortBio: mentor.mentorProfile.shortBio || '',
            detailedBio: mentor.mentorProfile.detailedBio || '',
            expertiseDomains: mentor.mentorProfile.expertiseDomains || [],
            mentorshipTopics: mentor.mentorProfile.mentorshipTopics || [],
            sessionPrice: mentor.mentorProfile.sessionPrice || 0,
            sessionDuration: mentor.mentorProfile.sessionDuration || '',
            languages: mentor.mentorProfile.languages || [],
            currentRole: mentor.mentorProfile.currentRole || '',
            currentOrganization: mentor.mentorProfile.currentOrganization || '',
            linkedIn: mentor.mentorProfile.linkedIn || '',
            portfolioUrl: mentor.mentorProfile.portfolioUrl || '',
            pastExperience: mentor.mentorProfile.pastExperience || '',
            sessionTypes: mentor.mentorProfile.sessionTypes || [],
            bookingNotice: mentor.mentorProfile.bookingNotice || '',
            visibility: mentor.mentorProfile.visibility || 'public',
            communityInvolvement: mentor.mentorProfile.communityInvolvement || {}
        };

        res.status(200).json({
            success: true,
            data: publicProfile
        });
    } catch (error) {
        next(error);
    }
}; 