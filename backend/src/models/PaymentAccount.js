const mongoose = require('mongoose');

const paymentAccountSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  accountHolderName: {
    type: String,
    required: true,
    trim: true
  },
  upiId: {
    type: String,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationDate: {
    type: Date
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  rejectionReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
paymentAccountSchema.index({ userId: 1, status: 1 });
paymentAccountSchema.index({ accountNumber: 1 }, { unique: true });

// Ensure only one default account per user
paymentAccountSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.model('PaymentAccount', paymentAccountSchema);
