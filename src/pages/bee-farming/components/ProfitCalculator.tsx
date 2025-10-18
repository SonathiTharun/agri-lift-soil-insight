import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, DollarSign } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

interface CalculatorState {
  colonies: number;
  honeyPerColony: number;
  honeyPrice: number;
  operatingCost: number;
  beeswaxProduction: number;
  beeswaxPrice: number;
}

const ProfitCalculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    colonies: 10,
    honeyPerColony: 30,
    honeyPrice: 450,
    operatingCost: 5000,
    beeswaxProduction: 2,
    beeswaxPrice: 380,
  });

  const calculations = useMemo(() => {
    const honeyRevenue = state.colonies * state.honeyPerColony * state.honeyPrice;
    const beeswaxRevenue = state.colonies * state.beeswaxProduction * state.beeswaxPrice;
    const totalRevenue = honeyRevenue + beeswaxRevenue;
    const totalCost = state.operatingCost * state.colonies;
    const netProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

    return {
      honeyRevenue,
      beeswaxRevenue,
      totalRevenue,
      totalCost,
      netProfit,
      profitMargin,
    };
  }, [state]);

  const handleChange = (field: keyof CalculatorState, value: number) => {
    setState((prev) => ({
      ...prev,
      [field]: Math.max(0, value),
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-100 rounded-2xl shadow-xl p-8 border-2 border-purple-200">
      <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">💰 Profit Calculator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-bold text-purple-700 mb-4">📋 Your Farm Details</h3>

          {/* Colonies */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Colonies: <span className="text-purple-600">{state.colonies}</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={state.colonies}
              onChange={(e) => handleChange("colonies", parseInt(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">Adjust the number of bee colonies</p>
          </div>

          {/* Honey per Colony */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Honey per Colony (kg/year): <span className="text-purple-600">{state.honeyPerColony}</span>
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={state.honeyPerColony}
              onChange={(e) => handleChange("honeyPerColony", parseInt(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">Average honey production per colony</p>
          </div>

          {/* Honey Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Honey Price (₹/kg): <span className="text-purple-600">₹{state.honeyPrice}</span>
            </label>
            <input
              type="range"
              min="200"
              max="800"
              value={state.honeyPrice}
              onChange={(e) => handleChange("honeyPrice", parseInt(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Operating Cost */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Operating Cost per Colony (₹/year): <span className="text-purple-600">₹{state.operatingCost}</span>
            </label>
            <input
              type="range"
              min="1000"
              max="20000"
              step="500"
              value={state.operatingCost}
              onChange={(e) => handleChange("operatingCost", parseInt(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Beeswax Production */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Beeswax per Colony (kg/year): <span className="text-purple-600">{state.beeswaxProduction}</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={state.beeswaxProduction}
              onChange={(e) => handleChange("beeswaxProduction", parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Beeswax Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Beeswax Price (₹/kg): <span className="text-purple-600">₹{state.beeswaxPrice}</span>
            </label>
            <input
              type="range"
              min="200"
              max="600"
              value={state.beeswaxPrice}
              onChange={(e) => handleChange("beeswaxPrice", parseInt(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Annual Projections
            </h3>
          </div>

          {/* Honey Revenue */}
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            className="bg-gradient-to-br from-yellow-50 to-amber-50 backdrop-blur rounded-xl p-5 border-2 border-yellow-200 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Honey Revenue</p>
                <p className="text-3xl font-bold text-yellow-600">
                  <AnimatedCounter
                    to={calculations.honeyRevenue}
                    duration={1.5}
                    prefix="₹"
                    format={(val) => Math.round(val).toLocaleString("en-IN")}
                  />
                </p>
              </div>
              <div className="p-3 bg-yellow-200/50 rounded-full">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          {/* Beeswax Revenue */}
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur rounded-xl p-5 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Beeswax Revenue</p>
                <p className="text-3xl font-bold text-amber-600">
                  <AnimatedCounter
                    to={calculations.beeswaxRevenue}
                    duration={1.5}
                    prefix="₹"
                    format={(val) => Math.round(val).toLocaleString("en-IN")}
                  />
                </p>
              </div>
              <div className="p-3 bg-amber-200/50 rounded-full">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </motion.div>

          {/* Total Revenue */}
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur rounded-xl p-5 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-600">
                  <AnimatedCounter
                    to={calculations.totalRevenue}
                    duration={1.5}
                    prefix="₹"
                    format={(val) => Math.round(val).toLocaleString("en-IN")}
                  />
                </p>
              </div>
              <div className="p-3 bg-blue-200/50 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          {/* Total Cost */}
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            className="bg-gradient-to-br from-red-50 to-pink-50 backdrop-blur rounded-xl p-5 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Operating Cost</p>
                <p className="text-3xl font-bold text-red-600">
                  <AnimatedCounter
                    to={calculations.totalCost}
                    duration={1.5}
                    prefix="₹"
                    format={(val) => Math.round(val).toLocaleString("en-IN")}
                  />
                </p>
              </div>
              <div className="p-3 bg-red-200/50 rounded-full">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </motion.div>

          {/* Net Profit - Highlighted */}
          <motion.div
            whileHover={{ scale: 1.08, y: -6 }}
            className="bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 backdrop-blur rounded-xl p-6 border-2 border-green-400 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Net Annual Profit</p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  <AnimatedCounter
                    to={calculations.netProfit}
                    duration={1.5}
                    prefix="₹"
                    format={(val) => Math.round(val).toLocaleString("en-IN")}
                  />
                </p>
                <p className="text-sm font-bold text-green-700 mt-2">
                  Profit Margin: <span className="text-lg">{calculations.profitMargin}%</span>
                </p>
              </div>
              <motion.div
                className="p-4 bg-green-200/50 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className="w-8 h-8 text-green-600" />
              </motion.div>
            </div>
          </motion.div>

          {/* Per Colony Profit */}
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            className="bg-gradient-to-br from-purple-50 to-indigo-50 backdrop-blur rounded-xl p-5 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Profit per Colony</p>
                <p className="text-3xl font-bold text-purple-600">
                  <AnimatedCounter
                    to={state.colonies > 0 ? calculations.netProfit / state.colonies : 0}
                    duration={1.5}
                    prefix="₹"
                    format={(val) => Math.round(val).toLocaleString("en-IN")}
                  />
                </p>
              </div>
              <div className="p-3 bg-purple-200/50 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 bg-white/50 backdrop-blur rounded-lg p-4 border border-purple-200"
      >
        <p className="text-sm text-gray-700">
          💡 <strong>Tip:</strong> Adjust the sliders to see how different factors affect your profitability. Consider seasonal variations and market fluctuations when planning your farm expansion.
        </p>
      </motion.div>
    </div>
  );
};

export default ProfitCalculator;

