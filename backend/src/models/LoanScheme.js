const mongoose = require('mongoose');

// Loan Scheme Schema for Executive Management
const loanSchemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0,
    max: 50 // Maximum 50% interest rate
  },
  tenureOptions: [{
    months: {
      type: Number,
      required: true,
      min: 1
    },
    label: String
  }],
  minAmount: {
    type: Number,
    required: true,
    min: 0
  },
  maxAmount: {
    type: Number,
    required: true,
    min: 0
  },
  eligibilityCriteria: [{
    criterion: {
      type: String,
      required: true
    },
    description: String,
    required: {
      type: Boolean,
      default: true
    }
  }],
  requiredDocuments: [{
    document: {
      type: String,
      required: true
    },
    description: String,
    mandatory: {
      type: Boolean,
      default: true
    }
  }],
  features: [String],
  processingFee: {
    type: Number,
    min: 0,
    default: 0
  },
  processingTime: {
    value: Number,
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
      default: 'days'
    }
  },
  applicationDeadline: Date,
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived', 'draft'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'featured', 'hidden'],
    default: 'public'
  },
  targetAudience: [{
    type: String,
    enum: ['small_farmers', 'medium_farmers', 'large_farmers', 'cooperatives', 'agri_businesses']
  }],
  applicationCount: {
    type: Number,
    default: 0
  },
  approvalRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  averageApprovalTime: {
    type: Number, // in days
    default: 0
  },
  createdBy: {
    type: String,
    required: true
  },
  lastModifiedBy: String,
  tags: [String],
  metadata: {
    source: {
      type: String,
      enum: ['manual', 'import', 'api'],
      default: 'manual'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }
}, {
  timestamps: true,
  collection: 'loan_schemes'
});

// Indexes for better performance
loanSchemeSchema.index({ status: 1, visibility: 1 });
loanSchemeSchema.index({ bankName: 1 });
loanSchemeSchema.index({ interestRate: 1 });
loanSchemeSchema.index({ createdAt: -1 });
loanSchemeSchema.index({ tags: 1 });

// Virtual for EMI calculation
loanSchemeSchema.virtual('emiCalculator').get(function() {
  return {
    calculateEMI: (principal, tenure) => {
      const monthlyRate = this.interestRate / (12 * 100);
      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                  (Math.pow(1 + monthlyRate, tenure) - 1);
      return Math.round(emi);
    }
  };
});

// Static methods
loanSchemeSchema.statics.findActive = function() {
  return this.find({ status: 'active', visibility: { $ne: 'hidden' } })
    .sort({ createdAt: -1 });
};

loanSchemeSchema.statics.findFeatured = function() {
  return this.find({ 
    status: 'active', 
    visibility: 'featured' 
  }).sort({ interestRate: 1 });
};

loanSchemeSchema.statics.getSchemeStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgInterestRate: { $avg: '$interestRate' },
        totalApplications: { $sum: '$applicationCount' }
      }
    }
  ]);
};

// Instance methods
loanSchemeSchema.methods.calculateEMI = function(principal, tenureMonths) {
  const monthlyRate = this.interestRate / (12 * 100);
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
};

loanSchemeSchema.methods.isEligible = function(farmerProfile) {
  // Basic eligibility check logic
  // This can be expanded based on specific criteria
  return true; // Placeholder
};

const LoanScheme = mongoose.model('LoanScheme', loanSchemeSchema);

module.exports = LoanScheme;
