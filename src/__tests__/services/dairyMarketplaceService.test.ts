import { dairyMarketplaceService } from '../../services/dairyMarketplaceService';

// Mock fetch globally
global.fetch = jest.fn();

describe('DairyMarketplaceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  describe('registerMilkProduction', () => {
    it('should register milk production successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Milk production registered successfully',
        data: {
          milkProduction: {
            id: 'milk_123',
            qualityGrade: 'A',
            qualityScore: 85,
            status: 'active'
          },
          matchingBuyers: [
            {
              buyerId: 'buyer_1',
              buyerName: 'Heritage Foods',
              matchScore: 95,
              estimatedPrice: 38,
              contactInfo: {
                phone: '+91 9876543210',
                email: 'procurement@heritage.com'
              }
            }
          ]
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const milkData = {
        farmerName: 'Test Farmer',
        contactNumber: '+91 9876543210',
        farmAddress: 'Test Address',
        location: 'Test Location',
        dailyVolume: 100,
        fatContent: 3.5,
        snfContent: 8.5,
        collectionTime: 'morning' as const,
        qualityCertificates: ['FSSAI']
      };

      const result = await dairyMarketplaceService.registerMilkProduction(milkData);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/dairy-marketplace/register-milk',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          }),
          body: JSON.stringify(milkData)
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle registration errors', async () => {
      const errorResponse = {
        message: 'Validation failed'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => errorResponse,
      });

      const milkData = {
        farmerName: '',
        contactNumber: '',
        farmAddress: '',
        location: '',
        dailyVolume: 0,
        fatContent: 0,
        snfContent: 0,
        collectionTime: 'morning' as const,
        qualityCertificates: []
      };

      await expect(dairyMarketplaceService.registerMilkProduction(milkData))
        .rejects.toThrow('Validation failed');
    });
  });

  describe('getBuyers', () => {
    it('should fetch buyers with filters', async () => {
      const mockResponse = {
        success: true,
        data: {
          buyers: [
            {
              id: 'buyer_1',
              name: 'Heritage Foods',
              type: 'Large Processor',
              location: 'Hyderabad, Telangana',
              rating: 4.8,
              reviews: 245,
              verified: true
            }
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 1,
            pages: 1
          }
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const filters = {
        location: 'Hyderabad',
        type: 'Large Processor',
        verified: true
      };

      const result = await dairyMarketplaceService.getBuyers(filters);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('location=Hyderabad'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          })
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty filters', async () => {
      const mockResponse = {
        success: true,
        data: {
          buyers: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            pages: 0
          }
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await dairyMarketplaceService.getBuyers();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/dairy-marketplace/buyers?',
        expect.any(Object)
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getBuyerDetails', () => {
    it('should fetch buyer details successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          buyer: {
            id: 'buyer_1',
            name: 'Heritage Foods',
            type: 'Large Processor',
            qualityRequirements: {
              minFatContent: 3.5,
              minSnfContent: 8.5
            }
          }
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await dairyMarketplaceService.getBuyerDetails('buyer_1');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/dairy-marketplace/buyers/buyer_1',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          })
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle buyer not found', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Buyer not found' }),
      });

      await expect(dairyMarketplaceService.getBuyerDetails('invalid_id'))
        .rejects.toThrow('Buyer not found');
    });
  });

  describe('getExportOpportunities', () => {
    it('should fetch export opportunities successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          opportunities: [
            {
              id: 'export_1',
              destination: 'Middle East',
              requirements: 'A2 Milk, Organic Certified',
              volume: '10,000L/month',
              price: '₹65-75/L',
              exporter: 'Global Dairy Exports Ltd.',
              certifications: ['Organic', 'Halal', 'ISO 22000']
            }
          ]
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await dairyMarketplaceService.getExportOpportunities();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/dairy-marketplace/export-opportunities',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          })
        })
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getLogisticsProviders', () => {
    it('should return mock logistics providers', async () => {
      const result = await dairyMarketplaceService.getLogisticsProviders();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(3);
      expect(result.data[0]).toHaveProperty('name');
      expect(result.data[0]).toHaveProperty('type');
      expect(result.data[0]).toHaveProperty('services');
    });
  });

  describe('contactBuyer', () => {
    it('should send contact message successfully', async () => {
      const result = await dairyMarketplaceService.contactBuyer(
        'buyer_1',
        'Test message',
        '+91 9876543210'
      );

      expect(result.success).toBe(true);
      expect(result.message).toContain('message has been sent');
    });
  });

  describe('setupPaymentAccount', () => {
    it('should setup payment account successfully', async () => {
      const accountData = {
        bankName: 'State Bank of India',
        accountNumber: '1234567890',
        ifscCode: 'SBIN0001234',
        accountHolderName: 'Test User',
        upiId: 'test@paytm'
      };

      const result = await dairyMarketplaceService.setupPaymentAccount(accountData);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('accountId');
      expect(result.data?.status).toBe('active');
    });
  });
});
