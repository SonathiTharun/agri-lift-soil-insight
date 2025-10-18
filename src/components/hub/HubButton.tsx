import React from "react";
import { motion } from "framer-motion";

interface HubButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  className?: string;
  accentColor?: string;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

const HubButton: React.FC<HubButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  disabled = false,
  className = "",
  accentColor = "#3B82F6",
  fullWidth = false,
  type = "button",
}) => {
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: `text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95`,
    secondary: `text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 opacity-80 hover:opacity-100`,
    ghost: `text-gray-700 font-semibold rounded-lg transition-all duration-300 hover:bg-gray-100 active:scale-95`,
    outline: `border-2 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95`,
  };

  const getBackgroundStyle = () => {
    if (variant === "primary") {
      return { backgroundColor: accentColor };
    } else if (variant === "secondary") {
      return { backgroundColor: `${accentColor}CC` };
    } else if (variant === "outline") {
      return { borderColor: accentColor, color: accentColor };
    }
    return {};
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={getBackgroundStyle()}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {icon && iconPosition === "left" && <span>{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </motion.button>
  );
};

export default HubButton;

