import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const pollSchema = new mongoose.Schema({
  pollId: { type: String, default: uuidv4 },
  question: { type: String, required: true },
  options: [
    {
      optionId: { type: String, default: uuidv4 },
      text: { type: String, required: true },
      votes: { type: [String], default: [] }, // user IDs who voted
    }
  ],
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const commentSchema = new mongoose.Schema({
  commentId: { type: String, default: uuidv4 },
  userId: { type: String, required: true },
  userFullName: { type: String, required: true },
  text: { type: String, required: true },
  likes: { type: [String], default: [] },
  dislikes: { type: [String], default: [] },
  replies: [
    {
      replyId: { type: String, default: uuidv4 },
      userId: { type: String, required: true },
      userFullName: { type: String, required: true },
      text: { type: String, required: true },
      likes: { type: [String], default: [] },
      dislikes: { type: [String], default: [] },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ideaSchema = new mongoose.Schema({
  problem: { type: String, required: true },
  solution: { type: String, required: true },
  stage: { 
    type: String, 
    required: true,
    enum: ['Concept', 'Prototype', 'MVP', 'Beta', 'Production'],
    default: 'Concept'
  },
  link: { type: String },
  autoDeleteAfterDays: { type: Number },
  likes: { type: [String], default: [] },
  numberOfLikes: { type: Number, default: 0 },
  dislikes: { type: [String], default: [] },
  numberOfDislikes: { type: Number, default: 0 },
  userRef: { type: String, required: true },
  polls: [pollSchema],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Idea = mongoose.model('Idea', ideaSchema);
export default Idea; 