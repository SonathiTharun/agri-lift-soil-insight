const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Product, ProductCategory } = require('../models/Product');
const LoanScheme = require('../models/LoanScheme');
const SupportTicket = require('../models/SupportTicket');
const Order = require('../models/Order');
const User = require('../models/User');
const { authenticateToken, requireExecutive } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input data',
      details: errors.array()
    });
  }
  next();
};

// ==================== PRODUCT MANAGEMENT ====================

// GET /api/executive/categories - Get all product categories
router.get('/categories',
  authenticateToken,
  requireExecutive,
  async (req, res) => {
    try {
      const categories = await ProductCategory.find({ isActive: true })
        .sort({ sortOrder: 1, name: 1 });

      res.json({
        success: true,
        data: { categories },
        message: 'Categories retrieved successfully'
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        error: 'Failed to fetch categories',
        message: error.message
      });
    }
  }
);

// GET /api/executive/products - Get all products with executive view
router.get('/products', 
  authenticateToken,
  requireExecutive,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['active', 'inactive', 'all']),
    query('category').optional().isMongoId(),
    query('search').optional().isLength({ min: 1 })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      const { status, category, search } = req.query;

      // Build query
      let query = {};
      
      if (status && status !== 'all') {
        query.isActive = status === 'active';
      }
      
      if (category) {
        query.categoryId = category;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'manufacturer.brand': { $regex: search, $options: 'i' } }
        ];
      }

      const products = await Product.find(query)
        .populate('categoryId', 'name description')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const total = await Product.countDocuments(query);

      // Get low stock products
      const lowStockProducts = await Product.find({
        stock: { $lt: 10 },
        isActive: true
      }).countDocuments();

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          },
          stats: {
            total,
            lowStock: lowStockProducts
          }
        }
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        error: 'Failed to fetch products',
        message: error.message
      });
    }
  }
);

// POST /api/executive/products - Create new product
router.post('/products',
  authenticateToken,
  requireExecutive,
  upload.array('images', 5),
  [
    body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Name is required'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('categoryId').isMongoId().withMessage('Valid category ID is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be non-negative'),
    body('unit').isIn(['kg', 'litre', 'piece', 'box', 'packet']).withMessage('Invalid unit')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        name, description, categoryId, price, stock, unit,
        specifications, manufacturer, certifications, features,
        weight, dimensions, shelfLife, storageInstructions,
        usageInstructions, isActive, isFeatured
      } = req.body;

      // Handle uploaded images
      const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

      const product = new Product({
        name,
        description,
        categoryId,
        price: parseFloat(price),
        stock: parseInt(stock),
        unit,
        images,
        specifications: specifications ? JSON.parse(specifications) : {},
        manufacturer: manufacturer ? JSON.parse(manufacturer) : {},
        certifications: certifications ? JSON.parse(certifications) : [],
        features: features ? JSON.parse(features) : [],
        weight: weight ? JSON.parse(weight) : {},
        dimensions: dimensions ? JSON.parse(dimensions) : {},
        shelfLife: shelfLife ? JSON.parse(shelfLife) : {},
        storageInstructions,
        usageInstructions,
        isActive: isActive === 'true',
        isFeatured: isFeatured === 'true'
      });

      await product.save();

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product }
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        error: 'Failed to create product',
        message: error.message
      });
    }
  }
);

// PUT /api/executive/products/:id - Update product
router.put('/products/:id',
  authenticateToken,
  requireExecutive,
  upload.array('newImages', 5),
  [
    body('name').optional().trim().isLength({ min: 1, max: 200 }),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Handle new images
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => `/uploads/${file.filename}`);
        
        if (updateData.existingImages) {
          const existingImages = JSON.parse(updateData.existingImages);
          updateData.images = [...existingImages, ...newImages];
        } else {
          updateData.images = newImages;
        }
      }

      // Parse JSON fields
      ['specifications', 'manufacturer', 'certifications', 'features', 'weight', 'dimensions', 'shelfLife'].forEach(field => {
        if (updateData[field]) {
          updateData[field] = JSON.parse(updateData[field]);
        }
      });

      // Convert boolean strings
      if (updateData.isActive !== undefined) {
        updateData.isActive = updateData.isActive === 'true';
      }
      if (updateData.isFeatured !== undefined) {
        updateData.isFeatured = updateData.isFeatured === 'true';
      }

      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('categoryId', 'name description');

      if (!product) {
        return res.status(404).json({
          error: 'Product not found',
          message: 'The specified product does not exist'
        });
      }

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: { product }
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        error: 'Failed to update product',
        message: error.message
      });
    }
  }
);

// DELETE /api/executive/products/:id - Delete product
router.delete('/products/:id',
  authenticateToken,
  requireExecutive,
  async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return res.status(404).json({
          error: 'Product not found',
          message: 'The specified product does not exist'
        });
      }

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        error: 'Failed to delete product',
        message: error.message
      });
    }
  }
);

// POST /api/executive/products/bulk-update - Bulk update products
router.post('/products/bulk-update',
  authenticateToken,
  requireExecutive,
  [
    body('productIds').isArray().withMessage('Product IDs must be an array'),
    body('updates').isObject().withMessage('Updates must be an object')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { productIds, updates } = req.body;

      const result = await Product.updateMany(
        { _id: { $in: productIds } },
        updates
      );

      res.json({
        success: true,
        message: `${result.modifiedCount} products updated successfully`,
        data: { modifiedCount: result.modifiedCount }
      });
    } catch (error) {
      console.error('Bulk update error:', error);
      res.status(500).json({
        error: 'Failed to update products',
        message: error.message
      });
    }
  }
);

// ==================== LOAN SCHEME MANAGEMENT ====================

// GET /api/executive/loan-schemes - Get all loan schemes
router.get('/loan-schemes',
  authenticateToken,
  requireExecutive,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['active', 'inactive', 'archived', 'draft', 'all']),
    query('search').optional().isLength({ min: 1 })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      const { status, search } = req.query;

      let query = {};

      if (status && status !== 'all') {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { bankName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const schemes = await LoanScheme.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const total = await LoanScheme.countDocuments(query);

      res.json({
        success: true,
        data: {
          schemes,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get loan schemes error:', error);
      res.status(500).json({
        error: 'Failed to fetch loan schemes',
        message: error.message
      });
    }
  }
);

// POST /api/executive/loan-schemes - Create new loan scheme
router.post('/loan-schemes',
  authenticateToken,
  requireExecutive,
  [
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('bankName').trim().isLength({ min: 1 }).withMessage('Bank name is required'),
    body('interestRate').isFloat({ min: 0, max: 50 }).withMessage('Interest rate must be between 0 and 50'),
    body('minAmount').isFloat({ min: 0 }).withMessage('Minimum amount must be positive'),
    body('maxAmount').isFloat({ min: 0 }).withMessage('Maximum amount must be positive')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const schemeData = {
        ...req.body,
        createdBy: req.user._id
      };

      const scheme = new LoanScheme(schemeData);
      await scheme.save();

      res.status(201).json({
        success: true,
        message: 'Loan scheme created successfully',
        data: { scheme }
      });
    } catch (error) {
      console.error('Create loan scheme error:', error);
      res.status(500).json({
        error: 'Failed to create loan scheme',
        message: error.message
      });
    }
  }
);

// PUT /api/executive/loan-schemes/:id - Update loan scheme
router.put('/loan-schemes/:id',
  authenticateToken,
  requireExecutive,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        lastModifiedBy: req.user._id
      };

      const scheme = await LoanScheme.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!scheme) {
        return res.status(404).json({
          error: 'Loan scheme not found',
          message: 'The specified loan scheme does not exist'
        });
      }

      res.json({
        success: true,
        message: 'Loan scheme updated successfully',
        data: { scheme }
      });
    } catch (error) {
      console.error('Update loan scheme error:', error);
      res.status(500).json({
        error: 'Failed to update loan scheme',
        message: error.message
      });
    }
  }
);

// DELETE /api/executive/loan-schemes/:id - Delete loan scheme
router.delete('/loan-schemes/:id',
  authenticateToken,
  requireExecutive,
  async (req, res) => {
    try {
      const { id } = req.params;

      const scheme = await LoanScheme.findByIdAndDelete(id);

      if (!scheme) {
        return res.status(404).json({
          error: 'Loan scheme not found',
          message: 'The specified loan scheme does not exist'
        });
      }

      res.json({
        success: true,
        message: 'Loan scheme deleted successfully'
      });
    } catch (error) {
      console.error('Delete loan scheme error:', error);
      res.status(500).json({
        error: 'Failed to delete loan scheme',
        message: error.message
      });
    }
  }
);

// ==================== ORDER MANAGEMENT ====================

// GET /api/executive/orders - Get all orders with executive view
router.get('/orders',
  authenticateToken,
  requireExecutive,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'all']),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      const { status, startDate, endDate } = req.query;

      let query = {};

      if (status && status !== 'all') {
        query.status = status;
      }

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const orders = await Order.find(query)
        .populate('items.productId', 'name images')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const total = await Order.countDocuments(query);

      // Get order statistics
      const stats = await Order.getOrderStats(startDate, endDate);

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          },
          stats
        }
      });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        error: 'Failed to fetch orders',
        message: error.message
      });
    }
  }
);

// PUT /api/executive/orders/:id/status - Update order status
router.put('/orders/:id/status',
  authenticateToken,
  requireExecutive,
  [
    body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']).withMessage('Invalid status'),
    body('note').optional().trim().isLength({ max: 500 })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status, note, trackingNumber } = req.body;

      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({
          error: 'Order not found',
          message: 'The specified order does not exist'
        });
      }

      // Update order status
      order.status = status;
      if (trackingNumber) order.trackingNumber = trackingNumber;

      // Add to status history
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Status changed to ${status}`,
        updatedBy: req.user._id
      });

      // Set specific timestamps based on status
      if (status === 'delivered') {
        order.deliveredAt = new Date();
      } else if (status === 'cancelled') {
        order.cancelledAt = new Date();
        if (note) order.cancellationReason = note;
      } else if (status === 'returned') {
        order.returnedAt = new Date();
        if (note) order.returnReason = note;
      }

      await order.save();

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: { order }
      });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        error: 'Failed to update order status',
        message: error.message
      });
    }
  }
);

// POST /api/executive/orders/bulk-update - Bulk update order status
router.post('/orders/bulk-update',
  authenticateToken,
  requireExecutive,
  [
    body('orderIds').isArray().withMessage('Order IDs must be an array'),
    body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
    body('note').optional().trim().isLength({ max: 500 })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { orderIds, status, note } = req.body;

      const updatePromises = orderIds.map(async (orderId) => {
        const order = await Order.findById(orderId);
        if (order) {
          order.status = status;
          order.statusHistory.push({
            status,
            timestamp: new Date(),
            note: note || `Bulk status change to ${status}`,
            updatedBy: req.user._id
          });
          return order.save();
        }
      });

      await Promise.all(updatePromises);

      res.json({
        success: true,
        message: `${orderIds.length} orders updated successfully`
      });
    } catch (error) {
      console.error('Bulk update orders error:', error);
      res.status(500).json({
        error: 'Failed to update orders',
        message: error.message
      });
    }
  }
);

// ==================== SUPPORT TICKET MANAGEMENT ====================

// GET /api/executive/support-tickets - Get all support tickets
router.get('/support-tickets',
  authenticateToken,
  requireExecutive,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['open', 'in_progress', 'waiting_for_customer', 'resolved', 'closed', 'all']),
    query('priority').optional().isIn(['low', 'medium', 'high', 'urgent', 'all']),
    query('assignedTo').optional().isString()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      const { status, priority, assignedTo } = req.query;

      let query = {};

      if (status && status !== 'all') {
        query.status = status;
      }

      if (priority && priority !== 'all') {
        query.priority = priority;
      }

      if (assignedTo) {
        query.assignedTo = assignedTo;
      }

      const tickets = await SupportTicket.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const total = await SupportTicket.countDocuments(query);

      // Get ticket statistics
      const stats = await SupportTicket.getTicketStats();

      res.json({
        success: true,
        data: {
          tickets,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          },
          stats
        }
      });
    } catch (error) {
      console.error('Get support tickets error:', error);
      res.status(500).json({
        error: 'Failed to fetch support tickets',
        message: error.message
      });
    }
  }
);

// PUT /api/executive/support-tickets/:id/assign - Assign ticket to executive
router.put('/support-tickets/:id/assign',
  authenticateToken,
  requireExecutive,
  [
    body('assignedTo').isString().withMessage('Assigned to is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { assignedTo } = req.body;

      const ticket = await SupportTicket.findById(id);

      if (!ticket) {
        return res.status(404).json({
          error: 'Ticket not found',
          message: 'The specified ticket does not exist'
        });
      }

      await ticket.assignTo(assignedTo, req.user._id);

      res.json({
        success: true,
        message: 'Ticket assigned successfully',
        data: { ticket }
      });
    } catch (error) {
      console.error('Assign ticket error:', error);
      res.status(500).json({
        error: 'Failed to assign ticket',
        message: error.message
      });
    }
  }
);

// POST /api/executive/support-tickets/:id/messages - Add message to ticket
router.post('/support-tickets/:id/messages',
  authenticateToken,
  requireExecutive,
  upload.array('attachments', 3),
  [
    body('content').trim().isLength({ min: 1 }).withMessage('Message content is required'),
    body('messageType').optional().isIn(['text', 'image', 'file', 'system_note']),
    body('isInternal').optional().isBoolean()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { content, messageType = 'text', isInternal = false } = req.body;

      const ticket = await SupportTicket.findById(id);

      if (!ticket) {
        return res.status(404).json({
          error: 'Ticket not found',
          message: 'The specified ticket does not exist'
        });
      }

      // Handle attachments
      const attachments = req.files ? req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`
      })) : [];

      await ticket.addMessage(req.user._id, 'executive', content, messageType, attachments);

      res.json({
        success: true,
        message: 'Message added successfully',
        data: { ticket }
      });
    } catch (error) {
      console.error('Add message error:', error);
      res.status(500).json({
        error: 'Failed to add message',
        message: error.message
      });
    }
  }
);

// PUT /api/executive/support-tickets/:id/resolve - Resolve ticket
router.put('/support-tickets/:id/resolve',
  authenticateToken,
  requireExecutive,
  [
    body('summary').trim().isLength({ min: 1 }).withMessage('Resolution summary is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { summary } = req.body;

      const ticket = await SupportTicket.findById(id);

      if (!ticket) {
        return res.status(404).json({
          error: 'Ticket not found',
          message: 'The specified ticket does not exist'
        });
      }

      await ticket.resolve(req.user._id, summary);

      res.json({
        success: true,
        message: 'Ticket resolved successfully',
        data: { ticket }
      });
    } catch (error) {
      console.error('Resolve ticket error:', error);
      res.status(500).json({
        error: 'Failed to resolve ticket',
        message: error.message
      });
    }
  }
);

// ==================== ANALYTICS & DASHBOARD ====================

// GET /api/executive/analytics/dashboard - Get dashboard analytics
router.get('/analytics/dashboard',
  authenticateToken,
  requireExecutive,
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      // Get various analytics data
      const [
        productStats,
        orderStats,
        ticketStats,
        userStats,
        revenueData
      ] = await Promise.all([
        Product.aggregate([
          {
            $group: {
              _id: null,
              totalProducts: { $sum: 1 },
              activeProducts: { $sum: { $cond: ['$isActive', 1, 0] } },
              lowStockProducts: { $sum: { $cond: [{ $lt: ['$stock', 10] }, 1, 0] } },
              featuredProducts: { $sum: { $cond: ['$isFeatured', 1, 0] } }
            }
          }
        ]),
        Order.getOrderStats(startDate, endDate),
        SupportTicket.getTicketStats(startDate, endDate),
        User.aggregate([
          {
            $group: {
              _id: '$role',
              count: { $sum: 1 },
              activeUsers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } }
            }
          }
        ]),
        Order.aggregate([
          {
            $match: {
              status: { $in: ['delivered', 'completed'] },
              ...(startDate || endDate ? {
                createdAt: {
                  ...(startDate && { $gte: new Date(startDate) }),
                  ...(endDate && { $lte: new Date(endDate) })
                }
              } : {})
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              totalRevenue: { $sum: '$total' },
              orderCount: { $sum: 1 },
              avgOrderValue: { $avg: '$total' }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ])
      ]);

      res.json({
        success: true,
        data: {
          products: productStats[0] || {},
          orders: orderStats,
          tickets: ticketStats,
          users: userStats,
          revenue: revenueData
        }
      });
    } catch (error) {
      console.error('Get dashboard analytics error:', error);
      res.status(500).json({
        error: 'Failed to fetch analytics',
        message: error.message
      });
    }
  }
);

module.exports = router;
