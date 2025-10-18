import React from "react";
import { motion } from "framer-motion";

interface HubCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: "default" | "elevated" | "outlined";
}

const HubCard: React.FC<HubCardProps> = ({
  children,
  className = "",
  hover = true,
  onClick,
  variant = "default",
}) => {
  const baseClasses =
    "rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm";

  const variantClasses = {
    default: "bg-white/80 shadow-md",
    elevated: "bg-white/90 shadow-lg",
    outlined: "bg-white/50 border-2 border-white/30",
  };

  const hoverClasses = hover
    ? "hover:shadow-xl hover:bg-white/95 hover:scale-105"
    : "";

  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default HubCard;

