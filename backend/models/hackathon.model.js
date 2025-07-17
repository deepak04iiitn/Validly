import mongoose from 'mongoose';

const hackathonTeammatePostSchema = new mongoose.Schema({
  hackathonName: { type: String, required: true },
  hackathonLink: { type: String, required: true },
  teammatesRequired: { type: Number, required: true },
  skills: { type: [String], required: true },
  prize: { type: String },
  location: { type: String, required: true },
  city: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Full', 'In Progress'], default: 'Open' },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const HackathonTeammatePost = mongoose.model('HackathonTeammatePost', hackathonTeammatePostSchema);
export default HackathonTeammatePost; 