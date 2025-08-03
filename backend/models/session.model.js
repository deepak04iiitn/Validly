import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    sessionType: {
        type: String,
        enum: ['1:1', 'group', 'workshop'],
        required: true
    },
    topics: [{
        type: String,
        required: true
    }],
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    maxParticipants: {
        type: Number,
        default: 1
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    timeSlot: {
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    },
    timezone: {
        type: String,
        required: true
    },
    meetingLink: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    participants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['registered', 'attended', 'cancelled'],
            default: 'registered'
        }
    }],
    requirements: [{
        type: String
    }],
    materials: [{
        type: String
    }]
}, {
    timestamps: true
});

sessionSchema.index({ mentorId: 1, scheduledDate: 1 });
sessionSchema.index({ isActive: 1, scheduledDate: 1 });

export default mongoose.model('Session', sessionSchema); 