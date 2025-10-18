import React from "react";
import { motion } from "framer-motion";
import { FeatureItem } from "@/types/farming";
import { ArrowRight } from "lucide-react";

interface FeatureSectionProps {
  features: FeatureItem[];
  onFeatureClick?: (feature: FeatureItem) => void;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ features, onFeatureClick }) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {features.map((feature) => (
        <motion.div
          key={feature.id}
          variants={itemVariants}
          whileHover={{ y: -8 }}
          onClick={() => onFeatureClick?.(feature)}
          className="group relative cursor-pointer"
        >
          {/* Card Background */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
            style={{ background: feature.color, opacity: 0.1 }}
          />

          {/* Card Content */}
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 group-hover:border-slate-600 transition-all duration-300 h-full flex flex-col">
            {/* Icon Container */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${feature.color}30, ${feature.color}10)`,
              }}
            >
              <div className="text-2xl">{feature.icon}</div>
            </motion.div>

            {/* Title */}
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300"
              style={{
                backgroundImage: `linear-gradient(to right, white, ${feature.color})`,
              }}
            >
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-400 mb-4 flex-grow">
              {feature.description}
            </p>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              style={{
                background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                color: "#000",
              }}
            >
              {feature.cta}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeatureSection;

