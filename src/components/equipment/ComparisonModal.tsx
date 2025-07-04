import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Star, MapPin, Calendar, Shield, Zap, Building, User, CheckCircle, XCircle } from 'lucide-react';

interface ComparisonModalProps {
  open: boolean;
  onClose: () => void;
  compareList: any[];
  onRemoveFromCompare: (id: string) => void;
  onAddToCart: (equipment: any) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  open,
  onClose,
  compareList,
  onRemoveFromCompare,
  onAddToCart
}) => {
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
      </div>
    );
  };

  const getComparisonRows = () => {
    if (compareList.length === 0) return [];

    const rows = [
      { label: 'Image', key: 'image', type: 'image' },
      { label: 'Name', key: 'name', type: 'text' },
      { label: 'Price', key: 'price', type: 'currency' },
      { label: 'Brand', key: 'brand', type: 'text' },
      { label: 'Condition', key: 'condition', type: 'badge' },
      { label: 'Location', key: 'location', type: 'text' },
      { label: 'Capacity', key: 'capacity', type: 'text' },
      { label: 'Year', key: 'yearOfManufacture', type: 'text' },
      { label: 'Warranty', key: 'warranty', type: 'text' },
      { label: 'Rating', key: 'rating', type: 'rating' },
      { label: 'Reviews', key: 'reviews', type: 'number' },
      { label: 'Negotiable', key: 'isNegotiable', type: 'boolean' },
      { label: 'Bulk Discount', key: 'bulkDiscountAvailable', type: 'boolean' },
      { label: 'Rental Available', key: 'rentalAvailable', type: 'boolean' },
      { label: 'Delivery', key: 'deliveryAvailable', type: 'boolean' },
      { label: 'Installation', key: 'installationIncluded', type: 'boolean' },
      { label: 'Training', key: 'trainingIncluded', type: 'boolean' },
      { label: 'Seller', key: 'seller', type: 'text' },
    ];

    return rows;
  };

  const renderCellContent = (equipment: any, row: any) => {
    const value = equipment[row.key];

    switch (row.type) {
      case 'image':
        return (
          <div className="w-20 h-20 rounded-lg overflow-hidden">
            <img 
              src={equipment.images?.[0] || '/placeholder.jpg'} 
              alt={equipment.name}
              className="w-full h-full object-cover"
            />
          </div>
        );
      case 'currency':
        return <span className="font-bold text-green-600">{formatCurrency(value || 0)}</span>;
      case 'badge':
        return <Badge variant={value === 'New' ? 'default' : 'secondary'}>{value}</Badge>;
      case 'rating':
        return value ? renderRating(value) : <span className="text-gray-400">No rating</span>;
      case 'boolean':
        return value ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        );
      case 'number':
        return <span>{value || 0}</span>;
      default:
        return <span>{value || 'N/A'}</span>;
    }
  };

  const getBestValue = (row: any) => {
    if (compareList.length === 0) return null;

    switch (row.key) {
      case 'price':
        return Math.min(...compareList.map(eq => eq.price || Infinity));
      case 'rating':
        return Math.max(...compareList.map(eq => eq.rating || 0));
      case 'reviews':
        return Math.max(...compareList.map(eq => eq.reviews || 0));
      default:
        return null;
    }
  };

  const isBestValue = (equipment: any, row: any) => {
    const bestValue = getBestValue(row);
    if (bestValue === null) return false;
    
    const value = equipment[row.key];
    return value === bestValue;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Equipment Comparison ({compareList.length}/3)</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {compareList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No equipment selected for comparison</div>
            <Button onClick={onClose}>Browse Equipment</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Equipment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compareList.map((equipment) => (
                <Card key={equipment._id} className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => onRemoveFromCompare(equipment._id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardHeader className="pb-3">
                    <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                      <img 
                        src={equipment.images?.[0] || '/placeholder.jpg'} 
                        alt={equipment.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg">{equipment.name}</CardTitle>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(equipment.price)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      onClick={() => onAddToCart(equipment)}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Feature</th>
                        {compareList.map((equipment) => (
                          <th key={equipment._id} className="text-center p-3 font-semibold min-w-[200px]">
                            {equipment.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {getComparisonRows().map((row) => (
                        <tr key={row.key} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium text-gray-700">{row.label}</td>
                          {compareList.map((equipment) => (
                            <td 
                              key={equipment._id} 
                              className={`p-3 text-center ${
                                isBestValue(equipment, row) ? 'bg-green-50 border-l-4 border-green-500' : ''
                              }`}
                            >
                              {renderCellContent(equipment, row)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Specifications Comparison */}
            {compareList.some(eq => eq.specifications) && (
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Specification</th>
                          {compareList.map((equipment) => (
                            <th key={equipment._id} className="text-center p-3 font-semibold">
                              {equipment.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {/* Get all unique specification keys */}
                        {Array.from(new Set(
                          compareList.flatMap(eq => 
                            eq.specifications ? Object.keys(eq.specifications) : []
                          )
                        )).map((specKey) => (
                          <tr key={specKey} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-700">{specKey}</td>
                            {compareList.map((equipment) => (
                              <td key={equipment._id} className="p-3 text-center">
                                {equipment.specifications?.[specKey] || 'N/A'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => compareList.forEach(eq => onRemoveFromCompare(eq._id))}
              >
                Clear All
              </Button>
              <Button onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
