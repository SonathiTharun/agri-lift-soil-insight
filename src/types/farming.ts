/**
 * Farming Types and Interfaces
 * Shared types for all farming pages (Marine, Poultry, Organic, Crop)
 */

export interface MetricData {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
  color: string;
  trend?: number;
  description?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  cta: string;
  link?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  image: string;
  role?: string;
  rating?: number;
}

export interface FarmingPageConfig {
  title: string;
  subtitle: string;
  heroIcon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundGradient: string;
  metrics: MetricData[];
  features: FeatureItem[];
  testimonials: Testimonial[];
}

export interface ListingItem {
  id: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export interface QuickTip {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  season?: string;
}

export interface MarketTrend {
  date: string;
  price: number;
  volume: number;
}

export interface ActivityFeedItem {
  id: string;
  type: 'listing' | 'transaction' | 'review' | 'milestone';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

