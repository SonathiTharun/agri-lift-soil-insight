import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Droplets, AlertCircle, Leaf } from "lucide-react";

interface SeasonData {
  month: string;
  season: string;
  floweringPlants: string[];
  honeyFlow: string;
  bestPractices: string[];
  weatherAlert: string;
  icon: string;
}

const SeasonalInsights: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const seasonalData: SeasonData[] = [
    {
      month: "January",
      season: "Winter",
      floweringPlants: ["Mustard", "Sunflower", "Eucalyptus"],
      honeyFlow: "Moderate",
      bestPractices: [
        "Prepare hives for spring expansion",
        "Check food stores and supplement if needed",
        "Monitor for varroa mites",
      ],
      weatherAlert: "Cold nights - ensure hive insulation",
      icon: "❄️",
    },
    {
      month: "February",
      season: "Winter",
      floweringPlants: ["Mustard", "Marigold", "Eucalyptus"],
      honeyFlow: "Good",
      bestPractices: [
        "Begin spring feeding",
        "Clean and repair equipment",
        "Plan colony expansion",
      ],
      weatherAlert: "Variable temperatures - monitor hive health",
      icon: "❄️",
    },
    {
      month: "March",
      season: "Spring",
      floweringPlants: ["Neem", "Mango", "Coconut"],
      honeyFlow: "Excellent",
      bestPractices: [
        "Start spring inspections",
        "Add supers for honey storage",
        "Manage swarming",
      ],
      weatherAlert: "Increasing temperatures - ensure ventilation",
      icon: "🌸",
    },
    {
      month: "April",
      season: "Spring",
      floweringPlants: ["Litchi", "Jamun", "Acacia"],
      honeyFlow: "Excellent",
      bestPractices: [
        "Peak honey production season",
        "Manage brood patterns",
        "Prepare for summer",
      ],
      weatherAlert: "Hot days - provide water sources",
      icon: "🌸",
    },
    {
      month: "May",
      season: "Summer",
      floweringPlants: ["Teak", "Sal", "Bamboo"],
      honeyFlow: "Moderate",
      bestPractices: [
        "Harvest honey carefully",
        "Provide shade and ventilation",
        "Monitor water availability",
      ],
      weatherAlert: "High temperatures - risk of heat stress",
      icon: "☀️",
    },
    {
      month: "June",
      season: "Monsoon",
      floweringPlants: ["Jamun", "Neem", "Mango"],
      honeyFlow: "Low",
      bestPractices: [
        "Protect hives from rain",
        "Ensure proper drainage",
        "Reduce hive entrance",
      ],
      weatherAlert: "Heavy rains - check hive waterproofing",
      icon: "🌧️",
    },
    {
      month: "July",
      season: "Monsoon",
      floweringPlants: ["Teak", "Sal", "Bamboo"],
      honeyFlow: "Low",
      bestPractices: [
        "Maintain hive cleanliness",
        "Monitor for diseases",
        "Provide supplementary feed",
      ],
      weatherAlert: "Wet conditions - prevent fungal issues",
      icon: "🌧️",
    },
    {
      month: "August",
      season: "Monsoon",
      floweringPlants: ["Eucalyptus", "Acacia", "Neem"],
      honeyFlow: "Moderate",
      bestPractices: [
        "Begin autumn preparations",
        "Check food stores",
        "Plan winter feeding",
      ],
      weatherAlert: "Transition period - monitor weather changes",
      icon: "🌧️",
    },
    {
      month: "September",
      season: "Autumn",
      floweringPlants: ["Sunflower", "Mustard", "Eucalyptus"],
      honeyFlow: "Good",
      bestPractices: [
        "Prepare for winter",
        "Harvest surplus honey",
        "Treat for varroa mites",
      ],
      weatherAlert: "Cooling temperatures - prepare insulation",
      icon: "🍂",
    },
    {
      month: "October",
      season: "Autumn",
      floweringPlants: ["Mustard", "Sunflower", "Marigold"],
      honeyFlow: "Good",
      bestPractices: [
        "Final honey harvest",
        "Build up winter stores",
        "Reduce hive entrance",
      ],
      weatherAlert: "Decreasing temperatures - monitor hive",
      icon: "🍂",
    },
    {
      month: "November",
      season: "Winter",
      floweringPlants: ["Mustard", "Eucalyptus", "Neem"],
      honeyFlow: "Moderate",
      bestPractices: [
        "Ensure adequate food stores",
        "Reduce hive disturbance",
        "Plan spring expansion",
      ],
      weatherAlert: "Cold nights - provide insulation",
      icon: "❄️",
    },
    {
      month: "December",
      season: "Winter",
      floweringPlants: ["Eucalyptus", "Acacia", "Mustard"],
      honeyFlow: "Moderate",
      bestPractices: [
        "Minimal hive inspections",
        "Monitor food consumption",
        "Plan next year's strategy",
      ],
      weatherAlert: "Coldest month - ensure hive protection",
      icon: "❄️",
    },
  ];

  const data = seasonalData[currentMonth];

  return (
    <div className="bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 rounded-2xl shadow-xl p-8 border-2 border-green-300">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">🌿 Seasonal Insights</h2>

      {/* Month Selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {seasonalData.map((item, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentMonth(idx)}
            className={`px-3 py-2 rounded-full font-semibold transition-all ${
              currentMonth === idx
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white/60 text-green-700 hover:bg-white/80"
            }`}
          >
            {item.month.slice(0, 3)}
          </motion.button>
        ))}
      </div>

      {/* Current Month Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMonth}
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Header */}
          <motion.div
            className="flex items-center justify-between bg-gradient-to-r from-green-100 to-emerald-100 backdrop-blur rounded-2xl p-6 border-2 border-green-300 shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                {data.month}
              </h3>
              <p className="text-lg text-green-700 font-semibold mt-1">{data.season} Season</p>
            </div>
            <motion.span
              className="text-6xl"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {data.icon}
            </motion.span>
          </motion.div>

          {/* Honey Flow */}
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            className="bg-gradient-to-br from-yellow-50 to-amber-50 backdrop-blur rounded-2xl p-6 border-2 border-yellow-300 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-yellow-600" />
                  Honey Flow Status
                </p>
                <p className="text-3xl font-bold text-yellow-600">{data.honeyFlow}</p>
              </div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl"
              >
                🍯
              </motion.div>
            </div>
          </motion.div>

          {/* Flowering Plants */}
          <div>
            <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Flowering Plants
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.floweringPlants.map((plant, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.08, y: -4 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur rounded-xl p-4 text-center border-2 border-green-300 shadow-md hover:shadow-lg transition-all"
                >
                  <p className="font-bold text-green-700 text-lg">{plant}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <div>
            <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Best Practices
            </h4>
            <div className="space-y-3">
              {data.bestPractices.map((practice, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-4 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur rounded-xl p-4 border-l-4 border-green-500 shadow-md hover:shadow-lg transition-all"
                >
                  <motion.div
                    className="text-2xl flex-shrink-0 mt-1"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ delay: idx * 0.1, duration: 1.5, repeat: Infinity }}
                  >
                    ✓
                  </motion.div>
                  <p className="text-gray-800 font-medium">{practice}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Weather Alert */}
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            className="bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 backdrop-blur rounded-2xl p-6 border-2 border-orange-400 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              </motion.div>
              <div>
                <p className="text-sm font-bold text-orange-700 mb-1">Weather Alert</p>
                <p className="text-lg font-semibold text-orange-800">{data.weatherAlert}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SeasonalInsights;

