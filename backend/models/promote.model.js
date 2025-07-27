import mongoose from "mongoose";

const promoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    likes: { 
        type: [String], 
        default: [] 
    },
    numberOfLikes: { 
        type: Number, 
        default: 0 
    },
    dislikes: { 
        type: [String], 
        default: [] 
    },
    numberOfDislikes: { 
        type: Number, 
        default: 0 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const Promote = mongoose.model('Promote', promoteSchema);

export default Promote;