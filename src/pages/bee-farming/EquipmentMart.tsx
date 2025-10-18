import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Star,
  Zap,
  Filter,
  Search,
  Check,
  AlertCircle,
  Truck,
  Shield,
  Award,
} from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  icon: string;
  inStock: number;
  rating: number;
  reviews: number;
  warranty: string;
  features: string[];
  specifications: string;
  brand: string;
}

const EquipmentMart: React.FC = () => {
  const [equipment] = useState<Equipment[]>([
    {
      id: "1",
      name: "Langstroth Hive Box Premium",
      category: "Hives",
      price: 3500,
      description: "Standard wooden hive box with frames. Perfect for beginners and professionals.",
      icon: "🏠",
      inStock: 25,
      rating: 4.8,
      reviews: 156,
      warranty: "2 years",
      features: ["Durable wood", "10 frames included", "Easy assembly", "Weather resistant"],
      specifications: "Dimensions: 50x40x20cm, Weight: 2.5kg",
      brand: "BeeKeep Pro",
    },
    {
      id: "2",
      name: "Professional Bee Smoker",
      category: "Tools",
      price: 1200,
      description: "Stainless steel bee smoker with heat shield. Essential tool for beekeeping.",
      icon: "💨",
      inStock: 40,
      rating: 4.7,
      reviews: 98,
      warranty: "1 year",
      features: ["Stainless steel", "Heat shield", "Easy refill", "Durable bellows"],
      specifications: "Capacity: 500ml, Height: 25cm",
      brand: "SmokeGuard",
    },
    {
      id: "3",
      name: "Electric Honey Extractor",
      category: "Processing",
      price: 8500,
      description: "Electric honey extractor with 20L capacity. Perfect for commercial operations.",
      icon: "🍯",
      inStock: 8,
      rating: 4.9,
      reviews: 234,
      warranty: "3 years",
      features: ["Electric powered", "20L capacity", "Stainless steel", "Easy cleaning"],
      specifications: "Power: 1.5kW, Speed: 0-1500 RPM",
      brand: "HoneyMax",
    },
    {
      id: "4",
      name: "Full Protective Bee Suit",
      category: "Safety",
      price: 2500,
      description: "Complete protective bee suit with integrated veil. Maximum protection.",
      icon: "👔",
      inStock: 35,
      rating: 4.6,
      reviews: 145,
      warranty: "1 year",
      features: ["Full coverage", "Integrated veil", "Breathable fabric", "Multiple sizes"],
      specifications: "Material: Cotton-polyester blend, Sizes: S-XXL",
      brand: "SafeKeep",
    },
    {
      id: "5",
      name: "Multi-Purpose Hive Tool",
      category: "Tools",
      price: 450,
      description: "Stainless steel hive tool with multiple functions. Essential for every beekeeper.",
      icon: "🔧",
      inStock: 60,
      rating: 4.8,
      reviews: 189,
      warranty: "Lifetime",
      features: ["Stainless steel", "Multi-function", "Ergonomic grip", "Rust-proof"],
      specifications: "Length: 25cm, Weight: 200g",
      brand: "ToolMaster",
    },
    {
      id: "6",
      name: "Soft Bristle Bee Brush",
      category: "Tools",
      price: 350,
      description: "Gentle bee brush for safe hive manipulation. Won't harm bees.",
      icon: "🪮",
      inStock: 50,
      rating: 4.7,
      reviews: 112,
      warranty: "6 months",
      features: ["Soft bristles", "Gentle on bees", "Durable handle", "Easy to clean"],
      specifications: "Bristle length: 5cm, Handle: 20cm",
      brand: "BeeGentle",
    },
    {
      id: "7",
      name: "Entrance Pollen Trap",
      category: "Accessories",
      price: 1800,
      description: "Entrance pollen trap for pollen collection. Increase honey production.",
      icon: "🌼",
      inStock: 15,
      rating: 4.5,
      reviews: 87,
      warranty: "1 year",
      features: ["Easy installation", "Pollen collection", "Adjustable", "Durable mesh"],
      specifications: "Mesh size: 4mm, Material: Plastic",
      brand: "PollenPro",
    },
    {
      id: "8",
      name: "Queen Excluder Frame",
      category: "Accessories",
      price: 600,
      description: "Prevents queen from laying eggs in honey supers. Improves honey quality.",
      icon: "👑",
      inStock: 30,
      rating: 4.6,
      reviews: 95,
      warranty: "2 years",
      features: ["Prevents brood", "Improves quality", "Easy installation", "Durable"],
      specifications: "Dimensions: 50x40cm, Material: Plastic",
      brand: "QueenGuard",
    },
    {
      id: "9",
      name: "Bee Feeder System",
      category: "Accessories",
      price: 950,
      description: "Top-bar bee feeder for supplemental feeding. Essential during off-season.",
      icon: "🍯",
      inStock: 22,
      rating: 4.7,
      reviews: 134,
      warranty: "1 year",
      features: ["Easy refill", "Prevents drowning", "Durable plastic", "Multiple sizes"],
      specifications: "Capacity: 2L, Material: Food-grade plastic",
      brand: "FeedPro",
    },
    {
      id: "10",
      name: "Bee Veil Hat",
      category: "Safety",
      price: 800,
      description: "Protective veil hat for face protection. Comfortable and durable.",
      icon: "🎩",
      inStock: 45,
      rating: 4.8,
      reviews: 167,
      warranty: "1 year",
      features: ["Full face protection", "Breathable mesh", "Adjustable", "Lightweight"],
      specifications: "Material: Nylon mesh, One size fits all",
      brand: "VeilPro",
    },
    {
      id: "11",
      name: "Honey Strainer Filter",
      category: "Processing",
      price: 1500,
      description: "Fine mesh honey strainer for filtering. Produces crystal clear honey.",
      icon: "🔍",
      inStock: 28,
      rating: 4.9,
      reviews: 201,
      warranty: "2 years",
      features: ["Fine mesh", "Stainless steel", "Easy cleaning", "Multiple sizes"],
      specifications: "Mesh: 200 micron, Capacity: 10L",
      brand: "FilterMax",
    },
    {
      id: "12",
      name: "Bee Escape Board",
      category: "Accessories",
      price: 1100,
      description: "One-way bee escape for honey harvesting. Gentle and effective.",
      icon: "🚪",
      inStock: 18,
      rating: 4.6,
      reviews: 78,
      warranty: "1 year",
      features: ["One-way design", "Gentle", "Reusable", "Easy installation"],
      specifications: "Dimensions: 50x40cm, Material: Plastic",
      brand: "EscapePro",
    },
  ]);

  const [filters, setFilters] = useState({
    category: "",
    maxPrice: 10000,
    minRating: 0,
    search: "",
    sortBy: "popular",
  });
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredEquipment = useMemo(() => {
    return equipment
      .filter((item) => {
        const matchesCategory = !filters.category || item.category === filters.category;
        const matchesPrice = item.price <= filters.maxPrice;
        const matchesRating = item.rating >= filters.minRating;
        const matchesSearch =
          !filters.search ||
          item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.category.toLowerCase().includes(filters.search.toLowerCase());
        return matchesCategory && matchesPrice && matchesRating && matchesSearch;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price-low") return a.price - b.price;
        if (filters.sortBy === "price-high") return b.price - a.price;
        if (filters.sortBy === "rating") return b.rating - a.rating;
        return b.reviews - a.reviews;
      });
  }, [filters, equipment]);

  const toggleCart = (id: string) => {
    setCart((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const categories = ["Hives", "Tools", "Processing", "Safety", "Accessories"];

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
                🛠️ Equipment Mart
              </h1>
              <p className="text-slate-400 mt-2">Professional beekeeping equipment & supplies</p>
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
                placeholder="Search equipment..."
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
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-bold text-amber-300 mb-3">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-all"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-bold text-amber-300 mb-3">
                    Max Price: ₹{filters.maxPrice.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="500"
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

      {/* Premium Equipment Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 relative z-10"
      >
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Available Equipment</h2>
            <p className="text-slate-400">
              Found <span className="text-amber-400 font-bold">{filteredEquipment.length}</span> products
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
              ₹{filteredEquipment.reduce((sum, e) => sum + e.price, 0).toLocaleString()}
            </div>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEquipment.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -12, boxShadow: "0px 30px 60px rgba(251, 146, 60, 0.3)" }}
              className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 shadow-xl transition-all duration-300"
            >
              {/* Gradient Overlay */}
              <motion.div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Stock Badge */}
              <div className="absolute top-4 right-4 z-20">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${
                    item.inStock > 0
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      : "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {item.inStock > 0 ? `${item.inStock} in stock` : "Out of stock"}
                </motion.div>
              </div>

              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleWishlist(item.id)}
                className="absolute top-4 left-4 z-20 p-3 bg-slate-800/80 backdrop-blur rounded-full hover:bg-slate-700 transition-all"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    wishlist.includes(item.id) ? "fill-red-500 text-red-500" : "text-slate-400"
                  }`}
                />
              </motion.button>

              {/* Image Section */}
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 h-48 flex items-center justify-center text-8xl relative overflow-hidden">
                <motion.div
                  animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {item.icon}
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6 relative z-10">
                {/* Category Badge */}
                <div className="inline-block mb-3">
                  <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(item.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-400">({item.reviews})</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-slate-400 mb-4">{item.description}</p>

                {/* Features */}
                <div className="mb-4 space-y-2">
                  {item.features.slice(0, 2).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-amber-400" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Key Details */}
                <div className="bg-slate-700/30 rounded-lg p-3 mb-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Brand:</span>
                    <span className="text-white font-semibold">{item.brand}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Warranty:</span>
                    <span className="text-blue-400 font-semibold">{item.warranty}</span>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="border-t border-slate-700/50 pt-4">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-black text-amber-400">₹{item.price.toLocaleString()}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCart(item.id)}
                      disabled={item.inStock === 0}
                      className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                        cart.includes(item.id)
                          ? "bg-green-500/20 border border-green-500 text-green-400"
                          : item.inStock > 0
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 hover:shadow-lg"
                          : "bg-slate-700 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {cart.includes(item.id) ? "Added" : "Add to Cart"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedEquipment(item)}
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
        {filteredEquipment.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No equipment found</h3>
            <p className="text-slate-400">Try adjusting your filters</p>
          </motion.div>
        )}
      </motion.section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedEquipment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEquipment(null)}
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
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedEquipment.name}</h2>
                    <p className="text-slate-400">{selectedEquipment.category}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedEquipment(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </motion.button>
                </div>

                {/* Image */}
                <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl h-64 flex items-center justify-center text-8xl mb-6">
                  {selectedEquipment.icon}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Brand</div>
                    <div className="text-white font-bold">{selectedEquipment.brand}</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Warranty</div>
                    <div className="text-blue-400 font-bold">{selectedEquipment.warranty}</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Stock</div>
                    <div className={`font-bold ${selectedEquipment.inStock > 0 ? "text-green-400" : "text-red-400"}`}>
                      {selectedEquipment.inStock > 0 ? `${selectedEquipment.inStock} available` : "Out of stock"}
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Rating</div>
                    <div className="text-amber-300 font-bold">{selectedEquipment.rating} ⭐</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">About This Product</h3>
                  <p className="text-slate-300 leading-relaxed">{selectedEquipment.description}</p>
                </div>

                {/* Specifications */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">Specifications</h3>
                  <p className="text-slate-300">{selectedEquipment.specifications}</p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">Key Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedEquipment.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-300">
                        <Check className="w-5 h-5 text-amber-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                    <Truck className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <div className="text-xs text-slate-300">Free Shipping</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                    <Shield className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <div className="text-xs text-slate-300">Warranty</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                    <Award className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <div className="text-xs text-slate-300">Certified</div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="border-t border-slate-700/50 pt-6 flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Price</div>
                    <div className="text-4xl font-black text-amber-400">₹{selectedEquipment.price.toLocaleString()}</div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      toggleCart(selectedEquipment.id);
                      setSelectedEquipment(null);
                    }}
                    disabled={selectedEquipment.inStock === 0}
                    className={`px-8 py-4 font-bold rounded-xl transition-all ${
                      selectedEquipment.inStock > 0
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 hover:shadow-lg"
                        : "bg-slate-700 text-slate-500 cursor-not-allowed"
                    }`}
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

export default EquipmentMart;

