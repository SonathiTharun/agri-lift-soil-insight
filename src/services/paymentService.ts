import { apiService } from './apiService';

// Payment gateway types
export type PaymentGateway = 'razorpay' | 'payu' | 'cashfree' | 'stripe';

export interface PaymentAccount {
  id: string;
  userId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  upiId?: string;
  status: 'pending' | 'verified' | 'rejected';
  verificationDate?: string;
  isDefault: boolean;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  gateway: PaymentGateway;
  gatewayTransactionId?: string;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  description: string;
  buyerId: string;
  sellerId: string;
  milkProductionId: string;
  status: 'created' | 'paid' | 'failed' | 'cancelled';
  escrowStatus: 'held' | 'released' | 'refunded';
  createdAt: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

class PaymentService {
  private baseUrl = 'http://localhost:5001/api/payments';
  private razorpayKey = process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_your_key_here';

  // Initialize Razorpay
  private loadRazorpay(): Promise<any> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve((window as any).Razorpay);
      };
      document.body.appendChild(script);
    });
  }

  // Create payment account
  async createPaymentAccount(accountData: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    upiId?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data?: PaymentAccount;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(accountData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment account');
      }

      return await response.json();
    } catch (error) {
      console.error('Create payment account error:', error);
      throw error;
    }
  }

  // Get user's payment accounts
  async getPaymentAccounts(): Promise<{
    success: boolean;
    data: PaymentAccount[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/accounts`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch payment accounts');
      }

      return await response.json();
    } catch (error) {
      console.error('Get payment accounts error:', error);
      throw error;
    }
  }

  // Create payment order
  async createPaymentOrder(orderData: {
    amount: number;
    currency: string;
    description: string;
    buyerId: string;
    sellerId: string;
    milkProductionId: string;
  }): Promise<{
    success: boolean;
    data: PaymentOrder;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment order');
      }

      return await response.json();
    } catch (error) {
      console.error('Create payment order error:', error);
      throw error;
    }
  }

  // Process payment with Razorpay
  async processRazorpayPayment(order: PaymentOrder, userDetails: {
    name: string;
    email: string;
    contact: string;
  }, orderNumber?: string): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }> {
    try {
      const Razorpay = await this.loadRazorpay();

      return new Promise((resolve) => {
        const options: RazorpayOptions = {
          key: this.razorpayKey,
          amount: order.amount * 100, // Razorpay expects amount in paise
          currency: order.currency,
          name: 'Agri-Lift Dairy Marketplace',
          description: order.description,
          order_id: order.id,
          handler: async (response: any) => {
            try {
              let verification;

              if (orderNumber) {
                // Verify order payment for cart orders
                verification = await this.verifyOrderPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderNumber: orderNumber
                });
              } else {
                // Verify regular payment
                verification = await this.verifyPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
              }

              if (verification.success) {
                resolve({
                  success: true,
                  transactionId: response.razorpay_payment_id,
                });
              } else {
                resolve({
                  success: false,
                  error: 'Payment verification failed',
                });
              }
            } catch (error) {
              resolve({
                success: false,
                error: 'Payment verification error',
              });
            }
          },
          prefill: userDetails,
          theme: {
            color: '#3B82F6',
          },
        };

        const rzp = new Razorpay(options);
        
        rzp.on('payment.failed', (response: any) => {
          resolve({
            success: false,
            error: response.error.description,
          });
        });

        rzp.open();
      });
    } catch (error) {
      console.error('Razorpay payment error:', error);
      return {
        success: false,
        error: 'Failed to initialize payment',
      };
    }
  }

  // Verify payment
  private async verifyPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  // Verify order payment (for cart orders)
  async verifyOrderPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderNumber: string;
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await fetch('http://localhost:5001/api/orders/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Order payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Order payment verification error:', error);
      throw error;
    }
  }

  // Get payment transactions
  async getTransactions(filters?: {
    status?: string;
    gateway?: PaymentGateway;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    success: boolean;
    data: PaymentTransaction[];
  }> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }

      const response = await fetch(`${this.baseUrl}/transactions?${params}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch transactions');
      }

      return await response.json();
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error;
    }
  }

  // Release escrow payment
  async releaseEscrow(orderId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/escrow/release`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to release escrow');
      }

      return await response.json();
    } catch (error) {
      console.error('Release escrow error:', error);
      throw error;
    }
  }

  // Get auth headers
  private getAuthHeaders() {
    const headers: Record<string, string> = {};
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }
}

export const paymentService = new PaymentService();
