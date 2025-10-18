import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp, Users, Award } from "lucide-react";

interface HoneycombItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  link?: string;
  stats?: string;
  badge?: string;
}

const HoneycombGrid: React.FC = () => {
  const items: HoneycombItem[] = [
    {
      id: 1,
      title: "Italian Colonies",
      description: "High honey production, gentle temperament. Perfect for commercial operations.",
      icon: "🐝",
      color: "from-yellow-300 to-amber-400",
      stats: "35-40 kg/year",
      badge: "Premium",
    },
    {
      id: 2,
      title: "Rock Bee Colonies",
      description: "Excellent for Indian climate. Hardy and disease resistant.",
      icon: "🪨",
      color: "from-amber-300 to-orange-400",
      stats: "25-30 kg/year",
      badge: "Popular",
    },
    {
      id: 3,
      title: "Apis Cerana",
      description: "Native species, disease resistant. Sustainable beekeeping.",
      icon: "🌿",
      color: "from-green-300 to-emerald-400",
      stats: "15-20 kg/year",
      badge: "Organic",
    },
    {
      id: 4,
      title: "Honey Extraction",
      description: "Modern equipment and techniques. Electric extractors available.",
      icon: "🍯",
      color: "from-orange-300 to-red-400",
      stats: "20L capacity",
      badge: "Equipment",
    },
    {
      id: 5,
      title: "Hive Management",
      description: "Best practices and tools. Expert guidance included.",
      icon: "🏠",
      color: "from-purple-300 to-indigo-400",
      stats: "Complete toolkit",
      badge: "Tools",
    },
    {
      id: 6,
      title: "Pollination Services",
      description: "Rent colonies for crop pollination. Increase yields.",
      icon: "🌻",
      color: "from-pink-300 to-rose-400",
      stats: "Seasonal rental",
      badge: "Services",
    },
  ];

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Premium Featured Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -12, boxShadow: "0px 30px 60px rgba(251, 146, 60, 0.3)" }}
            className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 shadow-xl transition-all duration-300"
          >
            {/* Gradient Overlay */}
            <motion.div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Badge */}
            {item.badge && (
              <div className="absolute top-4 right-4 z-20">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 px-4 py-2 rounded-full text-xs font-bold"
                >
                  {item.badge}
                </motion.div>
              </div>
            )}

            {/* Icon Section */}
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 h-40 flex items-center justify-center text-7xl relative overflow-hidden">
              <motion.div
                animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {item.icon}
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-6 relative z-10">
              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-300 mb-4 line-clamp-2">{item.description}</p>

              {/* Stats */}
              {item.stats && (
                <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
                  <div className="text-xs text-slate-400 mb-1">Capacity</div>
                  <div className="text-amber-300 font-bold">{item.stats}</div>
                </div>
              )}

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
              >
                Explore
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 text-center">
          <TrendingUp className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <div className="text-3xl font-black text-amber-400 mb-2">5,000+</div>
          <div className="text-slate-400">Active Beekeepers</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 text-center">
          <Users className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <div className="text-3xl font-black text-amber-400 mb-2">50K+</div>
          <div className="text-slate-400">Honey Traded (Tons)</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 text-center">
          <Award className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <div className="text-3xl font-black text-amber-400 mb-2">98.5%</div>
          <div className="text-slate-400">Success Rate</div>
        </div>
      </motion.div>
    </div>
  );
};

export default HoneycombGrid;

