import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/cartcontext";

export default function CheckoutSimple() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal, formatCurrency } = useCart();
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'confirmation'>('cart');

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phoneNumber: ""
  });

  const handleContinue = () => {
    if (step === 'cart') {
      setStep('shipping');
    } else if (step === 'shipping') {
      setStep('payment');
    } else if (step === 'payment') {
      setStep('confirmation');
    }
  };

  const handleBack = () => {
    if (step === 'shipping') {
      setStep('cart');
    } else if (step === 'payment') {
      setStep('shipping');
    } else if (step === 'confirmation') {
      setStep('payment');
    }
  };

  const getTotalWithShipping = () => {
    const cartTotal = getCartTotal();
    const shipping = cartTotal > 1000 ? 0 : 99;
    return cartTotal + shipping;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/market')}
              className="hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600">Complete your purchase</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === 'cart' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className="w-16 h-1 bg-gray-200"></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === 'shipping' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className="w-16 h-1 bg-gray-200"></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <div className="w-16 h-1 bg-gray-200"></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === 'confirmation' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                4
              </div>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <Card className="text-center p-8">
              <div className="flex flex-col items-center gap-4">
                <ShoppingCart className="h-16 w-16 text-gray-400" />
                <CardTitle>Your cart is empty</CardTitle>
                <p className="text-gray-500">Add some products to your cart from our market</p>
                <Button onClick={() => navigate('/market')}>
                  Continue Shopping
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="md:col-span-2">
                {step === "cart" && (
                  <Card>
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
                              <p className="text-gray-600">{formatCurrency(item.price)}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFromCart(item.id)}
                                  className="ml-auto text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={shippingDetails.fullName}
                            onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            value={shippingDetails.phoneNumber}
                            onChange={(e) => setShippingDetails({...shippingDetails, phoneNumber: e.target.value})}
                            placeholder="Enter your phone number"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={shippingDetails.address}
                            onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                            placeholder="Enter your address"
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={shippingDetails.city}
                            onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                            placeholder="Enter your city"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={shippingDetails.state}
                            onChange={(e) => setShippingDetails({...shippingDetails, state: e.target.value})}
                            placeholder="Enter your state"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input
                            id="pincode"
                            value={shippingDetails.pincode}
                            onChange={(e) => setShippingDetails({...shippingDetails, pincode: e.target.value})}
                            placeholder="Enter your pincode"
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

                {step === "payment" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium">Cash on Delivery</h3>
                          <p className="text-sm text-gray-600">Pay when your order is delivered</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button variant="outline" onClick={handleBack}>
                        Back to Shipping
                      </Button>
                      <Button onClick={handleContinue}>
                        Place Order
                      </Button>
                    </CardFooter>
                  </Card>
                )}

                {step === "confirmation" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Confirmed!</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ShoppingCart className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Thank you for your order!</h3>
                        <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
                        <Button onClick={() => navigate('/market')}>
                          Continue Shopping
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatCurrency(getCartTotal())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{getCartTotal() > 1000 ? "Free" : formatCurrency(99)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatCurrency(getTotalWithShipping())}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
