import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/components/LanguageContext";
import {
  Calculator,
  IndianRupee,
  Percent,
  TrendingUp,
  PieChart,
  Download,
  Share2,
  Info
} from "lucide-react";

interface SubsidyScheme {
  id: string;
  name: string;
  nameKey: string;
  category: string;
  subsidyPercentage: number;
  maxAmount: number;
  minAmount: number;
  applicationFee: number;
  icon: React.ReactNode;
}

interface SubsidyCalculatorProps {
  schemes: any[];
  projectAmount: number;
  setProjectAmount: (amount: number) => void;
}

export function SubsidyCalculator({ schemes, projectAmount, setProjectAmount }: SubsidyCalculatorProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showComparison, setShowComparison] = useState(false);

  const categories = ["All", ...Array.from(new Set(schemes.map(s => s.category)))];

  const filteredSchemes = selectedCategory === "All" 
    ? schemes 
    : schemes.filter(s => s.category === selectedCategory);

  const calculateSubsidyAmount = (scheme: SubsidyScheme, amount: number) => {
    const subsidyAmount = Math.min((amount * scheme.subsidyPercentage) / 100, scheme.maxAmount);
    return Math.max(subsidyAmount, scheme.minAmount);
  };

  const calculateNetAmount = (scheme: SubsidyScheme, amount: number) => {
    const subsidyAmount = calculateSubsidyAmount(scheme, amount);
    return amount - subsidyAmount + scheme.applicationFee;
  };

  const bestScheme = filteredSchemes.reduce((best, current) => {
    const bestSubsidy = calculateSubsidyAmount(best, projectAmount);
    const currentSubsidy = calculateSubsidyAmount(current, projectAmount);
    return currentSubsidy > bestSubsidy ? current : best;
  }, filteredSchemes[0]);

  const totalPotentialSubsidy = filteredSchemes.reduce((total, scheme) => {
    return total + calculateSubsidyAmount(scheme, projectAmount);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Calculator Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-green-600" />
            {t("subsidy-calculator") || "Subsidy Calculator"}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {t("calculator-description") || "Calculate potential subsidies for your agricultural project"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Project Amount Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {t("project-amount") || "Project Amount"}
              </label>
              <Badge variant="outline" className="text-green-600">
                ₹{projectAmount.toLocaleString()}
              </Badge>
            </div>
            
            <Slider
              value={[projectAmount]}
              onValueChange={(value) => setProjectAmount(value[0])}
              max={1000000}
              min={10000}
              step={5000}
              className="w-full"
            />
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>₹10K</span>
              <span>₹10L</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("subsidy-category") || "Subsidy Category"}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {t(category.toLowerCase().replace(' ', '-')) || category}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">
                ₹{totalPotentialSubsidy.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Total Potential</div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                {filteredSchemes.length}
              </div>
              <div className="text-xs text-gray-600">Available Schemes</div>
            </div>
            
            {bestScheme && (
              <>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">
                    {bestScheme.subsidyPercentage}%
                  </div>
                  <div className="text-xs text-gray-600">Best Rate</div>
                </div>
                
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">
                    ₹{calculateNetAmount(bestScheme, projectAmount).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Your Cost</div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              {t("calculation-results") || "Calculation Results"}
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {filteredSchemes.slice(0, 5).map((scheme, index) => {
              const subsidyAmount = calculateSubsidyAmount(scheme, projectAmount);
              const netAmount = calculateNetAmount(scheme, projectAmount);
              const savingsPercentage = ((subsidyAmount / projectAmount) * 100).toFixed(1);

              return (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg text-green-600">
                        {scheme.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{t(scheme.nameKey) || scheme.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {scheme.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ₹{subsidyAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {savingsPercentage}% savings
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Project Cost:</span>
                      <div className="font-medium">₹{projectAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Subsidy:</span>
                      <div className="font-medium text-green-600">₹{subsidyAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Your Cost:</span>
                      <div className="font-medium text-blue-600">₹{netAmount.toLocaleString()}</div>
                    </div>
                  </div>

                  {scheme.applicationFee > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                      <Info className="h-3 w-3" />
                      Application fee: ₹{scheme.applicationFee}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {filteredSchemes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No subsidies available for the selected category.</p>
              <p className="text-sm">Try selecting a different category or adjusting your project amount.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
