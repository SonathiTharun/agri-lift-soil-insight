// TypeScript interfaces and types for Lease components

export type PropertyType = "Agricultural Land" | "Farmhouse" | "Greenhouse" | "Orchard" | "Livestock Farm";
export type TabType = "available" | "favorites" | "my-leases" | "list-property";
export type SortOption = "newest" | "price-low" | "price-high" | "area-low" | "area-high" | "rating";
export type ViewMode = "grid" | "list";

export interface LeaseProperty {
  id: number;
  title: string;
  location: string;
  price: string;
  priceNumeric: number;
  duration: string;
  type: PropertyType;
  area: string;
  areaNumeric: number;
  soilType: string;
  waterSource: string;
  rating: number;
  reviews: number;
  features: string[];
  image: string;
  available: boolean;
  description?: string;
  ownerContact?: {
    name: string;
    phone: string;
    email: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  dateAdded: string;
  isFeatured?: boolean;
}

export interface FilterState {
  priceRange: [number, number];
  areaRange: [number, number];
  propertyTypes: PropertyType[];
  features: string[];
  location: string;
  soilTypes: string[];
  waterSources: string[];
  minRating: number;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: number;
}

export interface PropertyCardProps {
  property: LeaseProperty;
  index: number;
  viewMode: ViewMode;
  isFavorite: boolean;
  isInCompare: boolean;
  onViewDetails: (property: LeaseProperty) => void;
  onToggleFavorite: (propertyId: number) => void;
  onShare: (property: LeaseProperty) => void;
  onAddToCompare: (propertyId: number) => void;
}

export interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onShowFilters: () => void;
  activeFiltersCount: number;
}

export interface HeroSectionProps {
  onBrowseProperties: () => void;
  onContactSupport: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
