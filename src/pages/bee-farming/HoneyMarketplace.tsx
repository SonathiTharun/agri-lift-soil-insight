import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Star,
  MapPin,
  Droplet,
  Filter,
  Search,
  Check,
  AlertCircle,
  Award,
  TrendingUp,
} from "lucide-react";

interface HoneyListing {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  price: number;
  seller: string;
  location: string;
  certification: string;
  rating: number;
  reviews: number;
  description: string;
  benefits: string[];
  harvestDate: string;
  purity: string;
}

const HoneyMarketplace: React.FC = () => {
  const [listings] = useState<HoneyListing[]>([
    {
      id: "1",
      name: "Pure Wildflower Honey",
      type: "Wildflower",
      quantity: 50,
      unit: "kg",
      price: 450,
      seller: "Rajesh Beekeeping",
      location: "Hyderabad, Telangana",
      certification: "Organic Certified",
      rating: 4.8,
      reviews: 234,
      description: "Premium wildflower honey with rich flavor and natural enzymes. Perfect for daily consumption and health benefits.",
      benefits: ["Rich in antioxidants", "Natural energy boost", "Immune support", "Pure & unfiltered"],
      harvestDate: "Oct 2024",
      purity: "100% Pure",
    },
    {
      id: "2",
      name: "Sunflower Honey Premium",
      type: "Sunflower",
      quantity: 30,
      unit: "kg",
      price: 420,
      seller: "Priya's Farm",
      location: "Warangal, Telangana",
      certification: "ISO Certified",
      rating: 4.6,
      reviews: 156,
      description: "Golden sunflower honey with mild taste. Excellent for baking and culinary uses.",
      benefits: ["Mild flavor", "Great for baking", "Natural sweetener", "Long shelf life"],
      harvestDate: "Sep 2024",
      purity: "100% Pure",
    },
    {
      id: "3",
      name: "Eucalyptus Honey Elite",
      type: "Eucalyptus",
      quantity: 75,
      unit: "kg",
      price: 480,
      seller: "Kumar Beekeeping",
      location: "Bangalore, Karnataka",
      certification: "Organic Certified",
      rating: 4.9,
      reviews: 312,
      description: "Premium eucalyptus honey known for medicinal properties. Ideal for respiratory health.",
      benefits: ["Respiratory support", "Medicinal properties", "Cough relief", "Throat soothing"],
      harvestDate: "Nov 2024",
      purity: "100% Pure",
    },
    {
      id: "4",
      name: "Neem Flower Honey Premium",
      type: "Neem",
      quantity: 40,
      unit: "kg",
      price: 500,
      seller: "Vikram's Bees",
      location: "Vijayawada, Andhra Pradesh",
      certification: "Organic + ISO",
      rating: 4.7,
      reviews: 189,
      description: "Rare neem flower honey with powerful health benefits. Premium quality for health-conscious consumers.",
      benefits: ["Antibacterial", "Skin health", "Digestive support", "Blood purification"],
      harvestDate: "Oct 2024",
      purity: "100% Pure",
    },
    {
      id: "5",
      name: "Acacia Honey Gold",
      type: "Acacia",
      quantity: 60,
      unit: "kg",
      price: 520,
      seller: "Sharma Apiaries",
      location: "Pune, Maharashtra",
      certification: "Organic Certified",
      rating: 4.8,
      reviews: 267,
      description: "Light and delicate acacia honey. Perfect for those who prefer mild flavors.",
      benefits: ["Mild flavor", "Slow crystallization", "Premium quality", "Versatile use"],
      harvestDate: "Aug 2024",
      purity: "100% Pure",
    },
    {
      id: "6",
      name: "Multifloral Honey Supreme",
      type: "Multifloral",
      quantity: 45,
      unit: "kg",
      price: 460,
      seller: "Desai Beekeeping",
      location: "Nashik, Maharashtra",
      certification: "ISO Certified",
      rating: 4.7,
      reviews: 198,
      description: "Rich blend of multiple flower nectars. Balanced flavor with maximum health benefits.",
      benefits: ["Balanced nutrition", "Rich flavor", "Multiple benefits", "All-purpose honey"],
      harvestDate: "Sep 2024",
      purity: "100% Pure",
    },
  ]);

  const [filters, setFilters] = useState({
    type: "",
    maxPrice: 600,
    minRating: 0,
    search: "",
    sortBy: "popular",
  });
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedHoney, setSelectedHoney] = useState<HoneyListing | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredListings = useMemo(() => {
    return listings
      .filter((listing) => {
        const matchesType = !filters.type || listing.type.includes(filters.type);
        const matchesPrice = listing.price <= filters.maxPrice;
        const matchesRating = listing.rating >= filters.minRating;
        const matchesSearch =
          !filters.search ||
          listing.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          listing.type.toLowerCase().includes(filters.search.toLowerCase());
        return matchesType && matchesPrice && matchesRating && matchesSearch;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price-low") return a.price - b.price;
        if (filters.sortBy === "price-high") return b.price - a.price;
        if (filters.sortBy === "rating") return b.rating - a.rating;
        return b.reviews - a.reviews;
      });
  }, [filters, listings]);

  const toggleCart = (id: string) => {
    setCart((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* Premium Header */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-amber-500/20 sticky top-0 z-40 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 bg-clip-text text-transparent">
                🍯 Honey Marketplace
              </h1>
              <p className="text-slate-400 mt-2">Premium honey from trusted beekeepers</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <ShoppingCart className="w-8 h-8 text-amber-400" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </motion.div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search honey by name or type..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Premium Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto px-4 mb-8 mt-6"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-bold text-amber-300 mb-3">Honey Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-all"
                  >
                    <option value="">All Types</option>
                    <option value="Wildflower">Wildflower</option>
                    <option value="Sunflower">Sunflower</option>
                    <option value="Eucalyptus">Eucalyptus</option>
                    <option value="Neem">Neem</option>
                    <option value="Acacia">Acacia</option>
                    <option value="Multifloral">Multifloral</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-bold text-amber-300 mb-3">
                    Max Price: ₹{filters.maxPrice}
                  </label>
                  <input
                    type="range"
                    min="400"
                    max="600"
                    step="20"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-bold text-amber-300 mb-3">Min Rating</label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-all"
                  >
                    <option value="0">All Ratings</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.7">4.7+ Stars</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-bold text-amber-300 mb-3">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-all"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Premium Honey Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 relative z-10"
      >
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Available Honey</h2>
            <p className="text-slate-400">
              Found <span className="text-amber-400 font-bold">{filteredListings.length}</span> premium honey listings
            </p>
          </div>
          <motion.div
            className="text-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-sm text-slate-400">Total Available</div>
            <div className="text-3xl font-bold text-amber-400">
              {filteredListings.reduce((sum, h) => sum + h.quantity, 0)} kg
            </div>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((honey, idx) => (
            <motion.div
              key={honey.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -12, boxShadow: "0px 30px 60px rgba(251, 146, 60, 0.3)" }}
              className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 shadow-xl transition-all duration-300"
            >
              {/* Gradient Overlay */}
              <motion.div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Certification Badge */}
              <div className="absolute top-4 right-4 z-20">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  {honey.certification.split(" ")[0]}
                </motion.div>
              </div>

              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleWishlist(honey.id)}
                className="absolute top-4 left-4 z-20 p-3 bg-slate-800/80 backdrop-blur rounded-full hover:bg-slate-700 transition-all"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    wishlist.includes(honey.id) ? "fill-red-500 text-red-500" : "text-slate-400"
                  }`}
                />
              </motion.button>

              {/* Image Section */}
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 h-48 flex items-center justify-center text-8xl relative overflow-hidden">
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🍯
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6 relative z-10">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(honey.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-400">({honey.reviews})</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                  {honey.name}
                </h3>
                <p className="text-sm text-slate-400 mb-4">{honey.type} Honey</p>

                {/* Benefits */}
                <div className="mb-4 space-y-2">
                  {honey.benefits.slice(0, 2).map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-amber-400" />
                      {benefit}
                    </div>
                  ))}
                </div>

                {/* Key Details */}
                <div className="bg-slate-700/30 rounded-lg p-3 mb-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Quantity:</span>
                    <span className="text-white font-semibold">{honey.quantity} {honey.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Purity:</span>
                    <span className="text-green-400 font-semibold">{honey.purity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Harvest:</span>
                    <span className="text-amber-300 font-semibold">{honey.harvestDate}</span>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="border-t border-slate-700/50 pt-4">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-black text-amber-400">₹{honey.price}</span>
                    <span className="text-sm text-slate-400">per kg</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCart(honey.id)}
                      className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                        cart.includes(honey.id)
                          ? "bg-green-500/20 border border-green-500 text-green-400"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 hover:shadow-lg"
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {cart.includes(honey.id) ? "Added" : "Add to Cart"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedHoney(honey)}
                      className="flex-1 py-3 px-4 rounded-lg font-bold border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 transition-all"
                    >
                      Details
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No honey found</h3>
            <p className="text-slate-400">Try adjusting your filters</p>
          </motion.div>
        )}
      </motion.section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedHoney && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedHoney(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedHoney.name}</h2>
                    <p className="text-slate-400">{selectedHoney.type} Honey</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedHoney(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </motion.button>
                </div>

                <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl h-64 flex items-center justify-center text-8xl mb-6">
                  🍯
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Quantity</div>
                    <div className="text-white font-bold">{selectedHoney.quantity} {selectedHoney.unit}</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Purity</div>
                    <div className="text-green-400 font-bold">{selectedHoney.purity}</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Harvest Date</div>
                    <div className="text-amber-300 font-bold">{selectedHoney.harvestDate}</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Certification</div>
                    <div className="text-blue-400 font-bold">{selectedHoney.certification}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">About This Honey</h3>
                  <p className="text-slate-300 leading-relaxed">{selectedHoney.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">Health Benefits</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedHoney.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-300">
                        <Check className="w-5 h-5 text-amber-400" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
                  <div className="text-slate-400 text-sm mb-2">Seller</div>
                  <div className="text-white font-bold text-lg mb-2">{selectedHoney.seller}</div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    {selectedHoney.location}
                  </div>
                </div>

                <div className="border-t border-slate-700/50 pt-6 flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Price per kg</div>
                    <div className="text-4xl font-black text-amber-400">₹{selectedHoney.price}</div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      toggleCart(selectedHoney.id);
                      setSelectedHoney(null);
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HoneyMarketplace;

