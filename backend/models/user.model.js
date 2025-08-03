import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/Profile.png",
    },
    isUserAdmin: {
        type: Boolean,
        default: false,
    },
    fullName: {
        type: String,
        default: '',
    },
    skills: {
        type: [String],
        default: [],
    },
    location: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        default: '',
    },
    resumeLink: {
        type: String,
        default: '',
    },
    portfolio: {
        type: String,
        default: '',
    },
    github: {
        type: String,
        default: '',
    },
    bestWorks: {
        type: [{
            description: { type: String, required: true },
            github: { type: String, default: '' },
            live: { type: String, default: '' },
        }],
        default: [],
    },
    userType: {
        type: String,
        default: '',
    },
    degree: {
        type: String,
        default: '',
    },
    branch: {
        type: String,
        default: '',
    },
    year: {
        type: String,
        default: '',
    },
    companyName: {
        type: String,
        default: '',
    },
    position: {
        type: String,
        default: '',
    },
    yoe: {
        type: String,
        default: '',
    },
    lookingFor: {
        type: String,
        default: '',
    },
    organizationName: {
        type: String,
        default: '',
    },
    isProfileCompleted: {
        type: Boolean,
        default: false,
    },
    securityQuestion: {
        type: String,
        required: true,
    },
    securityAnswerHash: {
        type: String,
        required: true,
    },
    isPaidHiring: {
        type: Boolean,
        default: false
    },
    isMentor: {
        type: Boolean,
        default: false,
    },
    mentorProfile: {
        phoneNumber: { type: String, default: '' },
        timezone: { type: String, default: '' },
        currentRole: { type: String, default: '' },
        currentOrganization: { type: String, default: '' },
        linkedIn: { type: String, default: '' },
        portfolioUrl: { type: String, default: '' },
        pastExperience: { type: String, default: '' },
        expertiseDomains: { type: [String], default: [] },
        mentorshipTopics: { type: [String], default: [] },
        sessionTypes: { type: [String], default: [] },
        sessionPrice: { type: Number, default: 0 },
        sessionDuration: { type: String, default: '' },
        availableSlots: [{
            day: String,
            times: [String]
        }],
        bookingNotice: { type: String, default: '' },
        bankDetails: {
            accountNumber: { type: String, default: '' },
            paymentMethod: { type: String, default: '' },
        },
        shortBio: { type: String, default: '' },
        detailedBio: { type: String, default: '' },
        languages: { type: [String], default: [] },
        visibility: { type: String, enum: ['public', 'invite-only'], default: 'public' },
        communityInvolvement: {
            groupAMA: { type: Boolean, default: false },
            contentWriting: { type: Boolean, default: false },
            competitionJudge: { type: Boolean, default: false }
        },
        mentorStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        complianceAgreed: { type: Boolean, default: false }
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;