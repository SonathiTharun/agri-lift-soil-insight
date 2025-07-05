import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageContext";
import {
  X,
  Percent,
  IndianRupee,
  Clock,
  Calendar,
  Users,
  FileText,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award
} from "lucide-react";

interface SubsidyScheme {
  id: string;
  name: string;
  nameKey: string;
  description: string;
  category: string;
  subsidyPercentage: number;
  maxAmount: number;
  minAmount: number;
  eligibility: string[];
  documents: string[];
  applicationDeadline: string;
  processingTime: string;
  governmentScheme: string;
  applicationFee: number;
  icon: React.ReactNode;
  status: string;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
}

interface SubsidyComparisonProps {
  schemes: any[];
  onRemove: (schemeId: string) => void;
  projectAmount?: number;
}

export function SubsidyComparison({ schemes, onRemove, projectAmount = 100000 }: SubsidyComparisonProps) {
  const { t } = useLanguage();
  const [selectedMetric, setSelectedMetric] = useState("subsidy");

  const calculateSubsidyAmount = (scheme: SubsidyScheme, amount: number) => {
    const subsidyAmount = Math.min((amount * scheme.subsidyPercentage) / 100, scheme.maxAmount);
    return Math.max(subsidyAmount, scheme.minAmount);
  };

  const getMetricValue = (scheme: SubsidyScheme, metric: string) => {
    switch (metric) {
      case "subsidy":
        return calculateSubsidyAmount(scheme, projectAmount);
      case "percentage":
        return scheme.subsidyPercentage;
      case "maxAmount":
        return scheme.maxAmount;
      case "processingDays":
        return parseInt(scheme.processingTime.split('-')[0]) || 0;
      default:
        return 0;
    }
  };

  const getBestScheme = (metric: string) => {
    if (schemes.length === 0) return null;
    return schemes.reduce((best, current) => {
      const bestValue = getMetricValue(best, metric);
      const currentValue = getMetricValue(current, metric);
      return metric === "processingDays" 
        ? (currentValue < bestValue ? current : best)
        : (currentValue > bestValue ? current : best);
    });
  };

  const bestScheme = getBestScheme(selectedMetric);

  if (schemes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <TrendingUp className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("no-subsidies-to-compare") || "No Subsidies to Compare"}
          </h3>
          <p className="text-gray-500">
            {t("add-subsidies-comparison") || "Add subsidies from the main list to start comparing"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comparison Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              {t("subsidy-comparison") || "Subsidy Comparison"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Compare by:</span>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="subsidy">Subsidy Amount</option>
                <option value="percentage">Subsidy Rate</option>
                <option value="maxAmount">Max Amount</option>
                <option value="processingDays">Processing Time</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {schemes.map((scheme, index) => {
              const subsidyAmount = calculateSubsidyAmount(scheme, projectAmount);
              const isBest = bestScheme?.id === scheme.id;
              
              return (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-4 border rounded-lg ${
                    isBest ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemove(scheme.id)}
                    className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Best Badge */}
                  {isBest && (
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                      <Award className="h-3 w-3 mr-1" />
                      Best
                    </Badge>
                  )}

                  {/* Scheme Header */}
                  <div className="mt-6 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 bg-gradient-to-r from-green-100 to-blue-100 rounded text-green-600">
                        {scheme.icon}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {scheme.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {t(scheme.nameKey) || scheme.name}
                    </h3>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Subsidy Rate:</span>
                      <span className="font-semibold text-green-600">{scheme.subsidyPercentage}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Your Subsidy:</span>
                      <span className="font-semibold text-blue-600">₹{subsidyAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Max Amount:</span>
                      <span className="font-semibold">₹{(scheme.maxAmount / 100000).toFixed(1)}L</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Processing:</span>
                      <span className="font-semibold text-purple-600">{scheme.processingTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Deadline:</span>
                      <span className="font-semibold text-orange-600 text-xs">{scheme.applicationDeadline}</span>
                    </div>

                    {scheme.applicationFee > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">App Fee:</span>
                        <span className="font-semibold text-red-600">₹{scheme.applicationFee}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("detailed-comparison") || "Detailed Comparison"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Feature</th>
                  {schemes.map(scheme => (
                    <th key={scheme.id} className="text-center py-2 font-medium min-w-[150px]">
                      {scheme.name.split(' ').slice(0, 2).join(' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 font-medium">Government Scheme</td>
                  {schemes.map(scheme => (
                    <td key={scheme.id} className="py-3 text-center">{scheme.governmentScheme}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium">Status</td>
                  {schemes.map(scheme => (
                    <td key={scheme.id} className="py-3 text-center">
                      <Badge variant={scheme.status === "Active" ? "default" : "secondary"}>
                        {scheme.status}
                      </Badge>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium">Eligibility Count</td>
                  {schemes.map(scheme => (
                    <td key={scheme.id} className="py-3 text-center">{scheme.eligibility.length} criteria</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium">Documents Required</td>
                  {schemes.map(scheme => (
                    <td key={scheme.id} className="py-3 text-center">{scheme.documents.length} docs</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium">Contact</td>
                  {schemes.map(scheme => (
                    <td key={scheme.id} className="py-3 text-center">
                      <div className="space-y-1">
                        <div className="text-xs text-blue-600">{scheme.contactInfo.phone}</div>
                        <div className="text-xs text-gray-500">{scheme.contactInfo.email}</div>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Export Comparison
        </Button>
        <Button>
          <CheckCircle className="h-4 w-4 mr-2" />
          Apply for Best Option
        </Button>
      </div>
    </div>
  );
}
