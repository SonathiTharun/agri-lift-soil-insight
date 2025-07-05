
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { WeatherWidget } from "@/components/WeatherWidget";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, CreditCard, ShoppingCart, IndianRupee, Loader2, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/cartcontext";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService } from "@/services/paymentService";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal, addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.name || "",
    address: user?.address || "",
    city: "",
    state: "",
    pincode: "",
    phoneNumber: user?.phone || ""
  });
  const [step, setStep] = useState<"cart" | "shipping" | "payment">("cart");

  // Create order in backend
  const createCartOrder = async (orderData: any) => {
    try {
      const response = await fetch('http://localhost:5001/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  };
  
  const getShipping = () => {
    return getCartTotal() > 1000 ? 0 : 99;
  };
  
  const getShippingCost = () => {
    return getShipping();
  };

  const getTotalWithShipping = () => {
    const subtotal = getCartTotal();
    const shipping = getShipping();
    const codCharges = paymentMethod === 'cod' ? 50 : 0;
    return subtotal + shipping + codCharges;
  };
  
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };
  
  // This function is not currently used but kept for future payment form fields
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Payment method selection is handled directly in the JSX
    console.log('Payment field changed:', name, value);
  };
  
  const handleContinue = () => {
    if (step === "cart") {
      setStep("shipping");
    } else if (step === "shipping") {
      // Validate shipping details
      const { fullName, address, city, state, pincode, phoneNumber } = shippingDetails;
      if (!fullName || !address || !city || !state || !pincode || !phoneNumber) {
        toast({
          title: "Missing information",
          description: "Please fill in all shipping details to continue",
          variant: "destructive"
        });
        return;
      }
      setStep("payment");
    }
  };
  
  const handleBack = () => {
    if (step === "shipping") {
      setStep("cart");
    } else if (step === "payment") {
      setStep("shipping");
    }
  };
  
  const processPayment = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your purchase",
        variant: "destructive"
      });
      return;
    }

    // Validate shipping details
    const { fullName, address, city, state, pincode, phoneNumber } = shippingDetails;
    if (!fullName || !address || !city || !state || !pincode || !phoneNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all shipping details to complete your purchase",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'cod') {
        // Handle Cash on Delivery
        await handleCODOrder();
      } else {
        // Handle Razorpay payment
        await handleRazorpayPayment();
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      // Create order in backend
      const orderData = {
        amount: getTotalWithShipping(),
        currency: 'INR',
        description: `Agri-Lift Order - ${cartItems.length} items`,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        shippingAddress: shippingDetails
      };

      const orderResponse = await createCartOrder(orderData);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      const order = orderResponse.data;
      setOrderId(order.orderNumber);

      // Process payment with Razorpay
      const paymentResult = await paymentService.processRazorpayPayment(
        {
          id: order.razorpayOrderId,
          amount: order.total,
          currency: order.currency || 'INR',
          description: order.description || 'Agri-Lift Purchase'
        },
        {
          name: user.name || shippingDetails.fullName,
          email: user.email || 'customer@agrilift.com',
          contact: shippingDetails.phoneNumber
        },
        order.orderNumber // Pass order number for verification
      );

      if (paymentResult.success) {
        // Payment successful
        setOrderCreated(true);
        toast({
          title: "Payment Successful!",
          description: `Your order #${order.orderNumber} has been placed successfully.`,
        });

        // Clear cart after successful payment
        clearCart();

        // Navigate to orders page after a delay
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Razorpay payment error:', error);
      throw error;
    }
  };

  const handleCODOrder = async () => {
    try {
      // Create COD order
      const orderData = {
        amount: getTotalWithShipping(),
        currency: 'INR',
        description: `Agri-Lift COD Order - ${cartItems.length} items`,
        paymentMethod: 'cod',
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        shippingAddress: shippingDetails
      };

      const orderResponse = await createCartOrder(orderData);

      if (orderResponse.success) {
        const order = orderResponse.data;
        setOrderId(order.orderNumber);
        setOrderCreated(true);

        toast({
          title: "Order Placed Successfully!",
          description: `Your COD order #${order.orderNumber} has been placed.`,
        });

        // Clear cart
        clearCart();

        // Navigate to orders page after a delay
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      } else {
        throw new Error(orderResponse.message || 'Failed to create COD order');
      }
    } catch (error: any) {
      console.error('COD order error:', error);
      throw error;
    }
  };
  
  return (
    <Layout>
      {/* Weather Widget (Draggable) */}
      <WeatherWidget />
      
      <main className="container mx-auto pt-6 px-4 pb-10">
        <div className="max-w-5xl mx-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mb-4 animate-fade-in"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <h1 className="text-3xl font-bold text-soil-dark mb-6 animate-fade-in">Checkout</h1>
          
          {/* Checkout Steps */}
          <div className="flex justify-center mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center space-x-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === "cart" ? "bg-foliage text-white" : "bg-foliage/50 text-white"}`}>
                1
              </div>
              <span className="text-sm font-medium">Cart</span>
              <div className="h-1 w-10 bg-gray-200">
                <div className={`h-full ${step !== "cart" ? "bg-foliage" : "bg-gray-200"}`}></div>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === "shipping" ? "bg-foliage text-white" : step === "payment" ? "bg-foliage/50 text-white" : "bg-gray-200 text-gray-600"}`}>
                2
              </div>
              <span className="text-sm font-medium">Shipping</span>
              <div className="h-1 w-10 bg-gray-200">
                <div className={`h-full ${step === "payment" ? "bg-foliage" : "bg-gray-200"}`}></div>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === "payment" ? "bg-foliage text-white" : "bg-gray-200 text-gray-600"}`}>
                3
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
          
          {cartItems.length === 0 ? (
            <Card className="text-center p-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex flex-col items-center gap-4">
                <ShoppingCart className="h-16 w-16 text-gray-400" />
                <CardTitle>Your cart is empty</CardTitle>
                <p className="text-gray-500">Add some products to your cart from our market</p>
                <div className="flex gap-4">
                  <Button onClick={() => navigate('/dairy-lift/equipment-mart')}>
                    Equipment Mart
                  </Button>
                  <Button onClick={() => navigate('/dairy-lift/livestock-market')}>
                    Livestock Market
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Add test items for demo
                      addToCart('test-1', 'Organic Fertilizer', 899, '/api/placeholder/150/150', 'fertilizer', 2);
                      addToCart('test-2', 'Premium Seeds Pack', 599, '/api/placeholder/150/150', 'seeds', 1);
                      toast({
                        title: "Test Items Added",
                        description: "Added sample items to test checkout flow"
                      });
                    }}
                  >
                    Add Test Items
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
              {/* Main Content */}
              <div className="md:col-span-2">
                {step === "cart" && (
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Your Cart ({cartItems.length} items)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {cartItems.map(item => (
                          <div key={item.id} className="flex gap-4 pb-4 border-b">
                            <div className="h-20 w-20 overflow-hidden rounded-md">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-500 mb-2">Category: {item.category.replace(/-/g, ' ')}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <button 
                                    className="h-6 w-6 flex items-center justify-center rounded-full border"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    -
                                  </button>
                                  <span>{item.quantity}</span>
                                  <button 
                                    className="h-6 w-6 flex items-center justify-center rounded-full border"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="font-medium">₹{item.price * item.quantity}</span>
                                  <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button variant="outline" onClick={clearCart}>
                        Clear Cart
                      </Button>
                      <Button onClick={handleContinue}>
                        Continue to Shipping
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                {step === "shipping" && (
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Shipping Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input 
                            id="fullName" 
                            name="fullName" 
                            value={shippingDetails.fullName} 
                            onChange={handleShippingChange}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input 
                            id="phoneNumber" 
                            name="phoneNumber" 
                            value={shippingDetails.phoneNumber} 
                            onChange={handleShippingChange}
                            placeholder="+91 9876543210"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={shippingDetails.address} 
                            onChange={handleShippingChange}
                            placeholder="123 Main St"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            name="city" 
                            value={shippingDetails.city} 
                            onChange={handleShippingChange}
                            placeholder="Mumbai"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state" 
                            name="state" 
                            value={shippingDetails.state} 
                            onChange={handleShippingChange}
                            placeholder="Maharashtra"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input 
                            id="pincode" 
                            name="pincode" 
                            value={shippingDetails.pincode} 
                            onChange={handleShippingChange}
                            placeholder="400001"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button variant="outline" onClick={handleBack}>
                        Back to Cart
                      </Button>
                      <Button onClick={handleContinue}>
                        Continue to Payment
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                {step === "payment" && !orderCreated && (
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Payment Method Selection */}
                        <div className="space-y-4">
                          <Label className="text-base font-medium">Choose Payment Method</Label>

                          {/* Razorpay Option */}
                          <div
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              paymentMethod === 'razorpay'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setPaymentMethod('razorpay')}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                id="razorpay"
                                name="paymentMethod"
                                value="razorpay"
                                checked={paymentMethod === 'razorpay'}
                                onChange={() => setPaymentMethod('razorpay')}
                                className="h-4 w-4 text-blue-600"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-5 w-5 text-blue-600" />
                                  <Label htmlFor="razorpay" className="font-medium cursor-pointer">
                                    Online Payment (Razorpay)
                                  </Label>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  Pay securely with UPI, Cards, Net Banking, or Wallets
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">UPI</span>
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Cards</span>
                                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Wallets</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Cash on Delivery Option */}
                          <div
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              paymentMethod === 'cod'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setPaymentMethod('cod')}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                id="cod"
                                name="paymentMethod"
                                value="cod"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                                className="h-4 w-4 text-green-600"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <IndianRupee className="h-5 w-5 text-green-600" />
                                  <Label htmlFor="cod" className="font-medium cursor-pointer">
                                    Cash on Delivery
                                  </Label>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  Pay when your order is delivered to your doorstep
                                </p>
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-2 inline-block">
                                  Additional ₹50 COD charges apply
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-3">Order Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal ({cartItems.length} items)</span>
                              <span>₹{getCartTotal()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping</span>
                              <span>₹{getShippingCost()}</span>
                            </div>
                            {paymentMethod === 'cod' && (
                              <div className="flex justify-between">
                                <span>COD Charges</span>
                                <span>₹50</span>
                              </div>
                            )}
                            <div className="border-t pt-2 flex justify-between font-medium">
                              <span>Total</span>
                              <span>₹{getTotalWithShipping()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button variant="outline" onClick={handleBack}>
                        Back to Shipping
                      </Button>
                      <Button
                        onClick={processPayment}
                        disabled={isProcessing}
                        className="min-w-[200px] bg-foliage hover:bg-foliage-dark"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            {paymentMethod === 'razorpay' ? (
                              <>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Pay ₹{getTotalWithShipping()}
                              </>
                            ) : (
                              <>
                                <IndianRupee className="h-4 w-4 mr-2" />
                                Place COD Order
                              </>
                            )}
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                )}

                {/* Order Success */}
                {orderCreated && (
                  <Card className="animate-fade-in border-green-200 bg-green-50">
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-green-800 mb-2">
                        Order Placed Successfully!
                      </h2>
                      <p className="text-green-700 mb-4">
                        Your order #{orderId} has been confirmed and will be processed shortly.
                      </p>
                      <div className="space-y-2 text-sm text-green-600">
                        <p>✓ Order confirmation sent to your email</p>
                        <p>✓ You will receive tracking information soon</p>
                        <p>✓ Expected delivery in 3-5 business days</p>
                      </div>
                      <Button
                        onClick={() => navigate('/orders')}
                        className="mt-6 bg-green-600 hover:bg-green-700"
                      >
                        View Order Details
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Order Summary */}
              <div>
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{getCartTotal()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{getShipping() === 0 ? "Free" : `₹${getShipping()}`}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>₹{getTotalWithShipping()}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getShipping() === 0 ? "Free shipping on orders above ₹1000" : ""}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-4 bg-foliage-light/30 rounded-lg p-3 text-xs text-gray-600 animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <p className="font-medium mb-1">Secure Checkout</p>
                  <p>All transactions are secure and encrypted. Your payment information is never stored.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
