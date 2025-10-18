import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Star,
  MapPin,
  TrendingUp,
  Filter,
  Search,
  ChevronDown,
  Check,
  AlertCircle,
} from "lucide-react";

interface BeeColony {
  id: string;
  name: string;
  breed: string;
  price: number;
  location: string;
  health: string;
  productionCapacity: string;
  seller: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: number;
  description: string;
  features: string[];
  warranty: string;
}

const BeeColonyMarket: React.FC = () => {
  const [colonies] = useState<BeeColony[]>([
    {
      id: "1",
      name: "Italian Honey Producers Premium",
      breed: "Italian (Apis mellifera ligustica)",
      price: 8500,
      location: "Hyderabad, Telangana",
      health: "Excellent",
      productionCapacity: "35-40 kg/year",
      seller: "Rajesh Beekeeping Farm",
      image: "🐝",
      rating: 4.8,
      reviews: 156,
      inStock: 12,
      description: "High-quality Italian bee colonies known for excellent honey production and gentle temperament. Perfect for commercial beekeeping.",
      features: ["High honey yield", "Gentle temperament", "Disease resistant", "Easy to manage"],
      warranty: "6 months health guarantee",
    },
    {
      id: "2",
      name: "Rock Bee Strong Colony",
      breed: "Rock Bee (Apis dorsata)",
      price: 6200,
      location: "Warangal, Telangana",
      health: "Very Good",
      productionCapacity: "25-30 kg/year",
      seller: "Priya's Bee Farm",
      image: "🪨",
      rating: 4.6,
      reviews: 98,
      inStock: 8,
      description: "Robust rock bee colonies adapted to local climate. Excellent for beginners and experienced beekeepers alike.",
      features: ["Climate adapted", "Hardy", "Good foragers", "Low maintenance"],
      warranty: "3 months health guarantee",
    },
    {
      id: "3",
      name: "Apis Cerana Native Elite",
      breed: "Apis Cerana (Indian Bee)",
      price: 5800,
      location: "Bangalore, Karnataka",
      health: "Good",
      productionCapacity: "15-20 kg/year",
      seller: "Kumar Beekeeping",
      image: "🌿",
      rating: 4.5,
      reviews: 72,
      inStock: 15,
      description: "Native Indian bee colonies perfect for sustainable beekeeping. Excellent for organic honey production.",
      features: ["Native species", "Sustainable", "Organic honey", "Pest resistant"],
      warranty: "3 months health guarantee",
    },
    {
      id: "4",
      name: "Premium Italian Colony Elite",
      breed: "Italian (Apis mellifera ligustica)",
      price: 9200,
      location: "Vijayawada, Andhra Pradesh",
      health: "Excellent",
      productionCapacity: "40-45 kg/year",
      seller: "Vikram's Premium Bees",
      image: "🐝",
      rating: 4.9,
      reviews: 203,
      inStock: 5,
      description: "Premium Italian colonies with superior genetics. Ideal for commercial operations and honey production.",
      features: ["Superior genetics", "Maximum yield", "Premium quality", "Expert support"],
      warranty: "12 months health guarantee",
    },
    {
      id: "5",
      name: "Carniolan Bee Colony",
      breed: "Carniolan (Apis mellifera carnica)",
      price: 7800,
      location: "Pune, Maharashtra",
      health: "Excellent",
      productionCapacity: "30-35 kg/year",
      seller: "Sharma Apiaries",
      image: "🐝",
      rating: 4.7,
      reviews: 134,
      inStock: 10,
      description: "Carniolan bees known for their calm nature and excellent winter survival. Great for all seasons.",
      features: ["Calm temperament", "Winter hardy", "Good foragers", "Disease resistant"],
      warranty: "6 months health guarantee",
    },
    {
      id: "6",
      name: "Caucasian Bee Colony",
      breed: "Caucasian (Apis mellifera caucasica)",
      price: 8900,
      location: "Nashik, Maharashtra",
      health: "Excellent",
      productionCapacity: "38-42 kg/year",
      seller: "Desai Beekeeping",
      image: "🐝",
      rating: 4.8,
      reviews: 167,
      inStock: 7,
      description: "Caucasian bees with exceptional honey production. Perfect for large-scale operations.",
      features: ["High production", "Excellent foragers", "Calm", "Adaptable"],
      warranty: "9 months health guarantee",
    },
  ]);

  const [filters, setFilters] = useState({
    breed: "",
    maxPrice: 10000,
    location: "",
    search: "",
    sortBy: "popular",
  });
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedColony, setSelectedColony] = useState<BeeColony | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredColonies = useMemo(() => {
    return colonies
      .filter((colony) => {
        const matchesBreed = !filters.breed || colony.breed.includes(filters.breed);
        const matchesPrice = colony.price <= filters.maxPrice;
        const matchesLocation = !filters.location || colony.location.includes(filters.location);
        const matchesSearch =
          !filters.search ||
          colony.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          colony.breed.toLowerCase().includes(filters.search.toLowerCase());
        return matchesBreed && matchesPrice && matchesLocation && matchesSearch;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price-low") return a.price - b.price;
        if (filters.sortBy === "price-high") return b.price - a.price;
        if (filters.sortBy === "rating") return b.rating - a.rating;
        return b.reviews - a.reviews; // popular
      });
  }, [filters, colonies]);

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
                🐝 Bee Colony Marketplace
              </h1>
              <p className="text-slate-400 mt-2">Premium quality colonies from trusted beekeepers</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
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
                placeholder="Search colonies by name or breed..."
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
            className="max-w-7xl mx-auto px-4 mb-8"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Breed Filter */}
                <div>
                  <label className="block text-sm font-bold text-amber-300 mb-3">Breed</label>
                  <select
                    value={filters.breed}
                    onChange={(e) => setFilters({ ...filters, breed: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-all"
                  >
                    <option value="">All Breeds</option>
                    <option value="Italian">Italian</option>
                    <option value="Rock Bee">Rock Bee</option>
                    <option value="Apis Cerana">Apis Cerana</option>
                    <option value="Carniolan">Carniolan</option>
                    <option value="Caucasian">Caucasian</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-bold text-amber-300 mb-3">
                    Max Price: ₹{filters.maxPrice.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="5000"
                    max="10000"
                    step="500"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-bold text-amber-300 mb-3">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-all"
                  >
                    <option value="">All Locations</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Warangal">Warangal</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Pune">Pune</option>
                    <option value="Nashik">Nashik</option>
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

      {/* Premium Colonies Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 relative z-10"
      >
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Available Colonies</h2>
            <p className="text-slate-400">
              Found <span className="text-amber-400 font-bold">{filteredColonies.length}</span> colonies matching your criteria
            </p>
          </div>
          <motion.div
            className="text-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-sm text-slate-400">Total Value</div>
            <div className="text-3xl font-bold text-amber-400">
              ₹{filteredColonies.reduce((sum, c) => sum + c.price, 0).toLocaleString()}
            </div>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredColonies.map((colony, idx) => (
            <motion.div
              key={colony.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -12, boxShadow: "0px 30px 60px rgba(251, 146, 60, 0.3)" }}
              className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 shadow-xl transition-all duration-300"
            >
              {/* Gradient Overlay on Hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              />

              {/* Stock Badge */}
              <div className="absolute top-4 right-4 z-20">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {colony.inStock} in stock
                </motion.div>
              </div>

              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleWishlist(colony.id)}
                className="absolute top-4 left-4 z-20 p-3 bg-slate-800/80 backdrop-blur rounded-full hover:bg-slate-700 transition-all"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    wishlist.includes(colony.id) ? "fill-red-500 text-red-500" : "text-slate-400"
                  }`}
                />
              </motion.button>

              {/* Image Section */}
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 h-48 flex items-center justify-center text-8xl relative overflow-hidden">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-8xl"
                >
                  {colony.image}
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
                          i < Math.floor(colony.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-400">({colony.reviews} reviews)</span>
                </div>

                {/* Title and Breed */}
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                  {colony.name}
                </h3>
                <p className="text-sm text-slate-400 mb-4">{colony.breed}</p>

                {/* Features */}
                <div className="mb-4 space-y-2">
                  {colony.features.slice(0, 2).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-amber-400" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Key Details */}
                <div className="bg-slate-700/30 rounded-lg p-3 mb-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-white font-semibold flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      {colony.location.split(",")[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Production:</span>
                    <span className="text-amber-300 font-semibold">{colony.productionCapacity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Warranty:</span>
                    <span className="text-green-400 font-semibold">{colony.warranty}</span>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="border-t border-slate-700/50 pt-4">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-black text-amber-400">₹{colony.price.toLocaleString()}</span>
                    <span className="text-sm text-slate-400">per colony</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCart(colony.id)}
                      className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                        cart.includes(colony.id)
                          ? "bg-green-500/20 border border-green-500 text-green-400"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 hover:shadow-lg"
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {cart.includes(colony.id) ? "Added" : "Add to Cart"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedColony(colony)}
                      className="flex-1 py-3 px-4 rounded-lg font-bold border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 transition-all"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredColonies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No colonies found</h3>
            <p className="text-slate-400">Try adjusting your filters to find what you're looking for</p>
          </motion.div>
        )}
      </motion.section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedColony && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedColony(null)}
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
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedColony.name}</h2>
                    <p className="text-slate-400">{selectedColony.breed}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedColony(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </motion.button>
                </div>

                {/* Image */}
                <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl h-64 flex items-center justify-center text-8xl mb-6">
                  {selectedColony.image}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Location</div>
                    <div className="text-white font-bold flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-400" />
                      {selectedColony.location}
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Production Capacity</div>
                    <div className="text-amber-300 font-bold">{selectedColony.productionCapacity}</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Health Status</div>
                    <div className="text-green-400 font-bold">{selectedColony.health}</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Warranty</div>
                    <div className="text-blue-400 font-bold">{selectedColony.warranty}</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">About This Colony</h3>
                  <p className="text-slate-300 leading-relaxed">{selectedColony.description}</p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">Key Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedColony.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-300">
                        <Check className="w-5 h-5 text-amber-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seller Info */}
                <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
                  <div className="text-slate-400 text-sm mb-2">Seller</div>
                  <div className="text-white font-bold text-lg">{selectedColony.seller}</div>
                </div>

                {/* Price and CTA */}
                <div className="border-t border-slate-700/50 pt-6 flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Price</div>
                    <div className="text-4xl font-black text-amber-400">₹{selectedColony.price.toLocaleString()}</div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      toggleCart(selectedColony.id);
                      setSelectedColony(null);
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

export default BeeColonyMarket;

