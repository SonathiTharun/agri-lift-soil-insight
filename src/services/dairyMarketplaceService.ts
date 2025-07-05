import { apiService } from './apiService';

// Types for dairy marketplace
export interface MilkRegistration {
  farmerName: string;
  contactNumber: string;
  farmAddress: string;
  location: string;
  dailyVolume: number;
  fatContent: number;
  snfContent: number;
  collectionTime: 'morning' | 'evening' | 'both';
  qualityCertificates?: string[];
  expectedPrice?: number;
}

export interface Buyer {
  id: string;
  name: string;
  type: 'Large Processor' | 'Cooperative' | 'Local Dairy' | 'Export Company';
  location: string;
  rating: number;
  reviews: number;
  minVolume: string;
  maxVolume: string;
  fatContent: string;
  snfContent: string;
  priceRange: string;
  pickupRadius: string;
  paymentTerms: string;
  certifications: string[];
  contact: {
    phone: string;
    email: string;
  };
  requirements: string;
  verified: boolean;
}

export interface ExportOpportunity {
  id: string;
  destination: string;
  requirements: string;
  volume: string;
  price: string;
  exporter: string;
  certifications: string[];
  contact: {
    phone: string;
    email: string;
  };
}

export interface MilkRegistrationResponse {
  success: boolean;
  message: string;
  data: {
    milkProduction: {
      id: string;
      qualityGrade: string;
      qualityScore: number;
      status: string;
    };
    matchingBuyers: Array<{
      buyerId: string;
      buyerName: string;
      matchScore: number;
      estimatedPrice: number;
      contactInfo: {
        phone: string;
        email: string;
      };
    }>;
  };
}

export interface BuyersResponse {
  success: boolean;
  data: {
    buyers: Buyer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ExportOpportunitiesResponse {
  success: boolean;
  data: {
    opportunities: ExportOpportunity[];
  };
}

class DairyMarketplaceService {
  private baseUrl = 'http://localhost:5001/api/dairy-marketplace';

  // Get headers for API requests
  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Get token from apiService (existing auth system)
    if (apiService.isAuthenticated()) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Register milk production
  async registerMilkProduction(data: MilkRegistration): Promise<MilkRegistrationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/register-milk`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register milk production');
      }

      return await response.json();
    } catch (error) {
      console.error('Register milk production error:', error);
      throw error;
    }
  }

  // Get buyers with filtering
  async getBuyers(filters: {
    location?: string;
    type?: string;
    minVolume?: number;
    maxVolume?: number;
    verified?: boolean;
    page?: number;
    limit?: number;
  } = {}): Promise<BuyersResponse> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}/buyers?${params}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch buyers');
      }

      return await response.json();
    } catch (error) {
      console.error('Get buyers error:', error);
      throw error;
    }
  }

  // Get buyer details
  async getBuyerDetails(buyerId: string): Promise<{ success: boolean; data: { buyer: any } }> {
    try {
      const response = await fetch(`${this.baseUrl}/buyers/${buyerId}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch buyer details');
      }

      return await response.json();
    } catch (error) {
      console.error('Get buyer details error:', error);
      throw error;
    }
  }

  // Get export opportunities
  async getExportOpportunities(): Promise<ExportOpportunitiesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/export-opportunities`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch export opportunities');
      }

      return await response.json();
    } catch (error) {
      console.error('Get export opportunities error:', error);
      throw error;
    }
  }

  // Get farmer's milk registrations
  async getMyRegistrations(farmerId?: string): Promise<{
    success: boolean;
    data: { registrations: any[] };
  }> {
    try {
      const params = farmerId ? `?farmerId=${farmerId}` : '';
      const response = await fetch(`${this.baseUrl}/my-registrations${params}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch registrations');
      }

      return await response.json();
    } catch (error) {
      console.error('Get registrations error:', error);
      throw error;
    }
  }

  // Mock logistics providers (can be moved to backend later)
  async getLogisticsProviders(): Promise<{
    success: boolean;
    data: Array<{
      id: number;
      name: string;
      type: string;
      coverage: string;
      rating: number;
      services: string[];
      contact: string;
    }>;
  }> {
    // Mock data for now - can be replaced with real API call
    return {
      success: true,
      data: [
        {
          id: 1,
          name: "ColdChain Express",
          type: "Cold Chain Transport",
          coverage: "Pan South India",
          rating: 4.7,
          services: ["Refrigerated Transport", "Quality Monitoring", "GPS Tracking"],
          contact: "+91 9876543213"
        },
        {
          id: 2,
          name: "Dairy Transport Co.",
          type: "Milk Collection",
          coverage: "Telangana & AP",
          rating: 4.4,
          services: ["Daily Collection", "Bulk Transport", "Quality Testing"],
          contact: "+91 9876543214"
        },
        {
          id: 3,
          name: "Fresh Logistics",
          type: "Last Mile Delivery",
          coverage: "Urban Areas",
          rating: 4.5,
          services: ["Door-to-Door", "Temperature Control", "Real-time Updates"],
          contact: "+91 9876543215"
        }
      ]
    };
  }

  // Payment integration (placeholder for Agri-Lift payment portal)
  async setupPaymentAccount(accountData: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    upiId?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data?: {
      accountId: string;
      status: string;
    };
  }> {
    try {
      // This would integrate with the existing Agri-Lift payment portal
      // For now, return a mock response
      return {
        success: true,
        message: 'Payment account setup successfully',
        data: {
          accountId: `acc_${Date.now()}`,
          status: 'active'
        }
      };
    } catch (error) {
      console.error('Setup payment account error:', error);
      throw error;
    }
  }

  // Contact buyer
  async contactBuyer(buyerId: string, message: string, farmerContact: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // This would send a message/notification to the buyer
      // For now, return a mock response
      return {
        success: true,
        message: 'Your message has been sent to the buyer. They will contact you soon.'
      };
    } catch (error) {
      console.error('Contact buyer error:', error);
      throw error;
    }
  }
}

export const dairyMarketplaceService = new DairyMarketplaceService();
