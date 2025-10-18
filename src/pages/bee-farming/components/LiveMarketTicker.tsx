import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MarketData {
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  color: string;
}

const LiveMarketTicker: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([
    {
      label: "Honey Price (avg)",
      value: "₹450/kg",
      trend: "up",
      color: "text-green-600",
    },
    {
      label: "Italian Bee Colony",
      value: "₹8,500",
      trend: "stable",
      color: "text-amber-600",
    },
    {
      label: "Rock Bee Colony",
      value: "₹6,200",
      trend: "up",
      color: "text-green-600",
    },
    {
      label: "Apis Cerana Colony",
      value: "₹5,800",
      trend: "down",
      color: "text-red-600",
    },
    {
      label: "Beeswax Price",
      value: "₹380/kg",
      trend: "stable",
      color: "text-amber-600",
    },
    {
      label: "Equipment Cost (avg)",
      value: "₹12,000",
      trend: "stable",
      color: "text-amber-600",
    },
  ]);

  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % (marketData.length * 100));
    }, 50);
    return () => clearInterval(interval);
  }, [marketData.length]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "down":
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 rounded-2xl shadow-xl p-6 border-2 border-yellow-400 overflow-hidden relative">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
          📊 Live Market Ticker
        </h2>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="text-2xl"
        >
          🐝
        </motion.div>
      </div>

      {/* Scrolling Ticker */}
      <div className="relative overflow-hidden bg-white/50 rounded-xl p-4 backdrop-blur-md border border-white/30 shadow-inner">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: -scrollPosition }}
          transition={{ type: "linear", duration: 0.5 }}
        >
          {/* Duplicate items for seamless loop */}
          {[...marketData, ...marketData].map((item, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-white to-yellow-50 rounded-lg shadow-md min-w-max border border-yellow-100 hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center">{getTrendIcon(item.trend)}</div>
              <div>
                <span className="font-semibold text-gray-700 text-sm">{item.label}:</span>
                <span className={`ml-2 font-bold text-lg ${item.color}`}>
                  {item.value}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Update Info */}
      <div className="flex items-center justify-center gap-2 mt-4 text-amber-900 font-semibold">
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xl"
        >
          🔴
        </motion.span>
        <span>Updates every 30 seconds</span>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {marketData.slice(0, 3).map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="bg-white/60 backdrop-blur rounded-lg p-3 text-center border border-yellow-200"
          >
            <p className="text-xs text-gray-600 font-semibold">{item.label}</p>
            <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-gray-500">{getTrendIcon(item.trend)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LiveMarketTicker;

