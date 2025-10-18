import React from "react";
import { motion } from "framer-motion";
import { ListingItem } from "@/types/farming";
import { Star, ShoppingCart, Heart } from "lucide-react";

interface FeaturedListingsProps {
  listings: ListingItem[];
  onAddToCart?: (listing: ListingItem) => void;
}

const FeaturedListings: React.FC<FeaturedListingsProps> = ({ listings, onAddToCart }) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {listings.map((listing) => (
        <motion.div
          key={listing.id}
          variants={itemVariants}
          whileHover={{ y: -8 }}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-slate-600 transition-all duration-300"
        >
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden bg-slate-900">
            <motion.img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />

            {/* Badge */}
            {listing.badge && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold"
              >
                {listing.badge}
              </motion.div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Title */}
            <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
              {listing.title}
            </h3>

            {/* Seller */}
            <p className="text-sm text-gray-400 mb-3">by {listing.seller}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(listing.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">
                ({listing.reviews} reviews)
              </span>
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white"
              >
                ₹{listing.price.toLocaleString()}
              </motion.div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600 text-gray-300 hover:text-white transition-all"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAddToCart?.(listing)}
                  className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeaturedListings;

