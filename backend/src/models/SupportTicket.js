const mongoose = require('mongoose');

// Support Ticket Schema for Farmer Communication
const supportTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  userType: {
    type: String,
    enum: ['farmer', 'executive'],
    default: 'farmer'
  },
  subject: {
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
  category: {
    type: String,
    required: true,
    enum: [
      'technical_support',
      'product_inquiry',
      'order_issue',
      'payment_problem',
      'soil_analysis',
      'crop_recommendation',
      'loan_assistance',
      'general_inquiry',
      'complaint',
      'feature_request'
    ]
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting_for_customer', 'resolved', 'closed'],
    default: 'open',
    index: true
  },
  assignedTo: {
    type: String, // Executive user ID
    index: true
  },
  assignedBy: String,
  assignedAt: Date,
  messages: [{
    messageId: {
      type: String,
      required: true
    },
    senderId: {
      type: String,
      required: true
    },
    senderType: {
      type: String,
      enum: ['farmer', 'executive', 'system'],
      required: true
    },
    senderName: String,
    content: {
      type: String,
      required: true
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'system_note'],
      default: 'text'
    },
    attachments: [{
      filename: String,
      originalName: String,
      mimeType: String,
      size: Number,
      url: String
    }],
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isInternal: {
      type: Boolean,
      default: false // Internal notes between executives
    }
  }],
  tags: [String],
  relatedOrders: [String], // Order IDs
  relatedProducts: [String], // Product IDs
  customerSatisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    ratedAt: Date
  },
  resolution: {
    summary: String,
    resolvedBy: String,
    resolvedAt: Date,
    resolutionTime: Number, // in hours
    followUpRequired: {
      type: Boolean,
      default: false
    },
    followUpDate: Date
  },
  escalation: {
    isEscalated: {
      type: Boolean,
      default: false
    },
    escalatedTo: String,
    escalatedBy: String,
    escalatedAt: Date,
    escalationReason: String
  },
  sla: {
    responseTime: Number, // in hours
    resolutionTime: Number, // in hours
    isBreached: {
      type: Boolean,
      default: false
    }
  },
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'email', 'phone'],
      default: 'web'
    },
    userAgent: String,
    ipAddress: String,
    location: {
      state: String,
      district: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    }
  }
}, {
  timestamps: true,
  collection: 'support_tickets'
});

// Indexes for better performance
supportTicketSchema.index({ userId: 1, status: 1 });
supportTicketSchema.index({ assignedTo: 1, status: 1 });
supportTicketSchema.index({ category: 1, priority: 1 });
supportTicketSchema.index({ createdAt: -1 });
supportTicketSchema.index({ ticketId: 1 });
supportTicketSchema.index({ 'messages.timestamp': -1 });

// Pre-save middleware to generate ticket ID
supportTicketSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketId) {
    const count = await this.constructor.countDocuments();
    this.ticketId = `TKT${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Static methods
supportTicketSchema.statics.findByUser = function(userId, options = {}) {
  const { limit = 10, skip = 0, status } = options;
  const query = { userId };
  if (status) query.status = status;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

supportTicketSchema.statics.findByAssignee = function(assignedTo, options = {}) {
  const { limit = 10, skip = 0, status } = options;
  const query = { assignedTo };
  if (status) query.status = status;
  
  return this.find(query)
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

supportTicketSchema.statics.getTicketStats = function(startDate, endDate) {
  const matchStage = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgResolutionTime: { $avg: '$resolution.resolutionTime' }
      }
    }
  ]);
};

// Instance methods
supportTicketSchema.methods.addMessage = function(senderId, senderType, content, messageType = 'text', attachments = []) {
  const messageId = `MSG${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  
  this.messages.push({
    messageId,
    senderId,
    senderType,
    content,
    messageType,
    attachments,
    timestamp: new Date(),
    isRead: false
  });
  
  return this.save();
};

supportTicketSchema.methods.assignTo = function(executiveId, assignedBy) {
  this.assignedTo = executiveId;
  this.assignedBy = assignedBy;
  this.assignedAt = new Date();
  this.status = 'in_progress';
  
  return this.save();
};

supportTicketSchema.methods.resolve = function(resolvedBy, summary) {
  this.status = 'resolved';
  this.resolution = {
    summary,
    resolvedBy,
    resolvedAt: new Date(),
    resolutionTime: (new Date() - this.createdAt) / (1000 * 60 * 60) // in hours
  };
  
  return this.save();
};

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

module.exports = SupportTicket;
