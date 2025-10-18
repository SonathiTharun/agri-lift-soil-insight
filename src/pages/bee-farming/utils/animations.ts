// Animation variants and utilities for Bee Farming Hub
import { Variants } from "framer-motion";

// Page transition variants
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

// Fade in variants
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6 } },
};

// Slide in from left
export const slideInLeftVariants: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

// Slide in from right
export const slideInRightVariants: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

// Slide in from top
export const slideInTopVariants: Variants = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Scale up variants
export const scaleUpVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// Stagger container for lists
export const staggerContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Stagger item
export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Hover scale effect
export const hoverScaleVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

// Button hover effect
export const buttonHoverVariants: Variants = {
  initial: { scale: 1, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)" },
  hover: {
    scale: 1.02,
    boxShadow: "0px 8px 25px rgba(253, 184, 19, 0.3)",
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.98 },
};

// Card hover effect
export const cardHoverVariants: Variants = {
  initial: { y: 0, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)" },
  hover: {
    y: -8,
    boxShadow: "0px 12px 30px rgba(253, 184, 19, 0.2)",
    transition: { duration: 0.3 },
  },
};

// Pulse animation
export const pulseVariants: Variants = {
  animate: {
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Floating animation
export const floatingVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Rotate animation
export const rotateVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Shimmer loading animation
export const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Number counter animation
export const counterVariants = (from: number, to: number, duration: number = 2) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
});

// Tab transition
export const tabVariants: Variants = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

// Modal backdrop
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Modal content
export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
};

// Ripple effect animation
export const rippleVariants: Variants = {
  initial: { scale: 0, opacity: 1 },
  animate: { scale: 4, opacity: 0, transition: { duration: 0.6 } },
};

// Parallax scroll effect
export const parallaxVariants = (offset: number): Variants => ({
  initial: { y: 0 },
  animate: { y: offset * 0.5, transition: { duration: 0.5 } },
});

// Gradient animation
export const gradientVariants: Variants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "ease-in-out",
    },
  },
};

// Bounce animation
export const bounceVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Swing animation
export const swingVariants: Variants = {
  animate: {
    rotate: [-2, 2, -2],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Transition settings
export const transitionSettings = {
  fast: { duration: 0.2, ease: "easeInOut" },
  normal: { duration: 0.3, ease: "easeInOut" },
  slow: { duration: 0.5, ease: "easeInOut" },
};

// Reduced motion support
export const getReducedMotionVariants = (variants: Variants): Variants => {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return {
      initial: variants.initial,
      animate: { ...variants.animate, transition: { duration: 0 } },
    };
  }
  return variants;
};

