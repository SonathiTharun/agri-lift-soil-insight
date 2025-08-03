import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Grid3X3,
  List,
  Filter
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { SearchFiltersProps, SortOption } from "./types";

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onShowFilters,
  activeFiltersCount
}) => {
  const { t } = useLanguage();
  const categories = ["All", "Agricultural Land", "Farmhouse", "Greenhouse", "Orchard", "Livestock Farm"];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: t('newest-first') },
    { value: "price-low", label: t('price-low-high') },
    { value: "price-high", label: t('price-high-low') },
    { value: "area-low", label: t('area-small-large') },
    { value: "area-high", label: t('area-large-small') },
    { value: "rating", label: t('highest-rated') }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
    >
      {/* Main Search and Controls Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full lg:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder={t('search-location-property-features')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-3 border-gray-200 focus:border-emerald-400 rounded-xl"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full lg:w-auto">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full lg:w-48 border-gray-200 rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Dropdown */}
        <div className="w-full lg:w-auto">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full lg:w-48 border-gray-200 rounded-xl">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Button */}
        <Button
          variant="outline"
          onClick={onShowFilters}
          className="relative border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl px-4 py-3"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className={`rounded-lg px-3 py-2 ${
              viewMode === "grid" 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" 
                : "hover:bg-gray-200 text-gray-600"
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className={`rounded-lg px-3 py-2 ${
              viewMode === "list" 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" 
                : "hover:bg-gray-200 text-gray-600"
            }`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-gray-100"
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span className="font-medium">{activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-1 h-auto"
            >
              Clear all
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
