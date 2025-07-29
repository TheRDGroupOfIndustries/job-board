import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'inactive'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  jobPostLimit: {
    type: Number,
    default: 5 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: String 
  }
}, {
  timestamps: true
});

export const Subscription = mongoose.model('Subscription', subscriptionSchema);