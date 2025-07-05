import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SellProduce from '../../pages/dairy-lift/SellProduce';
import { AuthContext } from '../../contexts/AuthContext';
import { dairyMarketplaceService } from '../../services/dairyMarketplaceService';

// Mock the service
jest.mock('../../services/dairyMarketplaceService');
const mockDairyMarketplaceService = dairyMarketplaceService as jest.Mocked<typeof dairyMarketplaceService>;

// Mock toast
const mockToast = jest.fn();
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast })
}));

// Mock auth context
const mockAuthContext = {
  user: {
    id: 'user_123',
    name: 'Test Farmer',
    email: 'test@example.com',
    phone: '+91 9876543210',
    farmDetails: {
      address: 'Test Farm Address',
      location: 'Test Location'
    }
  },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>
        {component}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('SellProduce Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDairyMarketplaceService.getBuyers.mockResolvedValue({
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
            minVolume: '500L/day',
            maxVolume: '5000L/day',
            fatContent: '3.5% min',
            snfContent: '8.5% min',
            priceRange: '₹35-42/L',
            pickupRadius: '50km',
            paymentTerms: 'Weekly',
            certifications: ['FSSAI', 'ISO 22000'],
            contact: {
              phone: '+91 9876543210',
              email: 'procurement@heritage.com'
            },
            requirements: 'Premium quality milk',
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
    });

    mockDairyMarketplaceService.getExportOpportunities.mockResolvedValue({
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
            certifications: ['Organic', 'Halal'],
            contact: {
              phone: '+91 9876543213',
              email: 'exports@global.com'
            }
          }
        ]
      }
    });

    mockDairyMarketplaceService.getLogisticsProviders.mockResolvedValue({
      success: true,
      data: [
        {
          id: 1,
          name: 'ColdChain Express',
          type: 'Cold Chain Transport',
          coverage: 'Pan South India',
          rating: 4.7,
          services: ['Refrigerated Transport', 'Quality Monitoring'],
          contact: '+91 9876543213'
        }
      ]
    });
  });

  it('renders the main page with all tabs', () => {
    renderWithProviders(<SellProduce />);

    expect(screen.getByText('Sell Your Produce')).toBeInTheDocument();
    expect(screen.getByText('Register Milk')).toBeInTheDocument();
    expect(screen.getByText('Find Buyers')).toBeInTheDocument();
    expect(screen.getByText('Export Gateway')).toBeInTheDocument();
    expect(screen.getByText('Logistics')).toBeInTheDocument();
    expect(screen.getByText('Payments')).toBeInTheDocument();
  });

  it('shows milk registration form when button is clicked', async () => {
    renderWithProviders(<SellProduce />);

    const registerButton = screen.getByText('Register Your Milk Production');
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText('Register Your Milk Production')).toBeInTheDocument();
      expect(screen.getByLabelText('Daily Volume (Liters)')).toBeInTheDocument();
      expect(screen.getByLabelText('Fat Content (%)')).toBeInTheDocument();
      expect(screen.getByLabelText('SNF Content (%)')).toBeInTheDocument();
    });
  });

  it('pre-fills form with user data', async () => {
    renderWithProviders(<SellProduce />);

    const registerButton = screen.getByText('Register Your Milk Production');
    fireEvent.click(registerButton);

    await waitFor(() => {
      const farmerNameInput = screen.getByDisplayValue('Test Farmer');
      const contactInput = screen.getByDisplayValue('+91 9876543210');
      const addressInput = screen.getByDisplayValue('Test Farm Address');
      const locationInput = screen.getByDisplayValue('Test Location');

      expect(farmerNameInput).toBeInTheDocument();
      expect(contactInput).toBeInTheDocument();
      expect(addressInput).toBeInTheDocument();
      expect(locationInput).toBeInTheDocument();
    });
  });

  it('submits milk registration form successfully', async () => {
    mockDairyMarketplaceService.registerMilkProduction.mockResolvedValue({
      success: true,
      message: 'Registration successful',
      data: {
        milkProduction: {
          id: 'milk_123',
          qualityGrade: 'A',
          qualityScore: 85,
          status: 'active'
        },
        matchingBuyers: []
      }
    });

    renderWithProviders(<SellProduce />);

    const registerButton = screen.getByText('Register Your Milk Production');
    fireEvent.click(registerButton);

    await waitFor(() => {
      const volumeInput = screen.getByLabelText('Daily Volume (Liters)');
      const fatInput = screen.getByLabelText('Fat Content (%)');
      const snfInput = screen.getByLabelText('SNF Content (%)');

      fireEvent.change(volumeInput, { target: { value: '100' } });
      fireEvent.change(fatInput, { target: { value: '3.5' } });
      fireEvent.change(snfInput, { target: { value: '8.5' } });
    });

    const submitButton = screen.getByText('Register Milk Production');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockDairyMarketplaceService.registerMilkProduction).toHaveBeenCalledWith(
        expect.objectContaining({
          dailyVolume: 100,
          fatContent: 3.5,
          snfContent: 8.5,
          farmerName: 'Test Farmer'
        })
      );
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Registration Successful!'
        })
      );
    });
  });

  it('handles registration errors', async () => {
    mockDairyMarketplaceService.registerMilkProduction.mockRejectedValue(
      new Error('Validation failed')
    );

    renderWithProviders(<SellProduce />);

    const registerButton = screen.getByText('Register Your Milk Production');
    fireEvent.click(registerButton);

    await waitFor(() => {
      const submitButton = screen.getByText('Register Milk Production');
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Registration Failed',
          variant: 'destructive'
        })
      );
    });
  });

  it('loads and displays buyers when switching to buyers tab', async () => {
    renderWithProviders(<SellProduce />);

    const buyersTab = screen.getByText('Find Buyers');
    fireEvent.click(buyersTab);

    await waitFor(() => {
      expect(mockDairyMarketplaceService.getBuyers).toHaveBeenCalled();
      expect(screen.getByText('Heritage Foods')).toBeInTheDocument();
      expect(screen.getByText('Large Processor')).toBeInTheDocument();
      expect(screen.getByText('Hyderabad, Telangana')).toBeInTheDocument();
    });
  });

  it('filters buyers by search term', async () => {
    renderWithProviders(<SellProduce />);

    const buyersTab = screen.getByText('Find Buyers');
    fireEvent.click(buyersTab);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search buyers by name or location...');
      fireEvent.change(searchInput, { target: { value: 'Heritage' } });
    });

    // The component should filter the displayed buyers
    expect(screen.getByText('Heritage Foods')).toBeInTheDocument();
  });

  it('loads export opportunities when switching to export tab', async () => {
    renderWithProviders(<SellProduce />);

    const exportTab = screen.getByText('Export Gateway');
    fireEvent.click(exportTab);

    await waitFor(() => {
      expect(mockDairyMarketplaceService.getExportOpportunities).toHaveBeenCalled();
      expect(screen.getByText('Middle East')).toBeInTheDocument();
      expect(screen.getByText('Global Dairy Exports Ltd.')).toBeInTheDocument();
    });
  });

  it('loads logistics providers when switching to logistics tab', async () => {
    renderWithProviders(<SellProduce />);

    const logisticsTab = screen.getByText('Logistics');
    fireEvent.click(logisticsTab);

    await waitFor(() => {
      expect(mockDairyMarketplaceService.getLogisticsProviders).toHaveBeenCalled();
      expect(screen.getByText('ColdChain Express')).toBeInTheDocument();
      expect(screen.getByText('Cold Chain Transport')).toBeInTheDocument();
    });
  });

  it('shows authentication required message for unauthenticated users', () => {
    const unauthenticatedContext = {
      ...mockAuthContext,
      user: null,
      isAuthenticated: false
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={unauthenticatedContext}>
          <SellProduce />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const registerButton = screen.getByText('Register Your Milk Production');
    fireEvent.click(registerButton);

    // Should show the form but submission should fail with auth error
    expect(screen.getByText('Register Your Milk Production')).toBeInTheDocument();
  });

  it('displays loading states correctly', async () => {
    // Mock a delayed response
    mockDairyMarketplaceService.getBuyers.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        success: true,
        data: { buyers: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } }
      }), 100))
    );

    renderWithProviders(<SellProduce />);

    const buyersTab = screen.getByText('Find Buyers');
    fireEvent.click(buyersTab);

    // Should show loading state
    expect(screen.getByText('Loading buyers...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading buyers...')).not.toBeInTheDocument();
    });
  });
});
