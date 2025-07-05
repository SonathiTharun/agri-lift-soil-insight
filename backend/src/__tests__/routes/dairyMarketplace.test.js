const request = require('supertest');
const express = require('express');
const dairyMarketplaceRoutes = require('../../routes/dairyMarketplace');

// Mock the models
jest.mock('../../models/MilkProduction');
jest.mock('../../models/Buyer');

const MilkProduction = require('../../models/MilkProduction');
const Buyer = require('../../models/Buyer');

const app = express();
app.use(express.json());
app.use('/api/dairy-marketplace', dairyMarketplaceRoutes);

describe('Dairy Marketplace Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/dairy-marketplace/register-milk', () => {
    it('should register milk production successfully', async () => {
      const mockMilkProduction = {
        _id: 'milk_123',
        farmerId: 'farmer_123',
        farmerName: 'Test Farmer',
        dailyVolume: 100,
        fatContent: 3.5,
        snfContent: 8.5,
        qualityGrade: 'A',
        calculateQualityScore: jest.fn().mockReturnValue(85),
        save: jest.fn().mockResolvedValue(true),
        matchedBuyers: []
      };

      const mockBuyers = [
        {
          _id: 'buyer_1',
          name: 'Heritage Foods',
          matchesProducer: jest.fn().mockReturnValue({ score: 95, matches: true }),
          calculatePrice: jest.fn().mockReturnValue(38),
          contactInfo: {
            phone: '+91 9876543210',
            email: 'procurement@heritage.com'
          }
        }
      ];

      MilkProduction.mockImplementation(() => mockMilkProduction);
      Buyer.findMatchingBuyers = jest.fn().mockResolvedValue(mockBuyers);

      const milkData = {
        farmerName: 'Test Farmer',
        contactNumber: '+91 9876543210',
        farmAddress: 'Test Address',
        location: 'Test Location',
        dailyVolume: 100,
        fatContent: 3.5,
        snfContent: 8.5,
        collectionTime: 'morning',
        qualityCertificates: ['FSSAI']
      };

      const response = await request(app)
        .post('/api/dairy-marketplace/register-milk')
        .send(milkData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Milk production registered successfully');
      expect(response.body.data.milkProduction.qualityGrade).toBe('A');
      expect(response.body.data.matchingBuyers).toHaveLength(1);
      expect(mockMilkProduction.save).toHaveBeenCalledTimes(2); // Once for initial save, once for updating matches
    });

    it('should validate required fields', async () => {
      const invalidData = {
        farmerName: '', // Empty name
        contactNumber: 'invalid-phone',
        dailyVolume: -1, // Negative volume
        fatContent: 15, // Too high
        snfContent: 0 // Too low
      };

      const response = await request(app)
        .post('/api/dairy-marketplace/register-milk')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation error');
      expect(response.body.details).toBeInstanceOf(Array);
    });

    it('should handle database errors', async () => {
      MilkProduction.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      const milkData = {
        farmerName: 'Test Farmer',
        contactNumber: '+91 9876543210',
        farmAddress: 'Test Address',
        location: 'Test Location',
        dailyVolume: 100,
        fatContent: 3.5,
        snfContent: 8.5,
        collectionTime: 'morning'
      };

      const response = await request(app)
        .post('/api/dairy-marketplace/register-milk')
        .send(milkData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Failed to register milk production');
    });
  });

  describe('GET /api/dairy-marketplace/buyers', () => {
    it('should fetch buyers with pagination', async () => {
      const mockBuyers = [
        {
          _id: 'buyer_1',
          name: 'Heritage Foods',
          type: 'Large Processor',
          location: 'Hyderabad, Telangana',
          rating: { average: 4.8, count: 245 },
          qualityRequirements: {
            minVolume: 500,
            maxVolume: 5000,
            minFatContent: 3.5,
            minSnfContent: 8.5
          },
          operations: {
            pickupRadius: 50,
            paymentTerms: 'Weekly'
          },
          pricing: { basePrice: 38 },
          priceDisplay: '₹35-42/L',
          certifications: [{ name: 'FSSAI', verified: true }],
          contactInfo: {
            phone: '+91 9876543210',
            email: 'procurement@heritage.com'
          },
          verified: true
        }
      ];

      Buyer.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue(mockBuyers)
            })
          })
        })
      });

      Buyer.countDocuments = jest.fn().mockResolvedValue(1);

      const response = await request(app)
        .get('/api/dairy-marketplace/buyers')
        .query({ page: 1, limit: 20 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.buyers).toHaveLength(1);
      expect(response.body.data.buyers[0].name).toBe('Heritage Foods');
      expect(response.body.data.pagination.total).toBe(1);
    });

    it('should filter buyers by location', async () => {
      Buyer.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([])
            })
          })
        })
      });

      Buyer.countDocuments = jest.fn().mockResolvedValue(0);

      const response = await request(app)
        .get('/api/dairy-marketplace/buyers')
        .query({ location: 'Hyderabad' })
        .expect(200);

      expect(Buyer.find).toHaveBeenCalledWith(
        expect.objectContaining({
          location: expect.any(RegExp)
        })
      );
    });

    it('should filter buyers by type', async () => {
      Buyer.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([])
            })
          })
        })
      });

      Buyer.countDocuments = jest.fn().mockResolvedValue(0);

      const response = await request(app)
        .get('/api/dairy-marketplace/buyers')
        .query({ type: 'Large Processor' })
        .expect(200);

      expect(Buyer.find).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Large Processor'
        })
      );
    });
  });

  describe('GET /api/dairy-marketplace/buyers/:id', () => {
    it('should fetch buyer details successfully', async () => {
      const mockBuyer = {
        _id: 'buyer_1',
        name: 'Heritage Foods',
        type: 'Large Processor',
        qualityRequirements: {
          minFatContent: 3.5,
          minSnfContent: 8.5
        }
      };

      Buyer.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockBuyer)
      });

      const response = await request(app)
        .get('/api/dairy-marketplace/buyers/buyer_1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.buyer.name).toBe('Heritage Foods');
    });

    it('should return 404 for non-existent buyer', async () => {
      Buyer.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const response = await request(app)
        .get('/api/dairy-marketplace/buyers/invalid_id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Buyer not found');
    });
  });

  describe('GET /api/dairy-marketplace/export-opportunities', () => {
    it('should fetch export opportunities successfully', async () => {
      const mockExportBuyers = [
        {
          _id: 'export_1',
          name: 'Global Dairy Exports Ltd.',
          location: 'Middle East Operations, Hyderabad',
          qualityRequirements: {
            minVolume: 1000,
            maxVolume: 10000,
            additionalRequirements: 'A2 Milk, Organic Certified'
          },
          pricing: { basePrice: 70 },
          priceDisplay: '₹65-75/L',
          certifications: [
            { name: 'Organic', verified: true },
            { name: 'Halal', verified: true }
          ],
          contactInfo: {
            phone: '+91 9876543213',
            email: 'exports@global.com'
          }
        }
      ];

      Buyer.find = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockExportBuyers)
      });

      const response = await request(app)
        .get('/api/dairy-marketplace/export-opportunities')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.opportunities).toHaveLength(1);
      expect(response.body.data.opportunities[0].exporter).toBe('Global Dairy Exports Ltd.');
    });
  });

  describe('GET /api/dairy-marketplace/my-registrations', () => {
    it('should fetch farmer registrations successfully', async () => {
      const mockRegistrations = [
        {
          _id: 'milk_1',
          farmerId: 'farmer_123',
          dailyVolume: 100,
          qualityGrade: 'A',
          status: 'active',
          matchedBuyers: []
        }
      ];

      MilkProduction.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockRegistrations)
        })
      });

      const response = await request(app)
        .get('/api/dairy-marketplace/my-registrations')
        .query({ farmerId: 'farmer_123' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.registrations).toHaveLength(1);
    });

    it('should require farmer ID', async () => {
      const response = await request(app)
        .get('/api/dairy-marketplace/my-registrations')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Farmer ID required');
    });
  });
});
