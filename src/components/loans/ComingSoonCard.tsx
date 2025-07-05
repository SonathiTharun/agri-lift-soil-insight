import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/LanguageContext";
import {
  Flag,
  Calendar,
  Mail,
  Bell,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles,
  Users,
  TrendingUp,
  Building
} from "lucide-react";

interface IndianState {
  code: string;
  name: string;
  type: "state" | "union_territory";
  schemesCount: number;
  isAvailable: boolean;
  launchDate?: string;
}

interface ComingSoonCardProps {
  state: IndianState;
  onNotificationSignup: (email: string) => void;
  notificationEmail: string;
  setNotificationEmail: (email: string) => void;
}

export function ComingSoonCard({ 
  state, 
  onNotificationSignup, 
  notificationEmail, 
  setNotificationEmail 
}: ComingSoonCardProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationEmail.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onNotificationSignup(notificationEmail);
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const getStateIcon = (stateCode: string) => {
    // You could add specific state icons here
    return <Flag className="h-8 w-8" />;
  };

  const getExpectedFeatures = () => {
    return [
      "State-specific agricultural subsidies",
      "Crop insurance schemes",
      "Equipment purchase support",
      "Land development programs",
      "Irrigation infrastructure subsidies",
      "Organic farming incentives"
    ];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-4xl mx-auto overflow-hidden">
        {/* Header with Gradient Background */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                {getStateIcon(state.code)}
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">{state.name}</h2>
              <p className="text-blue-100 text-lg">
                {t("state-schemes-coming-soon") || "Agricultural Schemes Coming Soon"}
              </p>
              
              {state.launchDate && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {t("expected-launch") || "Expected Launch"}: {state.launchDate}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles className="h-12 w-12" />
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <Building className="h-10 w-10" />
          </div>
        </div>

        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  {t("what-to-expect") || "What to Expect"}
                </h3>
                
                <div className="space-y-3">
                  {getExpectedFeatures().map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  {t("development-timeline") || "Development Timeline"}
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Research & Data Collection - Completed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Government Partnership - In Progress</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-600">Platform Integration - Upcoming</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-600">Launch & Testing - {state.launchDate || "TBD"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Notification Signup */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  {t("get-notified") || "Get Notified"}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {t("notification-description") || 
                   "Be the first to know when agricultural schemes for your state become available. We'll send you an email notification as soon as they're launched."}
                </p>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("email-address") || "Email Address"}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          value={notificationEmail}
                          onChange={(e) => setNotificationEmail(e.target.value)}
                          placeholder={t("enter-email") || "Enter your email address"}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t("subscribing") || "Subscribing..."}
                        </>
                      ) : (
                        <>
                          <Bell className="h-4 w-4 mr-2" />
                          {t("notify-me") || "Notify Me"}
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-green-800 mb-2">
                      {t("subscription-confirmed") || "Subscription Confirmed!"}
                    </h4>
                    <p className="text-green-600 text-sm">
                      {t("notification-success") || 
                       "We'll notify you as soon as schemes for your state are available."}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  {t("join-community") || "Join Our Community"}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {t("community-description") || 
                   "Connect with other farmers and stay updated on the latest agricultural schemes and subsidies."}
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {Math.floor(Math.random() * 1000) + 500}+ farmers waiting
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {state.type === "state" ? "State" : "Union Territory"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-gray-500">
              {t("coming-soon-footer") || 
               "We're working closely with state governments to bring you the most comprehensive and up-to-date information on agricultural schemes."}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
