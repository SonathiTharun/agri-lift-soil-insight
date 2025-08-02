import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  Heart,
  Eye,
  Share2,
  GitCompare,
  Calendar,
  DollarSign,
  Droplets,
  Zap
} from "lucide-react";
import { PropertyCardProps } from "./types";

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  index,
  viewMode,
  isFavorite,
  isInCompare,
  onViewDetails,
  onToggleFavorite,
  onShare,
  onAddToCompare
}) => {
  const handleViewDetails = useCallback(() => {
    onViewDetails(property);
  }, [onViewDetails, property]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(property.id);
  }, [onToggleFavorite, property.id]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(property);
  }, [onShare, property]);

  const handleAddToCompare = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCompare(property.id);
  }, [onAddToCompare, property.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group h-full"
    >
      <Card
        className={`h-full hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-[1.02] bg-white overflow-hidden ${
          property.isFeatured ? "ring-2 ring-amber-200 shadow-amber-100" : ""
        } ${isFavorite ? "ring-2 ring-red-200 shadow-red-100" : ""} ${
          viewMode === "list" ? "flex flex-row" : ""
        }`}
        role="article"
        aria-labelledby={`property-title-${property.id}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleViewDetails();
          }
        }}
      >
        {/* Image Section */}
        <div className={`relative overflow-hidden ${viewMode === "list" ? "w-80 flex-shrink-0" : ""}`}>
          <div className="relative group-hover:scale-110 transition-transform duration-500">
            <img
              src={property.image}
              alt={`${property.title} - ${property.type} in ${property.location}`}
              className={`object-cover ${
                viewMode === "list"
                  ? "w-full h-full"
                  : "w-full h-56"
              }`}
              loading="lazy"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg backdrop-blur-sm">
              {property.type}
            </Badge>
            {property.isFeatured && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg backdrop-blur-sm">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
          </div>

          {/* Action Buttons Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleFavorite}
              className={`rounded-full w-10 h-10 p-0 shadow-lg backdrop-blur-sm ${
                isFavorite 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-white/90 hover:bg-white text-gray-700"
              }`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddToCompare}
              className={`rounded-full w-10 h-10 p-0 shadow-lg backdrop-blur-sm ${
                isInCompare 
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                  : "bg-white/90 hover:bg-white text-gray-700"
              }`}
              aria-label={isInCompare ? "Remove from comparison" : "Add to comparison"}
            >
              <GitCompare className="h-4 w-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={handleShare}
              className="rounded-full w-10 h-10 p-0 shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white text-gray-700"
              aria-label="Share property"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-white/95 text-emerald-700 font-bold text-lg px-3 py-1 shadow-lg backdrop-blur-sm">
              {property.price}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className={`flex flex-col ${viewMode === "list" ? "flex-1" : ""}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle
                  id={`property-title-${property.id}`}
                  className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2"
                >
                  {property.title}
                </CardTitle>
                <div className="flex items-center text-gray-600 mt-2">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0 text-emerald-600" />
                  <span className="text-sm font-medium">{property.location}</span>
                </div>
              </div>
              <div className="flex items-center ml-4 bg-amber-50 px-2 py-1 rounded-lg">
                <Star className="h-4 w-4 text-amber-500 fill-current" />
                <span className="ml-1 text-sm font-bold text-amber-700">{property.rating}</span>
                <span className="text-xs text-amber-600 ml-1">({property.reviews})</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            {/* Property Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-2 text-emerald-600" />
                <span className="font-medium">{property.area}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                <span className="font-medium">{property.duration}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Droplets className="h-4 w-4 mr-2 text-blue-600" />
                <span className="font-medium">{property.waterSource}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Zap className="h-4 w-4 mr-2 text-yellow-600" />
                <span className="font-medium">{property.soilType}</span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {property.features.slice(0, 3).map((feature, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    {feature}
                  </Badge>
                ))}
                {property.features.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs text-gray-500 border-gray-300"
                  >
                    +{property.features.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              <Button
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                onClick={handleViewDetails}
                aria-label={`View details for ${property.title}`}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};
