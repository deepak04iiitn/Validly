import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  company: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  requirements: [{ 
    type: String 
  }],
  location: { 
    type: String, 
    required: true 
  },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' }
  },
  jobType: { 
    type: String, 
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true 
  },
  experience: {
    min: Number,
    max: Number
  },
  skills: [{ 
    type: String 
  }],
  contactEmail: { 
    type: String, 
  },
  contactPhone: String,
  applicationDeadline: Date,
  applyLink: {
    type: String,
    required: true
  },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  paymentId: { 
    type: String, 
    required: true 
  },
  orderId: { 
    type: String, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  applicants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedAt: { type: Date, default: Date.now },
    resume: String,
    coverLetter: String
  }]
}, {
  timestamps: true
});

jobSchema.index({ title: 'text', description: 'text', company: 'text' });

export default mongoose.model('Job', jobSchema);