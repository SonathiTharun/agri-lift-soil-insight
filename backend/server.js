const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const http = require('http');
require('dotenv').config();

const { initializeDatabase } = require('./src/database/init');
const soilAnalysisRoutes = require('./src/routes/soilAnalysis');
const cropRecommendationRoutes = require('./src/routes/cropRecommendation');
const visualizationRoutes = require('./src/routes/visualization');
const authRoutes = require('./src/routes/auth');
const productsRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');
const weatherRoutes = require('./src/routes/weather');
const marketPricesRoutes = require('./src/routes/marketPrices');
const livestockRoutes = require('./src/routes/livestock');
const equipmentRoutes = require('./src/routes/equipment');
const dairyMarketplaceRoutes = require('./src/routes/dairyMarketplace');
const paymentsRoutes = require('./src/routes/payments');
const ordersRoutes = require('./src/routes/orders');
const socketService = require('./src/services/socketService');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

// Create necessary directories
const createDirectories = () => {
  const dirs = ['./uploads', './database', './logs'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Initialize directories
createDirectories();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Cookie parsing middleware
app.use(cookieParser());

// Logging middleware
app.use(morgan('combined'));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/soil-analysis', soilAnalysisRoutes);
app.use('/api/crop-recommendation', cropRecommendationRoutes);
app.use('/api/visualization', visualizationRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market-prices', marketPricesRoutes);
app.use('/api/livestock', livestockRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/dairy-marketplace', dairyMarketplaceRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/orders', ordersRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      message: 'The uploaded file exceeds the maximum size limit.'
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found.'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database (skip for testing)
    try {
      await initializeDatabase();
      console.log('✅ Database connected successfully');
    } catch (dbError) {
      console.log('⚠️ Database connection failed, running in test mode without database');
      console.log('Database error:', dbError.message);
    }

    // Initialize WebSocket service
    socketService.initialize(server);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
      console.log(`🔔 WebSocket service initialized`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
