const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentOrder',
    required: true
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
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  gateway: {
    type: String,
    enum: ['razorpay', 'payu', 'cashfree', 'stripe'],
    required: true
  },
  gatewayTransactionId: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'bank_transfer'],
    required: true
  },
  buyerId: {
    type: String,
    required: true
  },
  sellerId: {
    type: String,
    required: true
  },
  fees: {
    gateway: {
      type: Number,
      default: 0
    },
    platform: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  netAmount: {
    type: Number,
    required: true
  },
  failureReason: {
    type: String,
    trim: true
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: {
    type: String,
    trim: true
  },
  completedAt: {
    type: Date
  },
  failedAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
paymentTransactionSchema.index({ buyerId: 1, status: 1 });
paymentTransactionSchema.index({ sellerId: 1, status: 1 });
paymentTransactionSchema.index({ gateway: 1, gatewayTransactionId: 1 });
paymentTransactionSchema.index({ createdAt: -1 });
paymentTransactionSchema.index({ status: 1, createdAt: -1 });

// Virtual for transaction fee percentage
paymentTransactionSchema.virtual('feePercentage').get(function() {
  return this.amount > 0 ? (this.fees.total / this.amount) * 100 : 0;
});

// Method to mark transaction as completed
paymentTransactionSchema.methods.markAsCompleted = function(gatewayResponse) {
  this.status = 'completed';
  this.completedAt = new Date();
  this.gatewayResponse = gatewayResponse;
  return this.save();
};

// Method to mark transaction as failed
paymentTransactionSchema.methods.markAsFailed = function(reason, gatewayResponse) {
  this.status = 'failed';
  this.failureReason = reason;
  this.failedAt = new Date();
  this.gatewayResponse = gatewayResponse;
  return this.save();
};

// Method to process refund
paymentTransactionSchema.methods.processRefund = function(amount, reason) {
  this.status = 'refunded';
  this.refundAmount = amount;
  this.refundReason = reason;
  this.refundedAt = new Date();
  return this.save();
};

// Static method to get transaction statistics
paymentTransactionSchema.statics.getStatistics = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        totalFees: { $sum: '$fees.total' }
      }
    }
  ]);
};

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
