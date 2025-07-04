import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Calculator, DollarSign, Calendar, Percent, TrendingUp, Building, Phone, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FinanceCalculatorModalProps {
  open: boolean;
  onClose: () => void;
  equipment: any;
  financingPartners: any[];
}

export const FinanceCalculatorModal: React.FC<FinanceCalculatorModalProps> = ({
  open,
  onClose,
  equipment,
  financingPartners
}) => {
  const [loanAmount, setLoanAmount] = useState(equipment?.price || 0);
  const [downPayment, setDownPayment] = useState(Math.round((equipment?.price || 0) * 0.2));
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(60); // months
  const [selectedPartner, setSelectedPartner] = useState(financingPartners[0]);
  const [calculation, setCalculation] = useState<any>(null);

  useEffect(() => {
    if (equipment) {
      setLoanAmount(equipment.price);
      setDownPayment(Math.round(equipment.price * 0.2));
    }
  }, [equipment]);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, downPayment, interestRate, tenure]);

  const calculateEMI = () => {
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
               (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;
    
    setCalculation({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal: Math.round(principal),
      downPayment,
      loanAmount
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Finance Calculator - {equipment?.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="partners">Financing Partners</TabsTrigger>
            <TabsTrigger value="comparison">Compare Options</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Loan Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Equipment Price</Label>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(equipment?.price || 0)}
                    </div>
                  </div>

                  <div>
                    <Label>Loan Amount: {formatCurrency(loanAmount)}</Label>
                    <Slider
                      value={[loanAmount]}
                      onValueChange={(value) => setLoanAmount(value[0])}
                      max={equipment?.price || 1000000}
                      min={50000}
                      step={5000}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Down Payment: {formatCurrency(downPayment)}</Label>
                    <Slider
                      value={[downPayment]}
                      onValueChange={(value) => setDownPayment(value[0])}
                      max={(equipment?.price || 1000000) * 0.5}
                      min={0}
                      step={5000}
                      className="mt-2"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {((downPayment / (equipment?.price || 1)) * 100).toFixed(1)}% of equipment price
                    </div>
                  </div>

                  <div>
                    <Label>Interest Rate: {interestRate}% per annum</Label>
                    <Slider
                      value={[interestRate]}
                      onValueChange={(value) => setInterestRate(value[0])}
                      max={15}
                      min={6}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Tenure: {tenure} months ({Math.round(tenure/12)} years)</Label>
                    <Slider
                      value={[tenure]}
                      onValueChange={(value) => setTenure(value[0])}
                      max={84}
                      min={12}
                      step={6}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">EMI Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  {calculation && (
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-gray-600">Monthly EMI</div>
                        <div className="text-3xl font-bold text-blue-600">
                          {formatCurrency(calculation.emi)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-sm text-gray-600">Principal</div>
                          <div className="text-lg font-semibold text-green-600">
                            {formatCurrency(calculation.principal)}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-sm text-gray-600">Total Interest</div>
                          <div className="text-lg font-semibold text-orange-600">
                            {formatCurrency(calculation.totalInterest)}
                          </div>
                        </div>
                      </div>

                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-sm text-gray-600">Total Amount Payable</div>
                        <div className="text-xl font-bold text-purple-600">
                          {formatCurrency(calculation.totalAmount)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Down Payment:</span>
                          <span className="font-semibold">{formatCurrency(calculation.downPayment)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Processing Fee (est.):</span>
                          <span className="font-semibold">{formatCurrency(calculation.principal * 0.01)}</span>
                        </div>
                        <div className="flex justify-between text-sm border-t pt-2">
                          <span className="font-semibold">Total Initial Payment:</span>
                          <span className="font-bold">{formatCurrency(calculation.downPayment + (calculation.principal * 0.01))}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1">
                Apply for Loan
              </Button>
              <Button variant="outline" className="flex-1">
                Save Calculation
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="partners" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {financingPartners.map((partner, index) => (
                <Card key={index} className={`cursor-pointer transition-all ${selectedPartner?.name === partner.name ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <img src={partner.logo} alt={partner.name} className="w-12 h-12 rounded-lg" />
                      <div>
                        <CardTitle className="text-lg">{partner.name}</CardTitle>
                        <Badge variant="outline">{partner.interestRate} Interest</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Interest Rate:</span>
                        <div className="font-semibold">{partner.interestRate}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Max Tenure:</span>
                        <div className="font-semibold">{partner.maxTenure}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Processing Fee:</span>
                        <div className="font-semibold">{partner.processingFee}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Approval Time:</span>
                        <div className="font-semibold">2-3 days</div>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      variant={selectedPartner?.name === partner.name ? "default" : "outline"}
                      onClick={() => setSelectedPartner(partner)}
                    >
                      {selectedPartner?.name === partner.name ? "Selected" : "Select"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financing Options Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Partner</th>
                        <th className="text-left p-2">Interest Rate</th>
                        <th className="text-left p-2">Processing Fee</th>
                        <th className="text-left p-2">Max Tenure</th>
                        <th className="text-left p-2">EMI (60 months)</th>
                        <th className="text-left p-2">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financingPartners.map((partner, index) => {
                        const rate = parseFloat(partner.interestRate);
                        const principal = (equipment?.price || 0) - downPayment;
                        const monthlyRate = rate / 100 / 12;
                        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, 60)) / 
                                   (Math.pow(1 + monthlyRate, 60) - 1);
                        const totalCost = emi * 60;
                        
                        return (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-semibold">{partner.name}</td>
                            <td className="p-2">{partner.interestRate}</td>
                            <td className="p-2">{partner.processingFee}</td>
                            <td className="p-2">{partner.maxTenure}</td>
                            <td className="p-2 font-semibold">{formatCurrency(emi)}</td>
                            <td className="p-2 font-semibold">{formatCurrency(totalCost)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
