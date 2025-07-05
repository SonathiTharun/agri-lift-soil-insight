const mongoose = require('mongoose');

// Milk Production Schema
const milkProductionSchema = new mongoose.Schema({
  farmerId: {
    type: String,
    required: true,
    index: true
  },
  farmerName: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  farmAddress: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  dailyVolume: {
    type: Number,
    required: true,
    min: 0
  },
  fatContent: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  snfContent: {
    type: Number,
    required: true,
    min: 0,
    max: 15
  },
  collectionTime: {
    type: String,
    required: true,
    enum: ['morning', 'evening', 'both']
  },
  qualityCertificates: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending_verification'],
    default: 'pending_verification'
  },
  verificationDate: {
    type: Date
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  // Pricing and buyer matching
  expectedPrice: {
    type: Number,
    min: 0
  },
  matchedBuyers: [{
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Buyer'
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100
    },
    contactedAt: Date,
    status: {
      type: String,
      enum: ['matched', 'contacted', 'negotiating', 'agreed', 'rejected'],
      default: 'matched'
    }
  }],
  // Quality metrics
  qualityGrade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C'],
    default: 'B'
  },
  testResults: [{
    testDate: {
      type: Date,
      default: Date.now
    },
    fatContent: Number,
    snfContent: Number,
    proteinContent: Number,
    lactoseContent: Number,
    totalSolids: Number,
    acidity: Number,
    density: Number,
    freezingPoint: Number,
    bacterialCount: Number,
    somaticCellCount: Number,
    adulteration: {
      type: Boolean,
      default: false
    },
    testLab: String,
    certificationNumber: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
milkProductionSchema.index({ farmerId: 1, status: 1 });
milkProductionSchema.index({ location: 1, status: 1 });
milkProductionSchema.index({ qualityGrade: 1, status: 1 });
milkProductionSchema.index({ dailyVolume: 1, status: 1 });

// Virtual for total monthly volume
milkProductionSchema.virtual('monthlyVolume').get(function() {
  return this.dailyVolume * 30;
});

// Method to calculate quality score
milkProductionSchema.methods.calculateQualityScore = function() {
  let score = 0;
  
  // Fat content scoring (3.5% is ideal)
  if (this.fatContent >= 3.5) score += 25;
  else if (this.fatContent >= 3.0) score += 20;
  else if (this.fatContent >= 2.5) score += 15;
  else score += 10;
  
  // SNF content scoring (8.5% is ideal)
  if (this.snfContent >= 8.5) score += 25;
  else if (this.snfContent >= 8.0) score += 20;
  else if (this.snfContent >= 7.5) score += 15;
  else score += 10;
  
  // Volume scoring
  if (this.dailyVolume >= 500) score += 25;
  else if (this.dailyVolume >= 200) score += 20;
  else if (this.dailyVolume >= 100) score += 15;
  else score += 10;
  
  // Certification bonus
  if (this.qualityCertificates.length > 0) score += 25;
  else score += 10;
  
  return Math.min(score, 100);
};

// Static method to find producers by location
milkProductionSchema.statics.findByLocation = function(location, radius = 50) {
  return this.find({
    location: new RegExp(location, 'i'),
    status: 'active'
  }).sort({ qualityGrade: 1, dailyVolume: -1 });
};

// Static method to find producers by quality grade
milkProductionSchema.statics.findByQuality = function(minGrade = 'B') {
  const gradeOrder = ['C', 'B', 'B+', 'A', 'A+'];
  const minIndex = gradeOrder.indexOf(minGrade);
  const validGrades = gradeOrder.slice(minIndex);
  
  return this.find({
    qualityGrade: { $in: validGrades },
    status: 'active'
  }).sort({ qualityGrade: 1, dailyVolume: -1 });
};

// Pre-save middleware to calculate quality grade
milkProductionSchema.pre('save', function(next) {
  if (this.isModified('fatContent') || this.isModified('snfContent') || this.isModified('dailyVolume')) {
    const score = this.calculateQualityScore();
    
    if (score >= 90) this.qualityGrade = 'A+';
    else if (score >= 80) this.qualityGrade = 'A';
    else if (score >= 70) this.qualityGrade = 'B+';
    else if (score >= 60) this.qualityGrade = 'B';
    else this.qualityGrade = 'C';
  }
  next();
});

module.exports = mongoose.model('MilkProduction', milkProductionSchema);
