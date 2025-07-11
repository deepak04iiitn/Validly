import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    profilePicture : {
        type : String,
        default : "https://www.pngall.com/wp-content/uploads/5/Profile.png",
        // Stores the Cloudinary image URL
    },
    isUserAdmin : {
        type : Boolean,
        default : false,
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
        type: String, // Founder / Co-Founder / Hustler
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
        type: [
            {
                description: { type: String, required: true },
                github: { type: String, default: '' },
                live: { type: String, default: '' },
            }
        ],
        default: [],
    },
    userType: {
        type: String, // Student or Working Professional
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
} , {timestamps : true})

const User = mongoose.model('User' , userSchema);

export default User;