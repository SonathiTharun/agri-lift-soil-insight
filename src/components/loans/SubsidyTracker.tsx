import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/LanguageContext";
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  RefreshCw,
  Download,
  Eye
} from "lucide-react";

interface Application {
  id: string;
  applicationNumber: string;
  schemeName: string;
  appliedDate: string;
  status: "Submitted" | "Under Review" | "Approved" | "Rejected" | "Pending Documents";
  subsidyAmount: number;
  lastUpdated: string;
  nextAction?: string;
  documents: {
    name: string;
    status: "Uploaded" | "Pending" | "Verified" | "Rejected";
  }[];
  contactOfficer?: {
    name: string;
    phone: string;
    email: string;
  };
}

const sampleApplications: Application[] = [
  {
    id: "1",
    applicationNumber: "PMKISAN/2024/001234",
    schemeName: "PM-KISAN Equipment Subsidy",
    appliedDate: "2024-01-15",
    status: "Under Review",
    subsidyAmount: 250000,
    lastUpdated: "2024-01-20",
    nextAction: "Document verification in progress",
    documents: [
      { name: "Aadhaar Card", status: "Verified" },
      { name: "Land Records", status: "Verified" },
      { name: "Bank Details", status: "Pending" },
      { name: "Quotation", status: "Uploaded" }
    ],
    contactOfficer: {
      name: "Mr. Rajesh Kumar",
      phone: "+91 9876543210",
      email: "rajesh.kumar@agri.gov.in"
    }
  },
  {
    id: "2",
    applicationNumber: "PMFBY/2024/005678",
    schemeName: "Pradhan Mantri Fasal Bima Yojana",
    appliedDate: "2024-01-10",
    status: "Approved",
    subsidyAmount: 15000,
    lastUpdated: "2024-01-18",
    documents: [
      { name: "Aadhaar Card", status: "Verified" },
      { name: "Land Records", status: "Verified" },
      { name: "Sowing Certificate", status: "Verified" },
      { name: "Bank Passbook", status: "Verified" }
    ]
  }
];

export function SubsidyTracker() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [applications] = useState<Application[]>(sampleApplications);

  const filteredApplications = applications.filter(app =>
    app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.schemeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Under Review": return "bg-blue-100 text-blue-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Pending Documents": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved": return <CheckCircle className="h-4 w-4" />;
      case "Under Review": return <Clock className="h-4 w-4" />;
      case "Rejected": return <AlertCircle className="h-4 w-4" />;
      case "Pending Documents": return <FileText className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "Verified": return "text-green-600";
      case "Uploaded": return "text-blue-600";
      case "Pending": return "text-orange-600";
      case "Rejected": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            {t("application-tracker") || "Application Tracker"}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {t("track-subsidy-applications") || "Track your subsidy applications and their status"}
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t("search-applications") || "Search by application number or scheme name..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Refresh Button */}
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("refresh") || "Refresh"}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === "Approved").length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {applications.filter(app => app.status === "Under Review").length}
              </div>
              <div className="text-sm text-gray-600">Under Review</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ₹{applications.reduce((sum, app) => sum + app.subsidyAmount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Subsidy</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application, index) => (
          <motion.div
            key={application.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Application Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{application.schemeName}</h3>
                      <Badge className={getStatusColor(application.status)}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Application No:</span> {application.applicationNumber}
                      </div>
                      <div>
                        <span className="font-medium">Applied Date:</span> {application.appliedDate}
                      </div>
                      <div>
                        <span className="font-medium">Subsidy Amount:</span> 
                        <span className="text-green-600 font-semibold"> ₹{application.subsidyAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span> {application.lastUpdated}
                      </div>
                    </div>

                    {application.nextAction && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                        <span className="text-sm text-blue-700">
                          <strong>Next Action:</strong> {application.nextAction}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Document Status */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-3">Document Status:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {application.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${
                          doc.status === "Verified" ? "bg-green-500" :
                          doc.status === "Uploaded" ? "bg-blue-500" :
                          doc.status === "Pending" ? "bg-orange-500" : "bg-red-500"
                        }`} />
                        <span className="text-gray-700">{doc.name}</span>
                        <span className={`font-medium ${getDocumentStatusColor(doc.status)}`}>
                          ({doc.status})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Officer */}
                {application.contactOfficer && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Contact Officer:</h4>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-gray-700">{application.contactOfficer.name}</span>
                      <div className="flex items-center gap-1 text-blue-600">
                        <Phone className="h-3 w-3" />
                        {application.contactOfficer.phone}
                      </div>
                      <div className="flex items-center gap-1 text-blue-600">
                        <Mail className="h-3 w-3" />
                        {application.contactOfficer.email}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {t("no-applications-found") || "No Applications Found"}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? t("no-matching-applications") || "No applications match your search criteria"
                : t("no-applications-yet") || "You haven't submitted any subsidy applications yet"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
