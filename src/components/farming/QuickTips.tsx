import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuickTip } from "@/types/farming";
import { ChevronDown } from "lucide-react";

interface QuickTipsProps {
  tips: QuickTip[];
}

const QuickTips: React.FC<QuickTipsProps> = ({ tips }) => {
  const [expandedId, setExpandedId] = useState<string | null>(tips[0]?.id || null);

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
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="space-y-3"
    >
      {tips.map((tip) => (
        <motion.div
          key={tip.id}
          variants={itemVariants}
          className="overflow-hidden rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all"
        >
          {/* Header */}
          <motion.button
            onClick={() => setExpandedId(expandedId === tip.id ? null : tip.id)}
            className="w-full p-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 transition-all flex items-center gap-3 text-left"
          >
            {/* Icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex-shrink-0 text-2xl"
            >
              {tip.icon}
            </motion.div>

            {/* Title and Season */}
            <div className="flex-1">
              <p className="font-semibold text-white">{tip.title}</p>
              {tip.season && (
                <p className="text-xs text-gray-400 mt-1">Season: {tip.season}</p>
              )}
            </div>

            {/* Chevron */}
            <motion.div
              animate={{ rotate: expandedId === tip.id ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </motion.button>

          {/* Content */}
          <AnimatePresence>
            {expandedId === tip.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-slate-900/50 border-t border-slate-700/50">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {tip.content}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default QuickTips;

