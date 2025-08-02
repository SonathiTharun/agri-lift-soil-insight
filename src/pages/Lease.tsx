import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/LanguageContext";
import { toast } from "sonner";

// Import new organized components
import { HeroSection } from "@/components/lease/HeroSection";
import { SearchFilters } from "@/components/lease/SearchFilters";
import { PropertyCard } from "@/components/lease/PropertyCard";
import {
  LeaseProperty,
  FilterState,
  ContactForm,
  TabType,
  SortOption,
  ViewMode,
  PropertyType
} from "@/components/lease/types";

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
  Search,
  Phone,
  Mail,
  MessageSquare,
  X,
  Droplets,
  Zap,
  Truck,
  Warehouse,
  Eye,
  Heart,
  Share2,
  SlidersHorizontal,
  ArrowUpDown,
  Bookmark,
  BookmarkCheck,
  Grid3X3,
  List,
  ChevronDown,
  AlertCircle,
  Loader2,
  RefreshCw,
  GitCompare
} from "lucide-react";

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error?: Error; retry?: () => void }> },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<{ error?: Error; retry?: () => void }> }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} retry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}

// Default Error Fallback Component
const DefaultErrorFallback: React.FC<{ error?: Error; retry?: () => void }> = ({ error, retry }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={retry} className="bg-emerald-600 hover:bg-emerald-700">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  </div>
);

const Lease: React.FC = () => {
  const { t } = useLanguage();

  // State management with proper TypeScript types
  const [activeTab, setActiveTab] = useState<TabType>("available");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedProperty, setSelectedProperty] = useState<LeaseProperty | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  const [contactForm, setContactForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000],
    areaRange: [0, 100],
    propertyTypes: [],
    features: [],
    location: "",
    soilTypes: [],
    waterSources: [],
    minRating: 0
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handler functions with proper TypeScript types
  const handleViewDetails = useCallback((property: LeaseProperty): void => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  }, []);

  const handleBrowseProperties = useCallback((): void => {
    setActiveTab("available");
    toast.success("Switched to Available Properties", {
      description: "Browse through our available lease properties"
    });
  }, []);

  const handleContactSupport = useCallback((): void => {
    setShowContactModal(true);
  }, []);

  const handleContactSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call with validation
      if (!contactForm.name || !contactForm.email || !contactForm.message) {
        throw new Error("Please fill in all required fields");
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success("Message Sent Successfully!", {
        description: "Our support team will contact you within 24 hours"
      });

      setContactForm({ name: "", email: "", phone: "", message: "" });
      setShowContactModal(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send message";
      setError(errorMessage);
      toast.error("Failed to send message", {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [contactForm]);

  const handleCallSupport = useCallback((): void => {
    window.open("tel:+911800123456");
    toast.info("Calling Support", {
      description: "Connecting you to our lease support team"
    });
  }, []);

  const handleEmailSupport = useCallback((): void => {
    window.open("mailto:lease-support@agrilift.com?subject=Property Listing Inquiry");
    toast.info("Opening Email", {
      description: "Compose your inquiry to our lease team"
    });
  }, []);

  const handleToggleFavorite = useCallback((propertyId: number): void => {
    setFavorites(prev => {
      const isFavorite = prev.includes(propertyId);
      const newFavorites = isFavorite
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId];

      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites", {
        description: isFavorite ? "Property removed from your favorites" : "Property saved to your favorites"
      });

      return newFavorites;
    });
  }, []);

  const handleTabChange = useCallback((value: string): void => {
    setActiveTab(value as TabType);
  }, []);

  const handleSortChange = useCallback((value: SortOption): void => {
    setSortBy(value);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode): void => {
    setViewMode(mode);
  }, []);

  // Optimized share handler
  const handleShare = useCallback((property: LeaseProperty): void => {
    const shareData = {
      title: property.title,
      text: `Check out this property: ${property.title} in ${property.location}`,
      url: `${window.location.href}?property=${property.id}`
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success("Link copied to clipboard!");
    }
  }, []);

  // Property comparison handlers
  const handleAddToCompare = useCallback((propertyId: number): void => {
    if (compareList.includes(propertyId)) {
      setCompareList(prev => prev.filter(id => id !== propertyId));
      toast.success("Property removed from comparison");
    } else if (compareList.length >= 3) {
      toast.error("You can compare up to 3 properties at once");
    } else {
      setCompareList(prev => [...prev, propertyId]);
      toast.success("Property added to comparison");
    }
  }, [compareList]);

  const handleClearCompare = useCallback((): void => {
    setCompareList([]);
    toast.success("Comparison list cleared");
  }, []);

  const handleShowCompare = useCallback((): void => {
    if (compareList.length < 2) {
      toast.error("Please select at least 2 properties to compare");
      return;
    }
    setShowCompareModal(true);
  }, [compareList]);

  // Error handling and retry functionality
  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    setError(null);

    try {
      // Simulate API retry logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRetryCount(prev => prev + 1);
      toast.success("Data refreshed successfully!");
    } catch (err) {
      setError("Failed to refresh data. Please try again.");
      toast.error("Failed to refresh data");
    } finally {
      setIsRetrying(false);
    }
  }, []);

  // Simulate error state for demonstration
  useEffect(() => {
    if (retryCount === 0) {
      // Simulate initial load error occasionally
      const shouldError = Math.random() < 0.1; // 10% chance of error
      if (shouldError) {
        setError("Failed to load properties. Please check your connection.");
      }
    }
  }, [retryCount]);

  // Memoized handlers for property cards
  const memoizedHandlers = useMemo(() => ({
    onViewDetails: handleViewDetails,
    onToggleFavorite: handleToggleFavorite,
    onShare: handleShare,
    onAddToCompare: handleAddToCompare
  }), [handleViewDetails, handleToggleFavorite, handleShare, handleAddToCompare]);

  // Sample lease data with proper TypeScript types
  const leaseProperties: LeaseProperty[] = useMemo(() => [
    {
      id: 1,
      title: "Premium Agricultural Land - 50 Acres",
      location: "Karnataka, India",
      price: "₹25,000/month",
      priceNumeric: 25000,
      duration: "2-5 years",
      type: "Agricultural Land",
      area: "50 acres",
      areaNumeric: 50,
      soilType: "Black Cotton Soil",
      waterSource: "Borewell + Canal",
      rating: 4.8,
      reviews: 24,
      features: ["Irrigation", "Road Access", "Electricity", "Storage"],
      image: "https://static.gujaratsamachar.com/content_image/content_image_fad12aaf-2344-4769-a0d5-34c02264a171.jpeg",
      available: true,
      description: "Premium agricultural land with excellent soil quality and modern irrigation facilities. Perfect for crop cultivation with guaranteed water supply.",
      ownerContact: {
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        email: "rajesh.kumar@email.com"
      },
      coordinates: { lat: 15.3173, lng: 75.7139 },
      dateAdded: "2024-01-15",
      isFeatured: true
    },
    {
      id: 2,
      title: "Modern Dairy Farm Facility",
      location: "Punjab, India",
      price: "₹45,000/month",
      priceNumeric: 45000,
      duration: "3-7 years",
      type: "Farmhouse",
      area: "25 acres",
      areaNumeric: 25,
      soilType: "Alluvial Soil",
      waterSource: "Tube well",
      rating: 4.9,
      reviews: 18,
      features: ["Milking Parlor", "Feed Storage", "Veterinary Room", "Cold Storage"],
      image: "https://elements-resized.envatousercontent.com/elements-video-cover-images/434e0318-1c1c-4c83-af9a-d2ea51b5a816/video_preview/video_preview_0000.jpg?w=500&cf_fit=cover&q=85&format=auto&s=38a45f3141d5b8328f300560df076201ee28b5f8e3496ea58dfda06d5f8f171a",
      available: true,
      description: "State-of-the-art dairy farm facility with modern milking equipment and proper storage facilities. Ideal for commercial dairy operations.",
      ownerContact: {
        name: "Harpreet Singh",
        phone: "+91 98765 43211",
        email: "harpreet.singh@email.com"
      },
      coordinates: { lat: 30.7333, lng: 76.7794 },
      dateAdded: "2024-01-20",
      isFeatured: false
    },
    {
      id: 3,
      title: "Organic Vegetable Farm Setup",
      location: "Maharashtra, India",
      price: "₹18,000/month",
      priceNumeric: 18000,
      duration: "1-3 years",
      type: "Greenhouse",
      area: "15 acres",
      areaNumeric: 15,
      soilType: "Red Soil",
      waterSource: "Drip Irrigation",
      rating: 4.6,
      reviews: 31,
      features: ["Greenhouse", "Organic Certified", "Processing Unit", "Market Access"],
      image: "https://www.agrifarming.in/wp-content/uploads/2020/03/Comp2-1.jpg",
      available: true,
      description: "Certified organic vegetable farm with greenhouse facilities and direct market access. Perfect for sustainable farming practices.",
      ownerContact: {
        name: "Priya Sharma",
        phone: "+91 98765 43212",
        email: "priya.sharma@email.com"
      },
      coordinates: { lat: 19.7515, lng: 75.7139 },
      dateAdded: "2024-01-25",
      isFeatured: true
    }
  ], []);

  const categories: string[] = useMemo(() =>
    ["All", "Agricultural Land", "Farmhouse", "Greenhouse", "Orchard", "Livestock Farm"],
    []
  );

  // Memoized filtering and sorting logic
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = leaseProperties.filter(property => {
      // Search filter
      const matchesSearch = searchTerm === "" ||
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === "All" || property.type === selectedCategory;

      // Price range filter
      const matchesPrice = property.priceNumeric >= filters.priceRange[0] &&
                          property.priceNumeric <= filters.priceRange[1];

      // Area range filter
      const matchesArea = property.areaNumeric >= filters.areaRange[0] &&
                         property.areaNumeric <= filters.areaRange[1];

      // Property type filter
      const matchesType = filters.propertyTypes.length === 0 ||
                         filters.propertyTypes.includes(property.type);

      // Features filter
      const matchesFeatures = filters.features.length === 0 ||
                             filters.features.every(feature =>
                               property.features.includes(feature));

      // Rating filter
      const matchesRating = property.rating >= filters.minRating;

      // Location filter
      const matchesLocation = filters.location === "" ||
                             property.location.toLowerCase().includes(filters.location.toLowerCase());

      return matchesSearch && matchesCategory && matchesPrice && matchesArea &&
             matchesType && matchesFeatures && matchesRating && matchesLocation;
    });

    // Sorting logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.priceNumeric - b.priceNumeric;
        case "price-high":
          return b.priceNumeric - a.priceNumeric;
        case "area-high":
          return b.areaNumeric - a.areaNumeric;
        case "area-low":
          return a.areaNumeric - b.areaNumeric;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [leaseProperties, searchTerm, selectedCategory, filters, sortBy]);

  // Memoized favorite properties
  const favoriteProperties = useMemo(() =>
    leaseProperties.filter(property => favorites.includes(property.id)),
    [leaseProperties, favorites]
  );

  // Enhanced loading component with skeleton states
  if (isLoading) {
    return (
      <Layout>
        <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen">
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section Skeleton */}
            <div className="text-center max-w-4xl mx-auto mb-12">
              <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
              <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>

            {/* Tabs Skeleton */}
            <Skeleton className="h-12 w-96 mx-auto mb-8" />

            {/* Property Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-full">
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-1/3" />
                      <div className="grid grid-cols-2 gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-14" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <ErrorBoundary>
      <Layout>
        <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen">
          <div className="container mx-auto px-4 py-8">

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetry}
                      disabled={isRetrying}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      {isRetrying ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Retrying...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setError(null)}
                      className="text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          {/* Hero Section */}
          <HeroSection
            onBrowseProperties={handleBrowseProperties}
            onContactSupport={handleContactSupport}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />

          {/* Search and Filters */}
          <SearchFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onShowFilters={() => setShowFiltersModal(true)}
            activeFiltersCount={
              (filters.priceRange[0] > 0 ? 1 : 0) +
              (filters.priceRange[1] < 100000 ? 1 : 0) +
              filters.propertyTypes.length +
              filters.features.length +
              (filters.minRating > 0 ? 1 : 0) +
              (filters.location ? 1 : 0)
            }
          />


          {/* Enhanced Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
            <TabsList
              className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto h-12 sm:h-12 bg-gray-100 p-1"
              role="tablist"
              aria-label="Property management sections"
            >
              <TabsTrigger
                value="available"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                aria-label="Available properties"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Available</span>
                <span className="sm:hidden">Available</span>
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                aria-label={`Favorite properties (${favorites.length} saved)`}
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Favorites</span>
                <span className="sm:hidden">Favorites</span>
                {favorites.length > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 p-0 text-xs" aria-label={`${favorites.length} favorites`}>
                    {favorites.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="my-leases"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                aria-label="My lease agreements"
              >
                <Users className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">My Leases</span>
                <span className="sm:hidden">Leases</span>
              </TabsTrigger>
              <TabsTrigger
                value="list-property"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                aria-label="List your property for lease"
              >
                <Sprout className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">List Property</span>
                <span className="sm:hidden">List</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="mt-8">
              {/* No Results State */}
              {filteredAndSortedProperties.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties Found</h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search criteria or filters to find more properties.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                      setFilters({
                        priceRange: [0, 100000],
                        areaRange: [0, 100],
                        propertyTypes: [],
                        features: [],
                        location: "",
                        soilTypes: [],
                        waterSources: [],
                        minRating: 0
                      });
                    }}
                  >
                    Clear All Filters
                  </Button>
                </motion.div>
              ) : (
                <div className={`grid gap-4 sm:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}>
                  <AnimatePresence>
                    {filteredAndSortedProperties.map((property: LeaseProperty, index: number) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        index={index}
                        viewMode={viewMode}
                        isFavorite={favorites.includes(property.id)}
                        isInCompare={compareList.includes(property.id)}
                        onViewDetails={memoizedHandlers.onViewDetails}
                        onToggleFavorite={memoizedHandlers.onToggleFavorite}
                        onShare={memoizedHandlers.onShare}
                        onAddToCompare={memoizedHandlers.onAddToCompare}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="mt-8">
              {favoriteProperties.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Favorite Properties</h3>
                  <p className="text-gray-500 mb-6">
                    Save properties you're interested in by clicking the heart icon.
                  </p>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setActiveTab("available")}
                  >
                    Browse Properties
                  </Button>
                </motion.div>
              ) : (
                <div className={`grid gap-4 sm:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}>
                  <AnimatePresence>
                    {favoriteProperties.map((property: LeaseProperty, index: number) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        index={index}
                        viewMode={viewMode}
                        isFavorite={true}
                        isInCompare={compareList.includes(property.id)}
                        onViewDetails={memoizedHandlers.onViewDetails}
                        onToggleFavorite={memoizedHandlers.onToggleFavorite}
                        onShare={memoizedHandlers.onShare}
                        onAddToCompare={memoizedHandlers.onAddToCompare}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            {/* Enhanced My Leases Tab */}
            <TabsContent value="my-leases" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="bg-emerald-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Tractor className="h-12 w-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Active Leases</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  You don't have any active lease agreements yet. Start exploring our available properties to find the perfect match for your farming needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 px-8"
                    onClick={handleBrowseProperties}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Browse Available Properties
                  </Button>
                  <Button
                    variant="outline"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8"
                    onClick={handleContactSupport}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Get Help Finding Properties
                  </Button>
                </div>
              </motion.div>
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
                    <Button
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      onClick={handleContactSupport}
                    >
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Property Details Modal */}
      <Dialog open={showPropertyModal} onOpenChange={setShowPropertyModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-800">
              {selectedProperty?.title}
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>

          {selectedProperty && (
            <div className="space-y-6">
              {/* Property Image */}
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-emerald-600">
                  {selectedProperty.type}
                </Badge>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="outline" className="bg-white/90">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/90">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Property Details</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Location:</span>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
                        <span className="font-medium">{selectedProperty.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Area:</span>
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-1 text-emerald-600" />
                        <span className="font-medium">{selectedProperty.area}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-emerald-600" />
                        <span className="font-medium">{selectedProperty.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Soil Type:</span>
                      <span className="font-medium">{selectedProperty.soilType}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Water Source:</span>
                      <div className="flex items-center">
                        <Droplets className="h-4 w-4 mr-1 text-blue-600" />
                        <span className="font-medium">{selectedProperty.waterSource}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{selectedProperty.rating} ({selectedProperty.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Pricing & Features</h3>

                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">
                      {selectedProperty.price}
                    </div>
                    <p className="text-gray-600">Monthly lease rate</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Available Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    toast.success("Interest Registered!", {
                      description: "Property owner will be notified of your interest"
                    });
                  }}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Express Interest
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCallSupport}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Owner
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowPropertyModal(false);
                    setShowContactModal(true);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Support Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-gray-600">
              Choose how you'd like to contact our lease support team:
            </p>

            {/* Quick Contact Options */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex flex-col items-center p-4 h-auto"
                onClick={handleCallSupport}
              >
                <Phone className="h-6 w-6 mb-2 text-emerald-600" />
                <span className="text-sm">Call Now</span>
                <span className="text-xs text-gray-500">+91 1800-123-456</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center p-4 h-auto"
                onClick={handleEmailSupport}
              >
                <Mail className="h-6 w-6 mb-2 text-emerald-600" />
                <span className="text-sm">Email Us</span>
                <span className="text-xs text-gray-500">lease-support@agrilift.com</span>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or send a message</span>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <Input
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                required
              />

              <Input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                required
              />

              <Input
                type="tel"
                placeholder="Your Phone Number"
                value={contactForm.phone}
                onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
              />

              <Textarea
                placeholder="Your message or inquiry..."
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                rows={3}
                required
              />

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Advanced Filters Modal */}
      <Dialog open={showFiltersModal} onOpenChange={setShowFiltersModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Advanced Filters
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Price Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Price Range (₹/month)</label>
              <div className="px-3">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters({...filters, priceRange: value as [number, number]})}
                  max={100000}
                  min={0}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>₹{filters.priceRange[0].toLocaleString()}</span>
                  <span>₹{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Area Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Area (acres)</label>
              <div className="px-3">
                <Slider
                  value={filters.areaRange}
                  onValueChange={(value) => setFilters({...filters, areaRange: value as [number, number]})}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>{filters.areaRange[0]} acres</span>
                  <span>{filters.areaRange[1]} acres</span>
                </div>
              </div>
            </div>

            {/* Property Types */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Property Types</label>
              <div className="grid grid-cols-2 gap-2">
                {(["Agricultural Land", "Dairy Farm", "Vegetable Farm", "Poultry Farm", "Orchard"] as PropertyType[]).map((type) => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.propertyTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({...filters, propertyTypes: [...filters.propertyTypes, type]});
                        } else {
                          setFilters({...filters, propertyTypes: filters.propertyTypes.filter(t => t !== type)});
                        }
                      }}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Required Features</label>
              <div className="grid grid-cols-2 gap-2">
                {["Irrigation", "Road Access", "Electricity", "Storage", "Greenhouse", "Organic Certified", "Processing Unit", "Market Access", "Milking Parlor", "Feed Storage", "Veterinary Room", "Cold Storage"].map((feature) => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.features.includes(feature)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({...filters, features: [...filters.features, feature]});
                        } else {
                          setFilters({...filters, features: filters.features.filter(f => f !== feature)});
                        }
                      }}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Minimum Rating</label>
              <Select
                value={filters.minRating.toString()}
                onValueChange={(value) => setFilters({...filters, minRating: parseFloat(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any rating</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="4.5">4.5+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="Enter city or state..."
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setFilters({
                  priceRange: [0, 100000],
                  areaRange: [0, 100],
                  propertyTypes: [],
                  features: [],
                  minRating: 0,
                  soilTypes: [],
                  waterSources: [],
                  location: ""
                });
              }}
            >
              Clear All
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                setShowFiltersModal(false);
                toast.success("Filters applied successfully!");
              }}
            >
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Compare Button */}
      {compareList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={handleShowCompare}
            className="bg-emerald-600 hover:bg-emerald-700 shadow-lg rounded-full px-6 py-3 flex items-center gap-2"
            disabled={compareList.length < 2}
          >
            <GitCompare className="h-5 w-5" />
            Compare ({compareList.length})
          </Button>
          {compareList.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearCompare}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </motion.div>
      )}

      {/* Property Comparison Modal */}
      <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-800">
              Property Comparison
            </DialogTitle>
            <p className="text-gray-600">
              Compare selected properties side by side
            </p>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {compareList.map(propertyId => {
              const property = leaseProperties.find(p => p.id === propertyId);
              if (!property) return null;

              return (
                <div key={property.id} className="border rounded-lg p-4 space-y-4">
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddToCompare(property.id)}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">{property.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-medium">{property.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{property.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Soil Type:</span>
                      <span className="font-medium">{property.soilType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Water Source:</span>
                      <span className="font-medium">{property.waterSource}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">{property.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm mb-2">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {property.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {property.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      handleViewDetails(property);
                      setShowCompareModal(false);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={handleClearCompare}
            >
              Clear All
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCompareModal(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
    </ErrorBoundary>
  );
};

export default Lease;
