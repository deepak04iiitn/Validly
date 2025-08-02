import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/payment.model.js';
import Job from '../models/job.model.js';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
const createPaymentOrder = async (req, res) => {
  try {
    const { amount = 10000 } = req.body; // 100 INR = 10000 paise
    const userId = req.user.id;

    const options = {
      amount, // amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        purpose: 'job_posting',
        userId
      }
    };

    const order = await razorpay.orders.create(options);
    
    // Save payment record
    const payment = new Payment({
      userId,
      orderId: order.id,
      amount,
      currency: order.currency,
      purpose: 'job_posting'
    });

    await payment.save();

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      jobData 
    } = req.body;

    const userId = req.user.id;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: 'paid'
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Create job posting
    const job = new Job({
      ...jobData,
      postedBy: userId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

    await job.save();

    // Update payment with job ID
    payment.jobId = job._id;
    await payment.save();

    res.json({
      success: true,
      message: 'Payment verified and job posted successfully',
      jobId: job._id
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
};

export { createPaymentOrder, verifyPayment };