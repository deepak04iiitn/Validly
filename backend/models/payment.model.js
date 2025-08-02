import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderId: { 
    type: String, 
    required: true 
  },
  paymentId: String,
  signature: String,
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'INR' 
  },
  status: { 
    type: String, 
    enum: ['created', 'paid', 'failed'],
    default: 'created' 
  },
  purpose: { 
    type: String, 
    enum: ['job_posting'],
    required: true 
  },
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job' 
  }
}, {
  timestamps: true
});

export default mongoose.model('Payment', paymentSchema);