import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Tractor, Sprout, MapPin, Phone, Mail } from "lucide-react";
import { HeroSectionProps } from "./types";

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBrowseProperties,
  onContactSupport,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-300 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-green-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-teal-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-1/3 w-16 h-16 bg-emerald-400 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Hero Icons */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="bg-emerald-100 p-3 rounded-full"
            >
              <Tractor className="h-8 w-8 text-emerald-600" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="bg-green-100 p-3 rounded-full"
            >
              <Sprout className="h-8 w-8 text-green-600" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="bg-teal-100 p-3 rounded-full"
            >
              <MapPin className="h-8 w-8 text-teal-600" />
            </motion.div>
          </div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 bg-clip-text text-transparent mb-6"
          >
            Agricultural
            <br />
            <span className="text-4xl md:text-6xl">Lease Marketplace</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Connect with landowners and farmers to find the perfect agricultural property for lease. 
            <span className="text-emerald-600 font-semibold"> Grow your dreams on fertile ground.</span>
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Category Selector */}
              <div className="w-full md:w-64">
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger className="h-14 text-lg border-2 border-emerald-200 focus:border-emerald-400 rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="Select Category" />
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

              {/* Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search by location, property type, or features..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-12 pr-32 py-4 text-lg border-2 border-emerald-200 focus:border-emerald-400 rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm h-14"
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2 rounded-xl shadow-md"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                onClick={onBrowseProperties}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-md"
              >
                <Tractor className="h-5 w-5 mr-2" />
                Browse Properties
              </Button>
              <Button
                onClick={onContactSupport}
                variant="outline"
                size="lg"
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-xl shadow-md"
              >
                <Phone className="h-5 w-5 mr-2" />
                Contact Support
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Properties Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Happy Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Acres Leased</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
