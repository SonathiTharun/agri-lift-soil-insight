import React, { useState, useEffect } from "react";
import { 
  Milk, 
  Users, 
  Globe, 
  Truck, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Shield, 
  Clock, 
  TrendingUp,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Building,
  Award,
  DollarSign,
  Calendar,
  Package,
  FileText,
  Eye,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Mock data for buyers
const mockBuyers = [
  {
    id: 1,
    name: "Heritage Foods",
    type: "Large Processor",
    location: "Hyderabad, Telangana",
    rating: 4.8,
    reviews: 245,
    minVolume: "500L/day",
    maxVolume: "5000L/day",
    fatContent: "3.5% min",
    snfContent: "8.5% min",
    priceRange: "₹35-42/L",
    pickupRadius: "50km",
    paymentTerms: "Weekly",
    certifications: ["FSSAI", "ISO 22000", "HACCP"],
    contact: {
      phone: "+91 9876543210",
      email: "procurement@heritage.com"
    },
    requirements: "Premium quality milk with regular testing",
    verified: true
  },
  {
    id: 2,
    name: "Vijaya Dairy",
    type: "Cooperative",
    location: "Vijayawada, Andhra Pradesh",
    rating: 4.6,
    reviews: 189,
    minVolume: "200L/day",
    maxVolume: "2000L/day",
    fatContent: "3.0% min",
    snfContent: "8.0% min",
    priceRange: "₹32-38/L",
    pickupRadius: "30km",
    paymentTerms: "Bi-weekly",
    certifications: ["FSSAI", "Organic"],
    contact: {
      phone: "+91 9876543211",
      email: "milk@vijayadairy.com"
    },
    requirements: "Consistent quality with health certificates",
    verified: true
  },
  {
    id: 3,
    name: "Local Dairy Hub",
    type: "Local Dairy",
    location: "Warangal, Telangana",
    rating: 4.2,
    reviews: 67,
    minVolume: "100L/day",
    maxVolume: "800L/day",
    fatContent: "2.8% min",
    snfContent: "7.5% min",
    priceRange: "₹28-35/L",
    pickupRadius: "20km",
    paymentTerms: "Weekly",
    certifications: ["FSSAI"],
    contact: {
      phone: "+91 9876543212",
      email: "info@localdairyhub.com"
    },
    requirements: "Fresh milk with basic quality standards",
    verified: false
  }
];

// Mock data for logistics providers
const mockLogistics = [
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
  }
];

// Mock data for export opportunities
const mockExportOpportunities = [
  {
    id: 1,
    destination: "Middle East",
    requirements: "A2 Milk, Organic Certified",
    volume: "10,000L/month",
    price: "₹65-75/L",
    exporter: "Global Dairy Exports Ltd.",
    certifications: ["Organic", "Halal", "ISO 22000", "HACCP"]
  },
  {
    id: 2,
    destination: "Southeast Asia",
    requirements: "Premium Buffalo Milk",
    volume: "5,000L/month",
    price: "₹55-65/L",
    exporter: "Asia Pacific Dairy",
    certifications: ["FSSAI", "Export License", "Quality Assurance"]
  }
];

const SellProduce = () => {
  const [activeTab, setActiveTab] = useState("register");
  const [showMilkForm, setShowMilkForm] = useState(false);
  const [showBuyerDetails, setShowBuyerDetails] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Form state for milk registration
  const [milkForm, setMilkForm] = useState({
    volume: "",
    fatContent: "",
    snfContent: "",
    location: "",
    collectionTime: "",
    farmerName: "",
    contactNumber: "",
    farmAddress: "",
    qualityCertificates: []
  });

  const filteredBuyers = mockBuyers.filter(buyer => {
    const matchesSearch = buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buyer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || buyer.location.includes(locationFilter);
    const matchesType = !typeFilter || buyer.type === typeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

  const handleMilkFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Milk registration:", milkForm);
    setShowMilkForm(false);
    // Reset form
    setMilkForm({
      volume: "",
      fatContent: "",
      snfContent: "",
      location: "",
      collectionTime: "",
      farmerName: "",
      contactNumber: "",
      farmAddress: "",
      qualityCertificates: []
    });
  };

  const openBuyerDetails = (buyer: any) => {
    setSelectedBuyer(buyer);
    setShowBuyerDetails(true);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 pb-16">
      {/* Hero Section */}
      <section className="relative w-full h-64 flex items-center justify-center mb-10">
        <img 
          src="https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=1200&q=80" 
          alt="Dairy Marketplace Hero" 
          className="absolute inset-0 w-full h-full object-cover brightness-75" 
        />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg animate-fadeInUp">
            Sell Your Produce
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-white/90 font-medium animate-fadeInUp delay-100">
            Connect with buyers, exporters, and logistics partners
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="register" className="flex items-center gap-2">
              <Milk className="h-4 w-4" />
              Register Milk
            </TabsTrigger>
            <TabsTrigger value="buyers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Find Buyers
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Export Gateway
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Logistics
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
          </TabsList>

          {/* Milk Registration Tab */}
          <TabsContent value="register" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Milk className="h-5 w-5 text-blue-600" />
                  Milk Procurement Portal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Register your daily or weekly milk production to connect with verified buyers in your area.
                </p>
                <Button 
                  onClick={() => setShowMilkForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Register Your Milk Production
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800">150+</h3>
                  <p className="text-gray-600">Verified Buyers</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800">₹35-42</h3>
                  <p className="text-gray-600">Average Price/Liter</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800">24hrs</h3>
                  <p className="text-gray-600">Quick Matching</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Buyers Tab */}
          <TabsContent value="buyers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Registered Buyers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search buyers by name or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Locations</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="Vijayawada">Vijayawada</SelectItem>
                      <SelectItem value="Warangal">Warangal</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="Large Processor">Large Processor</SelectItem>
                      <SelectItem value="Cooperative">Cooperative</SelectItem>
                      <SelectItem value="Local Dairy">Local Dairy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBuyers.map((buyer) => (
                    <Card key={buyer.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                              {buyer.name}
                              {buyer.verified && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">{buyer.type}</p>
                          </div>
                          <Badge variant={buyer.verified ? "default" : "secondary"}>
                            {buyer.verified ? "Verified" : "Pending"}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{buyer.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{buyer.rating} ({buyer.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span>{buyer.priceRange}</span>
                          </div>
                        </div>

                        <div className="space-y-1 mb-4 text-sm">
                          <p><strong>Volume:</strong> {buyer.minVolume} - {buyer.maxVolume}</p>
                          <p><strong>Fat:</strong> {buyer.fatContent}</p>
                          <p><strong>SNF:</strong> {buyer.snfContent}</p>
                          <p><strong>Payment:</strong> {buyer.paymentTerms}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openBuyerDetails(buyer)}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Gateway Tab */}
          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Export Gateway - Premium Section
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    International Quality Standards Required
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Access premium export opportunities for farmers and cooperatives meeting international quality standards.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Organic Certified</Badge>
                    <Badge variant="secondary">HACCP</Badge>
                    <Badge variant="secondary">ISO 22000</Badge>
                    <Badge variant="secondary">Halal Certified</Badge>
                    <Badge variant="secondary">A2 Milk</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockExportOpportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="border-2 border-purple-200">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Globe className="h-5 w-5 text-purple-600" />
                          <h3 className="font-bold text-lg">{opportunity.destination}</h3>
                          <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <p><strong>Requirements:</strong> {opportunity.requirements}</p>
                          <p><strong>Volume Needed:</strong> {opportunity.volume}</p>
                          <p><strong>Price Range:</strong> {opportunity.price}</p>
                          <p><strong>Exporter:</strong> {opportunity.exporter}</p>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Required Certifications:</p>
                          <div className="flex flex-wrap gap-1">
                            {opportunity.certifications.map((cert, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600">
                          <Award className="h-4 w-4 mr-2" />
                          Apply for Export
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logistics Tab */}
          <TabsContent value="logistics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Logistics Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Connect with reliable milk transport and cold chain service providers in your area.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockLogistics.map((provider) => (
                    <Card key={provider.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">{provider.name}</h3>
                            <p className="text-sm text-gray-600">{provider.type}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{provider.rating}</span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{provider.coverage}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{provider.contact}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Services:</p>
                          <div className="flex flex-wrap gap-1">
                            {provider.services.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full" variant="outline">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact Provider
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="mt-6 bg-gradient-to-r from-green-50 to-blue-50">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Cold Chain Quality Assurance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                          <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium">Temperature Monitoring</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium">GPS Tracking</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium">Quality Reports</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Secure Payment Portal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Connected to Agri-Lift Payment Portal
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Secure, timely payments guaranteed through our integrated payment system.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-100 text-green-800">Bank Transfer</Badge>
                    <Badge className="bg-green-100 text-green-800">UPI</Badge>
                    <Badge className="bg-green-100 text-green-800">Digital Wallet</Badge>
                    <Badge className="bg-green-100 text-green-800">Escrow Protection</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-2 border-green-200">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Payment Features
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Automated payment processing
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Real-time payment tracking
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Dispute resolution support
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Tax compliance assistance
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Payment history & reports
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-200">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Payment Schedule
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-sm">Daily Collection</span>
                          <Badge variant="outline">Next Day Payment</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-sm">Weekly Collection</span>
                          <Badge variant="outline">Weekly Payment</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-sm">Bulk Orders</span>
                          <Badge variant="outline">Bi-weekly Payment</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">Connect to Agri-Lift Payment Portal</h3>
                        <p className="text-gray-600">Link your bank account for seamless transactions</p>
                      </div>
                      <Button className="bg-gradient-to-r from-green-500 to-blue-600">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Setup Payment Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Milk Registration Modal */}
      <Dialog open={showMilkForm} onOpenChange={setShowMilkForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Milk className="h-5 w-5 text-blue-600" />
              Register Your Milk Production
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleMilkFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Daily Volume (Liters)</label>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  value={milkForm.volume}
                  onChange={(e) => setMilkForm({...milkForm, volume: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fat Content (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 3.5"
                  value={milkForm.fatContent}
                  onChange={(e) => setMilkForm({...milkForm, fatContent: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">SNF Content (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 8.5"
                  value={milkForm.snfContent}
                  onChange={(e) => setMilkForm({...milkForm, snfContent: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Collection Time</label>
                <Select value={milkForm.collectionTime} onValueChange={(value) => setMilkForm({...milkForm, collectionTime: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (6-9 AM)</SelectItem>
                    <SelectItem value="evening">Evening (5-8 PM)</SelectItem>
                    <SelectItem value="both">Both Times</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Farmer Name</label>
                <Input
                  placeholder="Your full name"
                  value={milkForm.farmerName}
                  onChange={(e) => setMilkForm({...milkForm, farmerName: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Number</label>
                <Input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={milkForm.contactNumber}
                  onChange={(e) => setMilkForm({...milkForm, contactNumber: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Farm Location</label>
              <Input
                placeholder="Village, District, State"
                value={milkForm.location}
                onChange={(e) => setMilkForm({...milkForm, location: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Farm Address</label>
              <Textarea
                placeholder="Complete address with landmarks"
                value={milkForm.farmAddress}
                onChange={(e) => setMilkForm({...milkForm, farmAddress: e.target.value})}
                required
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowMilkForm(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
                Register Milk Production
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Buyer Details Modal */}
      <Dialog open={showBuyerDetails} onOpenChange={setShowBuyerDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              {selectedBuyer?.name}
              {selectedBuyer?.verified && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedBuyer && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Company Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Type:</strong> {selectedBuyer.type}</p>
                    <p><strong>Location:</strong> {selectedBuyer.location}</p>
                    <p><strong>Rating:</strong> {selectedBuyer.rating} ⭐ ({selectedBuyer.reviews} reviews)</p>
                    <p><strong>Pickup Radius:</strong> {selectedBuyer.pickupRadius}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Quality Requirements</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Volume Range:</strong> {selectedBuyer.minVolume} - {selectedBuyer.maxVolume}</p>
                    <p><strong>Fat Content:</strong> {selectedBuyer.fatContent}</p>
                    <p><strong>SNF Content:</strong> {selectedBuyer.snfContent}</p>
                    <p><strong>Price Range:</strong> {selectedBuyer.priceRange}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBuyer.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline">{cert}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedBuyer.contact.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedBuyer.contact.email}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Additional Requirements</h3>
                <p className="text-sm text-gray-600">{selectedBuyer.requirements}</p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={() => setShowBuyerDetails(false)} className="flex-1">
                  Close
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Buyer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowMilkForm(true)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-2xl hover:scale-110 hover:shadow-emerald-400/40 transition-all duration-300 animate-bounce"
      >
        <Plus className="h-5 w-5 mr-2 inline" />
        Register Milk
      </button>
    </div>
  );
};

export default SellProduce;
