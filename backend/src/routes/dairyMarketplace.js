const express = require('express');
const router = express.Router();
const MilkProduction = require('../models/MilkProduction');
const Buyer = require('../models/Buyer');
const { body, query, validationResult } = require('express-validator');

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

// POST /api/dairy-marketplace/register-milk - Register milk production
router.post('/register-milk', [
  body('farmerName').trim().isLength({ min: 2, max: 100 }).withMessage('Farmer name must be 2-100 characters'),
  body('contactNumber').trim().isMobilePhone('en-IN').withMessage('Valid Indian mobile number required'),
  body('farmAddress').trim().isLength({ min: 10, max: 500 }).withMessage('Farm address must be 10-500 characters'),
  body('location').trim().isLength({ min: 2, max: 100 }).withMessage('Location must be 2-100 characters'),
  body('dailyVolume').isFloat({ min: 1, max: 10000 }).withMessage('Daily volume must be between 1-10000 liters'),
  body('fatContent').isFloat({ min: 0.1, max: 10 }).withMessage('Fat content must be between 0.1-10%'),
  body('snfContent').isFloat({ min: 0.1, max: 15 }).withMessage('SNF content must be between 0.1-15%'),
  body('collectionTime').isIn(['morning', 'evening', 'both']).withMessage('Invalid collection time'),
  body('qualityCertificates').optional().isArray().withMessage('Quality certificates must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const {
      farmerName,
      contactNumber,
      farmAddress,
      location,
      dailyVolume,
      fatContent,
      snfContent,
      collectionTime,
      qualityCertificates = [],
      expectedPrice
    } = req.body;

    // Generate farmer ID (in real app, this would come from authentication)
    const farmerId = req.user?.id || `farmer_${Date.now()}`;

    const milkProduction = new MilkProduction({
      farmerId,
      farmerName,
      contactNumber,
      farmAddress,
      location,
      dailyVolume,
      fatContent,
      snfContent,
      collectionTime,
      qualityCertificates,
      expectedPrice
    });

    await milkProduction.save();

    // Find matching buyers
    const matchingBuyers = await Buyer.findMatchingBuyers(milkProduction);
    const buyerMatches = matchingBuyers.map(buyer => {
      const match = buyer.matchesProducer(milkProduction);
      const estimatedPrice = buyer.calculatePrice(milkProduction);
      return {
        buyerId: buyer._id,
        buyerName: buyer.name,
        matchScore: match.score,
        estimatedPrice,
        contactInfo: buyer.contactInfo
      };
    });

    // Update milk production with matched buyers
    milkProduction.matchedBuyers = buyerMatches.map(match => ({
      buyerId: match.buyerId,
      matchScore: match.matchScore,
      status: 'matched'
    }));
    await milkProduction.save();

    res.status(201).json({
      success: true,
      message: 'Milk production registered successfully',
      data: {
        milkProduction: {
          id: milkProduction._id,
          qualityGrade: milkProduction.qualityGrade,
          qualityScore: milkProduction.calculateQualityScore(),
          status: milkProduction.status
        },
        matchingBuyers: buyerMatches.slice(0, 5) // Return top 5 matches
      }
    });

  } catch (error) {
    console.error('Register milk error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register milk production',
      message: error.message
    });
  }
});

// GET /api/dairy-marketplace/buyers - Get all buyers with filtering
router.get('/buyers', [
  query('location').optional().trim().isLength({ min: 1 }).withMessage('Location filter invalid'),
  query('type').optional().isIn(['Large Processor', 'Cooperative', 'Local Dairy', 'Export Company']).withMessage('Invalid buyer type'),
  query('minVolume').optional().isFloat({ min: 0 }).withMessage('Minimum volume must be positive'),
  query('maxVolume').optional().isFloat({ min: 0 }).withMessage('Maximum volume must be positive'),
  query('verified').optional().isBoolean().withMessage('Verified must be boolean'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100')
], handleValidationErrors, async (req, res) => {
  try {
    const {
      location,
      type,
      minVolume,
      maxVolume,
      verified = true,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = { status: 'active' };
    
    if (verified !== undefined) query.verified = verified === 'true';
    if (location) query.location = new RegExp(location, 'i');
    if (type) query.type = type;
    if (minVolume) query['qualityRequirements.minVolume'] = { $lte: parseFloat(minVolume) };
    if (maxVolume) query['qualityRequirements.maxVolume'] = { $gte: parseFloat(maxVolume) };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [buyers, total] = await Promise.all([
      Buyer.find(query)
        .select('-verificationDocuments -businessInfo.registrationNumber -businessInfo.gstNumber')
        .sort({ 'rating.average': -1, verified: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Buyer.countDocuments(query)
    ]);

    // Format buyers for frontend
    const formattedBuyers = buyers.map(buyer => ({
      id: buyer._id,
      name: buyer.name,
      type: buyer.type,
      location: buyer.location,
      rating: buyer.rating.average,
      reviews: buyer.rating.count,
      minVolume: `${buyer.qualityRequirements.minVolume}L/day`,
      maxVolume: `${buyer.qualityRequirements.maxVolume}L/day`,
      fatContent: `${buyer.qualityRequirements.minFatContent}% min`,
      snfContent: `${buyer.qualityRequirements.minSnfContent}% min`,
      priceRange: buyer.priceDisplay,
      pickupRadius: `${buyer.operations.pickupRadius}km`,
      paymentTerms: buyer.operations.paymentTerms,
      certifications: buyer.certifications.filter(cert => cert.verified).map(cert => cert.name),
      contact: {
        phone: buyer.contactInfo.phone,
        email: buyer.contactInfo.email
      },
      requirements: buyer.qualityRequirements.additionalRequirements,
      verified: buyer.verified
    }));

    res.json({
      success: true,
      data: {
        buyers: formattedBuyers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get buyers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch buyers',
      message: error.message
    });
  }
});

// GET /api/dairy-marketplace/buyers/:id - Get buyer details
router.get('/buyers/:id', async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.params.id)
      .select('-verificationDocuments -businessInfo.registrationNumber -businessInfo.gstNumber');

    if (!buyer) {
      return res.status(404).json({
        success: false,
        error: 'Buyer not found'
      });
    }

    res.json({
      success: true,
      data: { buyer }
    });

  } catch (error) {
    console.error('Get buyer details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch buyer details',
      message: error.message
    });
  }
});

// GET /api/dairy-marketplace/export-opportunities - Get export opportunities
router.get('/export-opportunities', async (req, res) => {
  try {
    const exportBuyers = await Buyer.find({
      type: 'Export Company',
      status: 'active',
      verified: true
    }).select('name location qualityRequirements pricing certifications contactInfo');

    const opportunities = exportBuyers.map(buyer => ({
      id: buyer._id,
      destination: buyer.location.includes('Middle East') ? 'Middle East' : 
                  buyer.location.includes('Asia') ? 'Southeast Asia' : 'International',
      requirements: buyer.qualityRequirements.additionalRequirements || 'Premium quality milk',
      volume: `${buyer.qualityRequirements.minVolume}-${buyer.qualityRequirements.maxVolume}L/month`,
      price: buyer.priceDisplay,
      exporter: buyer.name,
      certifications: buyer.certifications.filter(cert => cert.verified).map(cert => cert.name),
      contact: buyer.contactInfo
    }));

    res.json({
      success: true,
      data: { opportunities }
    });

  } catch (error) {
    console.error('Get export opportunities error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch export opportunities',
      message: error.message
    });
  }
});

// GET /api/dairy-marketplace/my-registrations - Get farmer's milk registrations
router.get('/my-registrations', async (req, res) => {
  try {
    const farmerId = req.user?.id || req.query.farmerId;
    
    if (!farmerId) {
      return res.status(400).json({
        success: false,
        error: 'Farmer ID required'
      });
    }

    const registrations = await MilkProduction.find({ farmerId })
      .populate('matchedBuyers.buyerId', 'name type location rating contactInfo')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { registrations }
    });

  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registrations',
      message: error.message
    });
  }
});

module.exports = router;
