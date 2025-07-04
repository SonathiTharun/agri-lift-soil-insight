import React, { useEffect, useState } from "react";
import { CartSidebar } from "@/components/CartSidebar";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/use-toast";
import { 
    Heart, 
    Star, 
    MessageCircle, 
    Calculator, 
    FileText, 
    Users, 
    Calendar, 
    Bell, 
    TrendingUp, 
    Shield, 
    Search, 
    Filter, 
    SortAsc, 
    Eye, 
    Share2, 
    Download,
    MapPin,
    Phone,
    Mail,
    Clock,
    Zap,
    Award,
    BarChart3,
    Settings,
    Camera,
    Video,
    Bookmark,
    AlertTriangle,
    CheckCircle,
    XCircle,
    RefreshCw,
    DollarSign,
    Percent,
    Calendar as CalendarIcon,
    User,
    Building,
    Truck,
    Wrench,
    Package,
    CreditCard,
    PieChart,
    LineChart,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

// Enhanced Equipment Card Component
const EnhancedEquipmentCard = ({ equipment, onAddToCart, onBuyNow, onAddToWishlist, onAddToCompare, onViewDetails, onStartChat, onFinanceCalculator, isInWishlist, isInCompare }: any) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showQuickView, setShowQuickView] = useState(false);

    const renderRating = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
                <span className="text-sm text-gray-600 ml-1">({equipment.reviews || 0})</span>
            </div>
        );
    };

    return (
        <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            {/* Quick Action Buttons */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => onAddToWishlist(equipment._id)}
                >
                    <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => onAddToCompare(equipment)}
                    disabled={isInCompare}
                >
                    <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => setShowQuickView(true)}
                >
                    <Eye className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 rounded-full"
                >
                    <Share2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Status Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {equipment.condition === 'New' && (
                    <Badge className="bg-green-500">New</Badge>
                )}
                {equipment.isNegotiable && (
                    <Badge variant="outline" className="bg-blue-50">Negotiable</Badge>
                )}
                {equipment.bulkDiscountAvailable && (
                    <Badge variant="outline" className="bg-orange-50">Bulk Discount</Badge>
                )}
                {equipment.rentalAvailable && (
                    <Badge variant="outline" className="bg-purple-50">Rental Available</Badge>
                )}
            </div>

            {/* Image Gallery */}
            <div className="relative h-48 overflow-hidden">
                {equipment.images && equipment.images.length > 0 ? (
                    <>
                        <img 
                            src={equipment.images[currentImageIndex]} 
                            alt={equipment.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {equipment.images.length > 1 && (
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                {equipment.images.map((_: any, index: number) => (
                                    <button
                                        key={index}
                                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                )}
            </div>

            <CardContent className="p-4">
                {/* Equipment Info */}
                <div className="space-y-3">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                            {equipment.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building className="h-4 w-4" />
                            {equipment.brand}
                            <span>•</span>
                            <MapPin className="h-4 w-4" />
                            {equipment.location}
                        </div>
                    </div>

                    {/* Rating */}
                    {equipment.rating && renderRating(equipment.rating)}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-2xl font-bold text-green-600">
                                ₹{equipment.price.toLocaleString()}
                            </span>
                            {equipment.isNegotiable && (
                                <span className="text-sm text-gray-500 ml-2">Negotiable</span>
                            )}
                        </div>
                        {equipment.rentalAvailable && (
                            <div className="text-right">
                                <div className="text-sm text-gray-600">Rental</div>
                                <div className="text-sm font-semibold">₹{Math.round(equipment.price * 0.01)}/day</div>
                            </div>
                        )}
                    </div>

                    {/* Key Features */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-blue-500" />
                            <span>{equipment.capacity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-green-500" />
                            <span>{equipment.yearOfManufacture || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-purple-500" />
                            <span>{equipment.warranty || 'No warranty'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 text-gray-500" />
                            <span>{equipment.viewCount || 0} views</span>
                        </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 border-t pt-2">
                        <User className="h-4 w-4" />
                        <span>{equipment.seller}</span>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="ml-auto"
                            onClick={() => onStartChat(equipment)}
                        >
                            <MessageCircle className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
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

                    {/* Additional Actions */}
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onViewDetails(equipment)}
                            className="flex-1"
                        >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onFinanceCalculator(equipment)}
                            className="flex-1"
                        >
                            <Calculator className="h-4 w-4 mr-1" />
                            Finance
                        </Button>
                    </div>
                </div>
            </CardContent>

            {/* Quick View Modal */}
            <Dialog open={showQuickView} onOpenChange={setShowQuickView}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{equipment.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <img 
                                src={equipment.images?.[0]} 
                                alt={equipment.name}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold">Description</h4>
                                <p className="text-sm text-gray-600">{equipment.description}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Specifications</h4>
                                {equipment.specifications && (
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {Object.entries(equipment.specifications).map(([key, value]) => (
                                            <div key={key}>
                                                <span className="font-medium">{key}:</span> {value as string}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => onAddToCart(equipment)} className="flex-1">
                                    Add to Cart
                                </Button>
                                <Button onClick={() => onBuyNow(equipment)} variant="outline" className="flex-1">
                                    Buy Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export { EnhancedEquipmentCard };
