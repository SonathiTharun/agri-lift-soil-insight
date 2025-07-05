const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_here',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret_here'
});

// Mock models (replace with actual models)
const Order = require('../models/Order');
const PaymentOrder = require('../models/PaymentOrder');

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

// Mock authentication middleware
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

// POST /api/orders/create - Create order from cart
router.post('/create', authenticateToken, [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('currency').isIn(['INR', 'USD']).withMessage('Invalid currency'),
  body('description').trim().isLength({ min: 1, max: 255 }).withMessage('Description is required'),
  body('items').isArray({ min: 1 }).withMessage('Items array is required'),
  body('shippingAddress.fullName').trim().isLength({ min: 2 }).withMessage('Full name is required'),
  body('shippingAddress.address').trim().isLength({ min: 10 }).withMessage('Address is required'),
  body('shippingAddress.phoneNumber').trim().isMobilePhone('en-IN').withMessage('Valid phone number is required')
], handleValidationErrors, async (req, res) => {
  try {
    const {
      amount,
      currency,
      description,
      items,
      shippingAddress,
      paymentMethod = 'razorpay'
    } = req.body;

    // Generate order number
    const orderNumber = `AGR${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create order in database
    const orderData = {
      orderNumber,
      userId: req.user.id,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category || 'general',
        total: item.price * item.quantity
      })),
      subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      shipping: amount > 1000 ? 0 : 99,
      codCharges: paymentMethod === 'cod' ? 50 : 0,
      total: amount,
      currency,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'awaiting_payment',
      orderStatus: 'created',
      shippingAddress,
      description,
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
    };

    let razorpayOrderId = null;

    // Create Razorpay order if payment method is online
    if (paymentMethod === 'razorpay') {
      try {
        const razorpayOrder = await razorpay.orders.create({
          amount: amount * 100, // Convert to paise
          currency,
          receipt: orderNumber,
          payment_capture: 1,
          notes: {
            orderNumber,
            userId: req.user.id,
            itemCount: items.length
          }
        });

        razorpayOrderId = razorpayOrder.id;
        orderData.razorpayOrderId = razorpayOrderId;
      } catch (razorpayError) {
        console.error('Razorpay order creation error:', razorpayError);
        return res.status(500).json({
          success: false,
          error: 'Failed to create payment order',
          message: 'Payment gateway error'
        });
      }
    }

    // Save order to database (mock implementation)
    const savedOrder = {
      id: `order_${Date.now()}`,
      ...orderData
    };

    // Send order confirmation email (mock)
    // await sendOrderConfirmationEmail(req.user.email, savedOrder);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: savedOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      message: error.message
    });
  }
});

// POST /api/orders/verify-payment - Verify Razorpay payment
router.post('/verify-payment', authenticateToken, [
  body('razorpay_order_id').trim().isLength({ min: 1 }).withMessage('Order ID is required'),
  body('razorpay_payment_id').trim().isLength({ min: 1 }).withMessage('Payment ID is required'),
  body('razorpay_signature').trim().isLength({ min: 1 }).withMessage('Signature is required'),
  body('orderNumber').trim().isLength({ min: 1 }).withMessage('Order number is required')
], handleValidationErrors, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_secret_here')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update order status in database
      const updatedOrder = {
        orderNumber,
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date()
      };

      // Send payment confirmation email (mock)
      // await sendPaymentConfirmationEmail(req.user.email, updatedOrder);

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: { order: updatedOrder }
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

// GET /api/orders/user/:userId - Get user orders
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user can access these orders
    if (userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Mock orders data
    const orders = [
      {
        id: 'order_1',
        orderNumber: 'AGR1701234567890',
        total: 2499,
        currency: 'INR',
        paymentStatus: 'paid',
        orderStatus: 'shipped',
        items: [
          {
            name: 'Organic Fertilizer',
            quantity: 2,
            price: 899,
            total: 1798
          },
          {
            name: 'Seeds Pack',
            quantity: 1,
            price: 599,
            total: 599
          }
        ],
        createdAt: '2023-12-01T10:30:00Z',
        estimatedDelivery: '2023-12-06T10:30:00Z'
      }
    ];

    res.json({
      success: true,
      data: { orders }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
});

// GET /api/orders/:orderNumber - Get specific order details
router.get('/:orderNumber', authenticateToken, async (req, res) => {
  try {
    const { orderNumber } = req.params;

    // Mock order data
    const order = {
      id: 'order_1',
      orderNumber,
      userId: req.user.id,
      total: 2499,
      currency: 'INR',
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      orderStatus: 'shipped',
      trackingNumber: 'TRK123456789',
      items: [
        {
          productId: 'prod_1',
          name: 'Organic Fertilizer',
          quantity: 2,
          price: 899,
          total: 1798,
          category: 'fertilizer'
        }
      ],
      shippingAddress: {
        fullName: 'Test User',
        address: '123 Farm Street',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001',
        phoneNumber: '+91 9876543210'
      },
      createdAt: '2023-12-01T10:30:00Z',
      estimatedDelivery: '2023-12-06T10:30:00Z',
      shippedAt: '2023-12-02T14:30:00Z'
    };

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order details',
      message: error.message
    });
  }
});

module.exports = router;
