import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HubCard from "./HubCard";

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
  badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  accentColor = "#3B82F6",
  onClick,
  badge,
}) => {
  return (
    <HubCard
      hover={true}
      onClick={onClick}
      className="flex flex-col h-full group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div
            className="p-3 rounded-xl group-hover:scale-110 transition-transform"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <div style={{ color: accentColor }}>{icon}</div>
          </div>
        )}
        {badge && (
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: accentColor }}
          >
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4 flex-grow">{description}</p>

      <motion.div
        className="flex items-center gap-2 text-sm font-semibold"
        style={{ color: accentColor }}
        whileHover={{ x: 4 }}
      >
        Learn More
        <ArrowRight size={16} />
      </motion.div>
    </HubCard>
  );
};

export default FeatureCard;

