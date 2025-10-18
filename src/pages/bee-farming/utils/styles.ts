// Styling constants and utilities for Bee Farming Hub

// Enhanced color palette
export const colors = {
  // Primary yellows and golds
  primary: {
    light: "#FFF8DC",
    lighter: "#FFFACD",
    base: "#FDB813",
    dark: "#FFD700",
    darker: "#FFBF00",
  },
  // Secondary oranges and ambers
  secondary: {
    light: "#FFE4B5",
    base: "#FF8C00",
    dark: "#FFA500",
    darker: "#FF6B35",
  },
  // Accent colors
  accent: {
    green: "#90EE90",
    teal: "#98D8C8",
    purple: "#9B59B6",
    lavender: "#BB8FCE",
    blue: "#87CEEB",
  },
  // Neutral colors
  neutral: {
    white: "#FFFFFF",
    light: "#F8F9FA",
    lighter: "#F0F1F3",
    gray: "#6B7280",
    dark: "#1F2937",
    darker: "#111827",
  },
};

// Gradient definitions
export const gradients = {
  // Primary gradients
  yellowToAmber: "from-yellow-200 via-yellow-300 to-amber-400",
  orangeToAmber: "from-orange-200 via-orange-300 to-amber-400",
  greenToTeal: "from-green-200 via-emerald-300 to-teal-400",
  purpleToIndigo: "from-purple-200 via-purple-300 to-indigo-400",
  
  // Enhanced gradients
  honeyGold: "from-yellow-300 via-amber-300 to-orange-300",
  sunsetOrange: "from-orange-300 via-red-300 to-pink-300",
  forestGreen: "from-green-300 via-emerald-400 to-teal-500",
  royalPurple: "from-purple-400 via-indigo-500 to-blue-600",
  
  // Subtle gradients for backgrounds
  subtleYellow: "from-yellow-50 via-amber-50 to-orange-50",
  subtleGreen: "from-green-50 via-emerald-50 to-teal-50",
  subtlePurple: "from-purple-50 via-indigo-50 to-blue-50",
  
  // Dark gradients
  darkHoney: "from-yellow-900 via-amber-800 to-orange-800",
  darkForest: "from-green-900 via-emerald-800 to-teal-800",
};

// Shadow definitions
export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 4px 15px rgba(0, 0, 0, 0.1)",
  md: "0 8px 25px rgba(0, 0, 0, 0.15)",
  lg: "0 12px 30px rgba(0, 0, 0, 0.2)",
  xl: "0 16px 40px rgba(0, 0, 0, 0.25)",
  
  // Colored shadows
  yellowGlow: "0 8px 25px rgba(253, 184, 19, 0.3)",
  orangeGlow: "0 8px 25px rgba(255, 140, 0, 0.3)",
  greenGlow: "0 8px 25px rgba(144, 238, 144, 0.3)",
  purpleGlow: "0 8px 25px rgba(155, 89, 182, 0.3)",
  
  // Inset shadows
  inset: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
};

// Border radius
export const borderRadius = {
  sm: "0.375rem",
  base: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  full: "9999px",
};

// Backdrop blur values
export const backdrop = {
  sm: "blur(4px)",
  base: "blur(8px)",
  md: "blur(12px)",
  lg: "blur(16px)",
};

// Glassmorphism effect
export const glassmorphism = {
  base: "backdrop-blur-md bg-white/30 border border-white/20",
  light: "backdrop-blur-sm bg-white/20 border border-white/10",
  dark: "backdrop-blur-lg bg-black/30 border border-white/10",
};

// Card styles
export const cardStyles = {
  base: "rounded-2xl shadow-lg border border-white/20 backdrop-blur-md bg-white/80",
  hover: "hover:shadow-xl hover:border-white/40 transition-all duration-300",
  interactive: "cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300",
};

// Button styles
export const buttonStyles = {
  base: "font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
  primary: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:shadow-lg hover:scale-105",
  secondary: "bg-gradient-to-r from-orange-400 to-red-500 text-white hover:shadow-lg hover:scale-105",
  tertiary: "bg-gradient-to-r from-green-400 to-teal-500 text-white hover:shadow-lg hover:scale-105",
  quaternary: "bg-gradient-to-r from-purple-400 to-indigo-500 text-white hover:shadow-lg hover:scale-105",
  outline: "border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50",
};

// Typography
export const typography = {
  h1: "text-5xl md:text-6xl font-extrabold tracking-tight",
  h2: "text-4xl md:text-5xl font-bold tracking-tight",
  h3: "text-3xl md:text-4xl font-bold tracking-tight",
  h4: "text-2xl md:text-3xl font-bold",
  h5: "text-xl md:text-2xl font-semibold",
  h6: "text-lg md:text-xl font-semibold",
  body: "text-base leading-relaxed",
  small: "text-sm leading-relaxed",
  tiny: "text-xs leading-relaxed",
};

// Spacing
export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "2.5rem",
  "3xl": "3rem",
  "4xl": "4rem",
};

// Responsive breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Utility classes
export const utilityClasses = {
  // Glassmorphism
  glass: "backdrop-blur-md bg-white/30 border border-white/20",
  glassLight: "backdrop-blur-sm bg-white/20 border border-white/10",
  glassDark: "backdrop-blur-lg bg-black/30 border border-white/10",
  
  // Smooth transitions
  smoothTransition: "transition-all duration-300 ease-in-out",
  smoothFast: "transition-all duration-200 ease-in-out",
  smoothSlow: "transition-all duration-500 ease-in-out",
  
  // Focus states
  focusRing: "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",
  focusRingDark: "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-gray-900",
  
  // Hover effects
  hoverLift: "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
  hoverGlow: "hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300",
  hoverScale: "hover:scale-105 transition-transform duration-300",
  
  // Text effects
  gradientText: "bg-gradient-to-r bg-clip-text text-transparent",
  shimmer: "animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent",
};

// Animation timing
export const timing = {
  fast: "200ms",
  normal: "300ms",
  slow: "500ms",
  slower: "700ms",
};

// Easing functions
export const easing = {
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeInQuad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
  easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
};

