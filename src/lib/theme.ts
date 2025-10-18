/**
 * Global Design System & Theme Configuration
 * Unified color palette, typography, and component styles for all farming hubs
 */

export const GLOBAL_COLORS = {
  // Neutral Core
  background: "#FFFFFF",
  surface: "#F7F7F7",
  textPrimary: "#1A1A1A",
  textSecondary: "#505050",
  accentNeutral: "#E0E0E0",

  // Status Colors
  success: "#2E8B57",
  error: "#D64545",
  warning: "#F59E0B",
  info: "#0B75D1",
};

export const HUB_THEMES = {
  dairy: {
    id: "dairy",
    name: "Dairy Lift",
    emoji: "🥛",
    primaryAccent: "#A4C8F0",
    primaryAccentDark: "#0D3B66",
    secondaryAccent: "#0D3B66",
    gradient: "from-blue-50 via-blue-100 to-blue-200",
    navGradient: "from-blue-600 to-blue-700",
    navGradientHover: "from-blue-700 to-blue-800",
    sidebarGradient: "from-blue-700 to-blue-900",
    accentGradient: "from-blue-400 to-blue-600",
    motif: "Clean, cool, reliable",
    buttonBg: "#A4C8F0",
    buttonText: "#0D3B66",
    headerBg: "#0D3B66",
    headerText: "#FFFFFF",
  },
  bee: {
    id: "bee",
    name: "Bee Farming Hub",
    emoji: "🐝",
    primaryAccent: "#F7C948",
    primaryAccentDark: "#E2A100",
    secondaryAccent: "#E2A100",
    gradient: "from-yellow-50 via-amber-50 to-orange-50",
    navGradient: "from-yellow-600 to-amber-700",
    navGradientHover: "from-yellow-700 to-amber-800",
    sidebarGradient: "from-yellow-700 to-amber-900",
    accentGradient: "from-yellow-400 to-amber-600",
    motif: "Natural, warm, optimistic",
    buttonBg: "#F7C948",
    buttonText: "#1A1A1A",
    headerBg: "#E2A100",
    headerText: "#FFFFFF",
  },
  marine: {
    id: "marine",
    name: "Marine Hub",
    emoji: "🌊",
    primaryAccent: "#0077B6",
    primaryAccentDark: "#005A8D",
    secondaryAccent: "#90E0EF",
    gradient: "from-cyan-50 via-blue-50 to-teal-50",
    navGradient: "from-blue-600 to-teal-700",
    navGradientHover: "from-blue-700 to-teal-800",
    sidebarGradient: "from-blue-800 to-teal-900",
    accentGradient: "from-blue-400 to-teal-600",
    motif: "Calm, aquatic, precise",
    buttonBg: "#0077B6",
    buttonText: "#FFFFFF",
    headerBg: "#005A8D",
    headerText: "#FFFFFF",
  },
  poultry: {
    id: "poultry",
    name: "Poultry Hub",
    emoji: "🐔",
    primaryAccent: "#E76F51",
    primaryAccentDark: "#D45A3A",
    secondaryAccent: "#FFF3E6",
    gradient: "from-orange-50 via-red-50 to-pink-50",
    navGradient: "from-orange-600 to-red-700",
    navGradientHover: "from-orange-700 to-red-800",
    sidebarGradient: "from-orange-700 to-red-900",
    accentGradient: "from-orange-400 to-red-600",
    motif: "Friendly, energetic",
    buttonBg: "#E76F51",
    buttonText: "#FFFFFF",
    headerBg: "#D45A3A",
    headerText: "#FFFFFF",
  },
  organic: {
    id: "organic",
    name: "Organic Hub",
    emoji: "🌱",
    primaryAccent: "#3E8914",
    primaryAccentDark: "#2D6A0F",
    secondaryAccent: "#E9E7DA",
    gradient: "from-green-50 via-emerald-50 to-teal-50",
    navGradient: "from-green-700 to-emerald-800",
    navGradientHover: "from-green-800 to-emerald-900",
    sidebarGradient: "from-green-800 to-emerald-900",
    accentGradient: "from-green-500 to-emerald-700",
    motif: "Natural, healthy, earthy",
    buttonBg: "#3E8914",
    buttonText: "#FFFFFF",
    headerBg: "#2D6A0F",
    headerText: "#FFFFFF",
  },
  crop: {
    id: "crop",
    name: "Crop Hub",
    emoji: "🌾",
    primaryAccent: "#E8C547",
    primaryAccentDark: "#D4A830",
    secondaryAccent: "#556B2F",
    gradient: "from-yellow-50 via-amber-50 to-yellow-100",
    navGradient: "from-yellow-700 to-amber-800",
    navGradientHover: "from-yellow-800 to-amber-900",
    sidebarGradient: "from-yellow-800 to-amber-900",
    accentGradient: "from-yellow-500 to-amber-700",
    motif: "Productive, rich, fertile",
    buttonBg: "#E8C547",
    buttonText: "#1A1A1A",
    headerBg: "#D4A830",
    headerText: "#FFFFFF",
  },
};

export const TYPOGRAPHY = {
  headings: {
    fontFamily: "Poppins, Inter, Nunito Sans",
    fontWeight: "600",
  },
  body: {
    fontFamily: "Roboto, Lato",
    fontWeight: "400",
  },
};

export const SPACING = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
};

export const SHADOWS = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
};

export const BREAKPOINTS = {
  mobile: "640px",
  tablet: "1024px",
  desktop: "1400px",
};

export const ANIMATION_DURATIONS = {
  fast: "150ms",
  normal: "250ms",
  slow: "350ms",
};

export type HubType = keyof typeof HUB_THEMES;

export interface HubTheme {
  id: string;
  name: string;
  emoji: string;
  primaryAccent: string;
  secondaryAccent: string;
  gradient: string;
  navGradient: string;
  sidebarGradient: string;
  accentGradient: string;
  motif: string;
}

export const getHubTheme = (hubId: HubType): HubTheme => HUB_THEMES[hubId];

