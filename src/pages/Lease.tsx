import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/LanguageContext";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Tractor, 
  Home, 
  Sprout,
  Clock,
  Users,
  CheckCircle,
  Star,
  Filter,
  Search
} from "lucide-react";

const Lease = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample lease data
  const leaseProperties = [
    {
      id: 1,
      title: "Premium Agricultural Land - 50 Acres",
      location: "Karnataka, India",
      price: "₹25,000/month",
      duration: "2-5 years",
      type: "Agricultural Land",
      area: "50 acres",
      soilType: "Black Cotton Soil",
      waterSource: "Borewell + Canal",
      rating: 4.8,
      reviews: 24,
      features: ["Irrigation", "Road Access", "Electricity", "Storage"],
      image: "/api/placeholder/400/250",
      available: true
    },
    {
      id: 2,
      title: "Modern Dairy Farm Facility",
      location: "Punjab, India",
      price: "₹45,000/month",
      duration: "3-7 years",
      type: "Dairy Farm",
      area: "25 acres",
      soilType: "Alluvial Soil",
      waterSource: "Tube well",
      rating: 4.9,
      reviews: 18,
      features: ["Milking Parlor", "Feed Storage", "Veterinary Room", "Cold Storage"],
      image: "/api/placeholder/400/250",
      available: true
    },
    {
      id: 3,
      title: "Organic Vegetable Farm Setup",
      location: "Maharashtra, India",
      price: "₹18,000/month",
      duration: "1-3 years",
      type: "Vegetable Farm",
      area: "15 acres",
      soilType: "Red Soil",
      waterSource: "Drip Irrigation",
      rating: 4.6,
      reviews: 31,
      features: ["Greenhouse", "Organic Certified", "Processing Unit", "Market Access"],
      image: "/api/placeholder/400/250",
      available: true
    }
  ];

  const categories = ["All", "Agricultural Land", "Dairy Farm", "Vegetable Farm", "Poultry Farm", "Orchard"];

  const filteredProperties = leaseProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || property.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6">
              Agricultural Lease Services
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find the perfect agricultural property for lease or list your land for others to cultivate
            </p>
            
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="my-leases">My Leases</TabsTrigger>
              <TabsTrigger value="list-property">List Property</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="relative">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <Badge className="absolute top-2 right-2 bg-emerald-600">
                            {property.type}
                          </Badge>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">{property.title}</CardTitle>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{property.location}</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-bold text-emerald-600">
                                {property.price}
                              </span>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm">{property.rating} ({property.reviews})</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Home className="h-4 w-4 mr-1" />
                                {property.area}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {property.duration}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {property.features.slice(0, 3).map((feature, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {property.features.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{property.features.length - 3} more
                                </Badge>
                              )}
                            </div>
                            
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="my-leases" className="mt-8">
              <div className="text-center py-12">
                <Tractor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Leases</h3>
                <p className="text-gray-500 mb-6">You don't have any active lease agreements yet.</p>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Browse Available Properties
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="list-property" className="mt-8">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>List Your Property for Lease</CardTitle>
                  <p className="text-gray-600">Share your agricultural land with fellow farmers</p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Sprout className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon</h3>
                    <p className="text-gray-600 mb-6">
                      Property listing feature is under development. 
                      Contact our support team to list your property.
                    </p>
                    <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Lease;
