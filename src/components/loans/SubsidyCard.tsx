import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/LanguageContext";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  ChevronDown,
  ChevronUp,
  Users,
  FileText,
  IndianRupee,
  Percent,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface SubsidyScheme {
  id: string;
  name: string;
  nameKey: string;
  description: string;
  descriptionKey: string;
  category: "Equipment" | "Land Development" | "Crop Insurance" | "Working Capital" | "Infrastructure" | "Technology";
  subsidyPercentage: number;
  maxAmount: number;
  minAmount: number;
  eligibility: string[];
  eligibilityKeys: string[];
  documents: string[];
  documentKeys: string[];
  applicationDeadline: string;
  processingTime: string;
  governmentScheme: string;
  targetBeneficiaries: string[];
  applicationFee: number;
  icon: React.ReactNode;
  status: "Active" | "Upcoming" | "Expired";
  location: string[];
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
}

interface SubsidyCardProps {
  scheme: SubsidyScheme;
  onAddToComparison: (scheme: SubsidyScheme) => void;
  onViewDetails: (scheme: SubsidyScheme) => void;
  isInComparison: boolean;
  calculatedAmount?: number;
}

export function SubsidyCard({ 
  scheme, 
  onAddToComparison, 
  onViewDetails, 
  isInComparison,
  calculatedAmount 
}: SubsidyCardProps) {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Upcoming": return "bg-blue-100 text-blue-800";
      case "Expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Equipment": "bg-purple-100 text-purple-800",
      "Land Development": "bg-green-100 text-green-800",
      "Crop Insurance": "bg-blue-100 text-blue-800",
      "Working Capital": "bg-orange-100 text-orange-800",
      "Infrastructure": "bg-indigo-100 text-indigo-800",
      "Technology": "bg-pink-100 text-pink-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg text-green-600">
                {scheme.icon}
              </div>
              <div>
                <Badge className={`${getStatusColor(scheme.status)} mb-1`}>
                  {scheme.status}
                </Badge>
              </div>
            </div>
            <Badge variant="outline" className={getCategoryColor(scheme.category)}>
              {scheme.category}
            </Badge>
          </div>

          <CardTitle className="text-lg line-clamp-2">
            {t(scheme.nameKey) || scheme.name}
          </CardTitle>
          
          <p className="text-gray-600 text-sm line-clamp-3">
            {t(scheme.descriptionKey) || scheme.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Percent className="h-4 w-4 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{scheme.subsidyPercentage}%</span>
              </div>
              <span className="text-xs text-gray-600">Subsidy Rate</span>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <IndianRupee className="h-4 w-4 text-blue-600" />
                <span className="text-lg font-bold text-blue-600">
                  {(scheme.maxAmount / 100000).toFixed(1)}L
                </span>
              </div>
              <span className="text-xs text-gray-600">Max Amount</span>
            </div>
          </div>

          {/* Processing Time & Deadline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Processing:
              </span>
              <span className="font-medium text-blue-600">{scheme.processingTime}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Deadline:
              </span>
              <span className="font-medium text-orange-600">{scheme.applicationDeadline}</span>
            </div>
          </div>

          {/* Calculated Amount */}
          {calculatedAmount && (
            <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Your Potential Subsidy:</span>
                <span className="text-lg font-bold text-green-600">₹{calculatedAmount.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Expandable Details */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full justify-between p-2"
            >
              <span>{showDetails ? "Less Details" : "More Details"}</span>
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3 border-t">
                    {/* Eligibility */}
                    <div>
                      <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Eligibility:
                      </h5>
                      <div className="space-y-1">
                        {scheme.eligibility.slice(0, 3).map((req, idx) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {req}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Required Documents */}
                    <div>
                      <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Required Documents:
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {scheme.documents.slice(0, 4).map((doc, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h5 className="font-medium text-sm mb-2">Contact:</h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Phone className="h-3 w-3" />
                          {scheme.contactInfo.phone}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Mail className="h-3 w-3" />
                          {scheme.contactInfo.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onViewDetails(scheme)}
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onAddToComparison(scheme)}
              disabled={isInComparison}
              className={isInComparison ? "opacity-50" : ""}
            >
              {isInComparison ? "Added" : "Compare"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
