import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import HubCard from "./HubCard";

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  icon?: React.ReactNode;
  accentColor?: string;
  animated?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = "",
  trend = "neutral",
  trendValue = 0,
  icon,
  accentColor = "#3B82F6",
  animated = true,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!animated || typeof value !== "number") return;

    let current = 0;
    const target = value;
    const increment = target / 30;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayValue(target);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [value, animated]);

  const trendIcon =
    trend === "up" ? (
      <TrendingUp size={16} className="text-green-500" />
    ) : trend === "down" ? (
      <TrendingDown size={16} className="text-red-500" />
    ) : null;

  return (
    <HubCard variant="elevated">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-3xl font-bold"
              style={{ color: accentColor }}
            >
              {animated && typeof value === "number"
                ? displayValue
                : value}
            </motion.span>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
        </div>
        {icon && (
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            {icon}
          </div>
        )}
      </div>

      {trend !== "neutral" && (
        <div className="flex items-center gap-1 text-xs">
          {trendIcon}
          <span
            className={trend === "up" ? "text-green-600" : "text-red-600"}
          >
            {trend === "up" ? "+" : "-"}
            {trendValue}%
          </span>
        </div>
      )}
    </HubCard>
  );
};

export default MetricCard;

