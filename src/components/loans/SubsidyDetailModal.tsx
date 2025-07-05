import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/LanguageContext";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  FileText,
  IndianRupee,
  Percent,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  ExternalLink,
  Info,
  Building,
  Target
} from "lucide-react";

interface SubsidyScheme {
  id: string;
  name: string;
  nameKey: string;
  description: string;
  descriptionKey: string;
  category: string;
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
  status: string;
  location: string[];
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  officialApplicationUrl?: string;
}

interface SubsidyDetailModalProps {
  scheme: any | null;
  isOpen: boolean;
  onClose: () => void;
  projectAmount?: number;
}

export function SubsidyDetailModal({ scheme, isOpen, onClose, projectAmount = 100000 }: SubsidyDetailModalProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  if (!scheme) return null;

  const calculateSubsidyAmount = (amount: number) => {
    const subsidyAmount = Math.min((amount * scheme.subsidyPercentage) / 100, scheme.maxAmount);
    return Math.max(subsidyAmount, scheme.minAmount);
  };

  const subsidyAmount = calculateSubsidyAmount(projectAmount);
  const netAmount = projectAmount - subsidyAmount + scheme.applicationFee;

  const handleApplyNow = () => {
    if (scheme.officialApplicationUrl) {
      window.open(scheme.officialApplicationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-lg shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg text-green-600">
                  {scheme.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t(scheme.nameKey) || scheme.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-white">
                      {scheme.category}
                    </Badge>
                    <Badge 
                      className={scheme.status === "Active" ? "bg-green-500" : "bg-gray-500"}
                    >
                      {scheme.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button size="sm" variant="ghost" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 m-6 mb-0">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>

                <div className="p-6">
                  <TabsContent value="overview" className="space-y-6">
                    {/* Quick Calculator */}
                    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700">
                          <IndianRupee className="h-5 w-5" />
                          Your Potential Benefit
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">₹{projectAmount.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Project Cost</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">₹{subsidyAmount.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Subsidy Amount</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">₹{netAmount.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Your Cost</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                      <CardHeader>
                        <CardTitle>About This Scheme</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">
                          {t(scheme.descriptionKey) || scheme.description}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Key Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Scheme Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Government Scheme:</span>
                            <span className="font-medium">{scheme.governmentScheme}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subsidy Rate:</span>
                            <span className="font-medium text-green-600">{scheme.subsidyPercentage}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Maximum Amount:</span>
                            <span className="font-medium">₹{scheme.maxAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Minimum Amount:</span>
                            <span className="font-medium">₹{scheme.minAmount.toLocaleString()}</span>
                          </div>
                          {scheme.applicationFee > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Application Fee:</span>
                              <span className="font-medium text-orange-600">₹{scheme.applicationFee}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-orange-500" />
                            <div>
                              <div className="font-medium">Application Deadline</div>
                              <div className="text-sm text-gray-600">{scheme.applicationDeadline}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-blue-500" />
                            <div>
                              <div className="font-medium">Processing Time</div>
                              <div className="text-sm text-gray-600">{scheme.processingTime}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-green-500" />
                            <div>
                              <div className="font-medium">Coverage</div>
                              <div className="text-sm text-gray-600">{scheme.location.join(", ")}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="eligibility" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Eligibility Criteria
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {scheme.eligibility.map((criteria, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                              <span className="text-gray-700">{criteria}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Target Beneficiaries
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {scheme.targetBeneficiaries.map((beneficiary, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                              {beneficiary}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Required Documents
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          {scheme.documents.map((document, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span className="text-gray-700">{document}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="h-5 w-5 text-green-500" />
                          <div>
                            <div className="font-medium">Phone</div>
                            <div className="text-gray-600">{scheme.contactInfo.phone}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="h-5 w-5 text-blue-500" />
                          <div>
                            <div className="font-medium">Email</div>
                            <div className="text-gray-600">{scheme.contactInfo.email}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Globe className="h-5 w-5 text-purple-500" />
                          <div className="flex-1">
                            <div className="font-medium">Website</div>
                            <div className="text-gray-600">{scheme.contactInfo.website}</div>
                          </div>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4" />
                Information is subject to change. Please verify with official sources.
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                {scheme.officialApplicationUrl ? (
                  <Button
                    onClick={handleApplyNow}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t("apply-on-official-portal") || "Apply on Official Portal"}
                  </Button>
                ) : (
                  <Button disabled>
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
