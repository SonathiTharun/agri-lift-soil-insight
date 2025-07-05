const mongoose = require('mongoose');

// Buyer Schema
const buyerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Large Processor', 'Cooperative', 'Local Dairy', 'Export Company']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  contactInfo: {
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  // Quality requirements
  qualityRequirements: {
    minFatContent: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    minSnfContent: {
      type: Number,
      required: true,
      min: 0,
      max: 15
    },
    minVolume: {
      type: Number,
      required: true,
      min: 0
    },
    maxVolume: {
      type: Number,
      required: true,
      min: 0
    },
    requiredCertifications: [{
      type: String,
      trim: true
    }],
    additionalRequirements: {
      type: String,
      trim: true
    }
  },
  // Pricing information
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    premiumRates: {
      fatBonus: {
        type: Number,
        default: 0
      },
      snfBonus: {
        type: Number,
        default: 0
      },
      volumeBonus: {
        type: Number,
        default: 0
      },
      qualityBonus: {
        type: Number,
        default: 0
      }
    },
    priceRange: {
      min: Number,
      max: Number
    }
  },
  // Operational details
  operations: {
    pickupRadius: {
      type: Number,
      required: true,
      min: 0
    },
    pickupTimes: [{
      type: String,
      enum: ['morning', 'evening', 'both', 'flexible']
    }],
    paymentTerms: {
      type: String,
      required: true,
      enum: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly']
    },
    paymentMethods: [{
      type: String,
      enum: ['Bank Transfer', 'UPI', 'Cash', 'Cheque', 'Digital Wallet']
    }],
    collectionCapacity: {
      type: Number,
      required: true,
      min: 0
    }
  },
  // Certifications and compliance
  certifications: [{
    name: {
      type: String,
      required: true
    },
    number: String,
    issuedBy: String,
    validUntil: Date,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  // Business information
  businessInfo: {
    registrationNumber: String,
    gstNumber: String,
    fssaiLicense: String,
    establishedYear: Number,
    annualCapacity: Number,
    processingFacilities: [{
      type: String,
      enum: ['Pasteurization', 'Homogenization', 'Packaging', 'Cold Storage', 'Testing Lab']
    }]
  },
  // Rating and reviews
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    reviews: [{
      farmerId: String,
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      date: {
        type: Date,
        default: Date.now
      },
      verified: {
        type: Boolean,
        default: false
      }
    }]
  },
  // Status and verification
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending_verification', 'suspended'],
    default: 'pending_verification'
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  verificationDocuments: [{
    type: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  // Performance metrics
  performance: {
    totalPurchases: {
      type: Number,
      default: 0
    },
    averageMonthlyVolume: {
      type: Number,
      default: 0
    },
    paymentReliability: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },
    qualityCompliance: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
buyerSchema.index({ location: 1, status: 1 });
buyerSchema.index({ type: 1, status: 1 });
buyerSchema.index({ 'qualityRequirements.minVolume': 1, status: 1 });
buyerSchema.index({ verified: 1, status: 1 });
buyerSchema.index({ 'rating.average': -1, status: 1 });

// Virtual for price display
buyerSchema.virtual('priceDisplay').get(function() {
  if (this.pricing.priceRange && this.pricing.priceRange.min && this.pricing.priceRange.max) {
    return `₹${this.pricing.priceRange.min}-${this.pricing.priceRange.max}/L`;
  }
  return `₹${this.pricing.basePrice}/L`;
});

// Method to check if buyer matches producer requirements
buyerSchema.methods.matchesProducer = function(producer) {
  const matches = {
    volume: producer.dailyVolume >= this.qualityRequirements.minVolume && 
            producer.dailyVolume <= this.qualityRequirements.maxVolume,
    fatContent: producer.fatContent >= this.qualityRequirements.minFatContent,
    snfContent: producer.snfContent >= this.qualityRequirements.minSnfContent,
    certifications: this.qualityRequirements.requiredCertifications.length === 0 ||
                    this.qualityRequirements.requiredCertifications.every(cert => 
                      producer.qualityCertificates.includes(cert))
  };
  
  const score = Object.values(matches).filter(Boolean).length / Object.keys(matches).length * 100;
  return { matches: score === 100, score, details: matches };
};

// Static method to find buyers by location
buyerSchema.statics.findByLocation = function(location, radius = 50) {
  return this.find({
    location: new RegExp(location, 'i'),
    status: 'active',
    verified: true
  }).sort({ 'rating.average': -1, 'performance.paymentReliability': -1 });
};

// Static method to find matching buyers for a producer
buyerSchema.statics.findMatchingBuyers = function(producer) {
  return this.find({
    status: 'active',
    verified: true,
    'qualityRequirements.minVolume': { $lte: producer.dailyVolume },
    'qualityRequirements.maxVolume': { $gte: producer.dailyVolume },
    'qualityRequirements.minFatContent': { $lte: producer.fatContent },
    'qualityRequirements.minSnfContent': { $lte: producer.snfContent }
  }).sort({ 'rating.average': -1, 'pricing.basePrice': -1 });
};

// Method to calculate estimated price for producer
buyerSchema.methods.calculatePrice = function(producer) {
  let price = this.pricing.basePrice;
  
  // Fat content bonus
  if (producer.fatContent > this.qualityRequirements.minFatContent) {
    price += (producer.fatContent - this.qualityRequirements.minFatContent) * this.pricing.premiumRates.fatBonus;
  }
  
  // SNF content bonus
  if (producer.snfContent > this.qualityRequirements.minSnfContent) {
    price += (producer.snfContent - this.qualityRequirements.minSnfContent) * this.pricing.premiumRates.snfBonus;
  }
  
  // Volume bonus
  if (producer.dailyVolume >= 500) {
    price += this.pricing.premiumRates.volumeBonus;
  }
  
  // Quality grade bonus
  const gradeBonus = {
    'A+': this.pricing.premiumRates.qualityBonus * 2,
    'A': this.pricing.premiumRates.qualityBonus * 1.5,
    'B+': this.pricing.premiumRates.qualityBonus,
    'B': 0,
    'C': -this.pricing.premiumRates.qualityBonus
  };
  
  price += gradeBonus[producer.qualityGrade] || 0;
  
  return Math.max(price, this.pricing.priceRange?.min || 0);
};

module.exports = mongoose.model('Buyer', buyerSchema);
