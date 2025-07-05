const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { body, query, validationResult } = require('express-validator');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_here',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret_here'
});

// Mock models (replace with actual models)
const PaymentAccount = require('../models/PaymentAccount');
const PaymentOrder = require('../models/PaymentOrder');
const PaymentTransaction = require('../models/PaymentTransaction');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: errors.array()
    });
  }
  next();
};

// Mock authentication middleware (replace with actual auth)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  // Mock user for testing
  req.user = {
    id: 'user_123',
    name: 'Test User',
    email: 'test@example.com',
    phone: '+91 9876543210'
  };
  
  next();
};

// POST /api/payments/accounts - Create payment account
router.post('/accounts', authenticateToken, [
  body('bankName').trim().isLength({ min: 2, max: 100 }).withMessage('Bank name must be 2-100 characters'),
  body('accountNumber').trim().isLength({ min: 8, max: 20 }).withMessage('Account number must be 8-20 characters'),
  body('ifscCode').trim().matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage('Invalid IFSC code format'),
  body('accountHolderName').trim().isLength({ min: 2, max: 100 }).withMessage('Account holder name must be 2-100 characters'),
  body('upiId').optional().trim().isEmail().withMessage('Invalid UPI ID format')
], handleValidationErrors, async (req, res) => {
  try {
    const {
      bankName,
      accountNumber,
      ifscCode,
      accountHolderName,
      upiId
    } = req.body;

    // Create payment account (mock implementation)
    const paymentAccount = {
      id: `acc_${Date.now()}`,
      userId: req.user.id,
      bankName,
      accountNumber: accountNumber.slice(-4).padStart(accountNumber.length, '*'), // Mask account number
      ifscCode,
      accountHolderName,
      upiId,
      status: 'pending',
      isDefault: false,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Payment account created successfully. Verification in progress.',
      data: paymentAccount
    });

  } catch (error) {
    console.error('Create payment account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment account',
      message: error.message
    });
  }
});

// GET /api/payments/accounts - Get user's payment accounts
router.get('/accounts', authenticateToken, async (req, res) => {
  try {
    // Mock payment accounts
    const accounts = [
      {
        id: 'acc_1',
        userId: req.user.id,
        bankName: 'State Bank of India',
        accountNumber: '****1234',
        ifscCode: 'SBIN0001234',
        accountHolderName: req.user.name,
        upiId: 'user@paytm',
        status: 'verified',
        isDefault: true,
        verificationDate: '2023-01-15T10:30:00Z',
        createdAt: '2023-01-10T10:30:00Z'
      }
    ];

    res.json({
      success: true,
      data: accounts
    });

  } catch (error) {
    console.error('Get payment accounts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment accounts',
      message: error.message
    });
  }
});

// POST /api/payments/orders - Create payment order
router.post('/orders', authenticateToken, [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('currency').isIn(['INR', 'USD']).withMessage('Invalid currency'),
  body('description').trim().isLength({ min: 1, max: 255 }).withMessage('Description is required'),
  body('buyerId').trim().isLength({ min: 1 }).withMessage('Buyer ID is required'),
  body('sellerId').trim().isLength({ min: 1 }).withMessage('Seller ID is required'),
  body('milkProductionId').trim().isLength({ min: 1 }).withMessage('Milk production ID is required')
], handleValidationErrors, async (req, res) => {
  try {
    const {
      amount,
      currency,
      description,
      buyerId,
      sellerId,
      milkProductionId
    } = req.body;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `order_${Date.now()}`,
      payment_capture: 1
    });

    // Create payment order in database
    const paymentOrder = {
      id: razorpayOrder.id,
      amount,
      currency,
      description,
      buyerId,
      sellerId,
      milkProductionId,
      status: 'created',
      escrowStatus: 'held',
      razorpayOrderId: razorpayOrder.id,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: paymentOrder
    });

  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order',
      message: error.message
    });
  }
});

// POST /api/payments/verify - Verify payment
router.post('/verify', authenticateToken, [
  body('razorpay_order_id').trim().isLength({ min: 1 }).withMessage('Order ID is required'),
  body('razorpay_payment_id').trim().isLength({ min: 1 }).withMessage('Payment ID is required'),
  body('razorpay_signature').trim().isLength({ min: 1 }).withMessage('Signature is required')
], handleValidationErrors, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_secret_here')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update payment order status
      // In real implementation, update database
      
      // Create transaction record
      const transaction = {
        id: `txn_${Date.now()}`,
        orderId: razorpay_order_id,
        amount: 1000, // Get from order
        currency: 'INR',
        status: 'completed',
        gateway: 'razorpay',
        gatewayTransactionId: razorpay_payment_id,
        paymentMethod: 'card', // Detect from Razorpay response
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: { transaction }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed',
      message: error.message
    });
  }
});

// GET /api/payments/transactions - Get payment transactions
router.get('/transactions', authenticateToken, [
  query('status').optional().isIn(['pending', 'processing', 'completed', 'failed', 'refunded']).withMessage('Invalid status'),
  query('gateway').optional().isIn(['razorpay', 'payu', 'cashfree', 'stripe']).withMessage('Invalid gateway'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], handleValidationErrors, async (req, res) => {
  try {
    // Mock transactions
    const transactions = [
      {
        id: 'txn_1',
        orderId: 'order_1',
        amount: 3500,
        currency: 'INR',
        status: 'completed',
        gateway: 'razorpay',
        gatewayTransactionId: 'pay_123456789',
        paymentMethod: 'upi',
        createdAt: '2023-12-01T10:30:00Z',
        completedAt: '2023-12-01T10:31:00Z'
      },
      {
        id: 'txn_2',
        orderId: 'order_2',
        amount: 7200,
        currency: 'INR',
        status: 'completed',
        gateway: 'razorpay',
        gatewayTransactionId: 'pay_987654321',
        paymentMethod: 'card',
        createdAt: '2023-12-02T14:15:00Z',
        completedAt: '2023-12-02T14:16:00Z'
      }
    ];

    res.json({
      success: true,
      data: transactions
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
      message: error.message
    });
  }
});

// POST /api/payments/escrow/release - Release escrow payment
router.post('/escrow/release', authenticateToken, [
  body('orderId').trim().isLength({ min: 1 }).withMessage('Order ID is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { orderId } = req.body;

    // In real implementation, verify order ownership and release escrow
    // For now, return success
    
    res.json({
      success: true,
      message: 'Escrow payment released successfully'
    });

  } catch (error) {
    console.error('Release escrow error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to release escrow payment',
      message: error.message
    });
  }
});

module.exports = router;
