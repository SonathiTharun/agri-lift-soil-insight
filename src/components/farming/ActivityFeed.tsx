import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ActivityFeedItem } from "@/types/farming";

interface ActivityFeedProps {
  items: ActivityFeedItem[];
  maxItems?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ items, maxItems = 5 }) => {
  const [displayItems, setDisplayItems] = useState(items.slice(0, maxItems));

  useEffect(() => {
    // Simulate real-time updates
    const timer = setInterval(() => {
      setDisplayItems((prev) => {
        const newItems = [...prev.slice(1), items[Math.floor(Math.random() * items.length)]];
        return newItems;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [items]);

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
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.3 },
    },
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "listing":
        return "from-blue-500 to-blue-600";
      case "transaction":
        return "from-green-500 to-green-600";
      case "review":
        return "from-yellow-500 to-yellow-600";
      case "milestone":
        return "from-purple-500 to-purple-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="space-y-3"
    >
      {displayItems.map((item, idx) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 hover:border-slate-600 transition-all group cursor-pointer"
        >
          {/* Icon */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
            className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${getTypeColor(item.type)} flex items-center justify-center text-white shadow-lg`}
          >
            {item.icon}
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors truncate">
              {item.title}
            </p>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {item.description}
            </p>
            <p className="text-xs text-gray-500 mt-2">{item.timestamp}</p>
          </div>

          {/* Indicator */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
            className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400 mt-1"
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ActivityFeed;

