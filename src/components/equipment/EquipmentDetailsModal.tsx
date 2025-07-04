import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Shield, 
  Zap, 
  Building, 
  User, 
  Phone, 
  Mail, 
  Eye,
  Heart,
  Share2,
  Download,
  MessageCircle,
  Calculator,
  Package,
  CreditCard,
  Truck,
  Wrench,
  Award,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface EquipmentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  equipment: any;
  onAddToCart: (equipment: any) => void;
  onBuyNow: (equipment: any) => void;
  onAddToWishlist: (id: string) => void;
  onStartChat: (equipment: any) => void;
  onFinanceCalculator: (equipment: any) => void;
  isInWishlist: boolean;
}

export const EquipmentDetailsModal: React.FC<EquipmentDetailsModalProps> = ({
  open,
  onClose,
  equipment,
  onAddToCart,
  onBuyNow,
  onAddToWishlist,
  onStartChat,
  onFinanceCalculator,
  isInWishlist
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!equipment) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({equipment.reviews || 0} reviews)</span>
      </div>
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: equipment.name,
        text: equipment.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // toast({ title: "Link copied to clipboard" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{equipment.name}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onAddToWishlist(equipment._id)}>
                <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-80 rounded-lg overflow-hidden bg-gray-100">
              {equipment.images && equipment.images.length > 0 ? (
                <img 
                  src={equipment.images[currentImageIndex]} 
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
              
              {/* Image Navigation */}
              {equipment.images && equipment.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {equipment.images.map((_: any, index: number) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {equipment.images && equipment.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {equipment.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={image} alt={`${equipment.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Equipment Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{equipment.brand}</span>
                <span>•</span>
                <Badge variant={equipment.condition === 'New' ? 'default' : 'secondary'}>
                  {equipment.condition}
                </Badge>
              </div>
              
              {equipment.rating && (
                <div className="mb-3">
                  {renderRating(equipment.rating)}
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="h-4 w-4" />
                <span>{equipment.location}</span>
                <span>•</span>
                <Eye className="h-4 w-4" />
                <span>{equipment.viewCount || 0} views</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-b py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(equipment.price)}
                  </div>
                  {equipment.isNegotiable && (
                    <div className="text-sm text-gray-500">Price negotiable</div>
                  )}
                </div>
                {equipment.rentalAvailable && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Also available for rent</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {formatCurrency(Math.round(equipment.price * 0.01))}/day
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-600">Capacity</div>
                  <div className="font-semibold">{equipment.capacity}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-sm text-gray-600">Year</div>
                  <div className="font-semibold">{equipment.yearOfManufacture || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="text-sm text-gray-600">Warranty</div>
                  <div className="font-semibold">{equipment.warranty || 'No warranty'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="text-sm text-gray-600">Hours Used</div>
                  <div className="font-semibold">{equipment.hoursUsed || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <h4 className="font-semibold">Included Services</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  {equipment.deliveryAvailable ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  {equipment.installationIncluded ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">Installation</span>
                </div>
                <div className="flex items-center gap-2">
                  {equipment.trainingIncluded ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">Training</span>
                </div>
                <div className="flex items-center gap-2">
                  {equipment.bulkDiscountAvailable ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">Bulk Discount</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={() => onAddToCart(equipment)}
                  className="flex-1"
                  variant="outline"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={() => onBuyNow(equipment)}
                  className="flex-1"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStartChat(equipment)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFinanceCalculator(equipment)}
                >
                  <Calculator className="h-4 w-4 mr-1" />
                  Finance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Brochure
                </Button>
              </div>
            </div>

            {/* Seller Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-semibold">{equipment.seller}</div>
                  <div className="text-sm text-gray-600">{equipment.contactInfo}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="description" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="warranty">Warranty</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-700 leading-relaxed">
                  {equipment.description}
                </p>
                {equipment.conditionReport && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Condition Report</h4>
                    <p className="text-sm text-gray-700">{equipment.conditionReport}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                {equipment.specifications ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(equipment.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium">{key}:</span>
                        <span className="text-gray-700">{value as string}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No specifications available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  Reviews feature coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="warranty" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Warranty Period</h4>
                    <p className="text-gray-700">{equipment.warranty || 'No warranty provided'}</p>
                  </div>
                  {equipment.certifications && equipment.certifications.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Certifications</h4>
                      <div className="flex gap-2 flex-wrap">
                        {equipment.certifications.map((cert: string, index: number) => (
                          <Badge key={index} variant="outline">
                            <Award className="h-3 w-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
