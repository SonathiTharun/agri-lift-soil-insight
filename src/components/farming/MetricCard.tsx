import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MetricData } from "@/types/farming";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  metric: MetricData;
  index: number;
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, index, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numValue = typeof metric.value === "string" 
      ? parseInt(metric.value.replace(/[^0-9]/g, "")) 
      : metric.value;
    
    let start = 0;
    const end = numValue;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [metric.value]);

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { delay: delay + index * 0.1, duration: 0.5 }
    },
  };

  const hoverVariants = {
    hover: {
      y: -8,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={hoverVariants}
      className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border border-white/10 transition-all duration-300 group`}
      style={{
        background: `linear-gradient(135deg, ${metric.color}15 0%, ${metric.color}05 100%)`,
        borderColor: `${metric.color}30`,
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${metric.color}20 0%, ${metric.color}10 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon and Label */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl"
            >
              {metric.icon}
            </motion.div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              {metric.label}
            </h3>
          </div>
          {metric.trend !== undefined && (
            <div className={`flex items-center gap-1 ${metric.trend >= 0 ? "text-green-400" : "text-red-400"}`}>
              {metric.trend >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-xs font-bold">{Math.abs(metric.trend)}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <motion.div
            className="text-4xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {displayValue}
            {metric.unit && <span className="text-lg ml-1">{metric.unit}</span>}
          </motion.div>
        </div>

        {/* Description */}
        {metric.description && (
          <p className="text-xs text-gray-400">{metric.description}</p>
        )}

        {/* Progress bar */}
        <motion.div
          className="mt-4 h-1 rounded-full overflow-hidden bg-white/10"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: metric.color }}
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ delay: 0.7, duration: 1.5 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MetricCard;

