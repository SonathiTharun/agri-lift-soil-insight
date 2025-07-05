const mongoose = require('mongoose');

const paymentOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  buyerId: {
    type: String,
    required: true
  },
  sellerId: {
    type: String,
    required: true
  },
  milkProductionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MilkProduction',
    required: true
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed', 'cancelled', 'refunded'],
    default: 'created'
  },
  escrowStatus: {
    type: String,
    enum: ['held', 'released', 'refunded'],
    default: 'held'
  },
  razorpayOrderId: {
    type: String,
    required: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'bank_transfer']
  },
  failureReason: {
    type: String,
    trim: true
  },
  paidAt: {
    type: Date
  },
  escrowReleasedAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
paymentOrderSchema.index({ buyerId: 1, status: 1 });
paymentOrderSchema.index({ sellerId: 1, status: 1 });
paymentOrderSchema.index({ razorpayOrderId: 1 });
paymentOrderSchema.index({ createdAt: -1 });

// Virtual for total amount in paise (for Razorpay)
paymentOrderSchema.virtual('amountInPaise').get(function() {
  return this.amount * 100;
});

// Method to mark payment as completed
paymentOrderSchema.methods.markAsPaid = function(paymentId, signature, method) {
  this.status = 'paid';
  this.razorpayPaymentId = paymentId;
  this.razorpaySignature = signature;
  this.paymentMethod = method;
  this.paidAt = new Date();
  return this.save();
};

// Method to release escrow
paymentOrderSchema.methods.releaseEscrow = function() {
  this.escrowStatus = 'released';
  this.escrowReleasedAt = new Date();
  return this.save();
};

// Method to mark as failed
paymentOrderSchema.methods.markAsFailed = function(reason) {
  this.status = 'failed';
  this.failureReason = reason;
  return this.save();
};

module.exports = mongoose.model('PaymentOrder', paymentOrderSchema);
