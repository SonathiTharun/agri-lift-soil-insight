import { useState } from "react";
import { ExecutiveNavbar } from "@/components/ExecutiveNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Globe,
  Palette,
  Download,
  Upload,
  RefreshCw,
  Save,
  AlertTriangle,
  CheckCircle,
  Monitor,
  Smartphone,
  Mail
} from "lucide-react";

const ExecutiveSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "AgriLift Solutions",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    currency: "INR",
    language: "en"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      newFarmerRegistration: true,
      loanApplications: true,
      systemAlerts: true,
      weeklyReports: true,
      marketUpdates: false
    },
    sms: {
      criticalAlerts: true,
      loanApprovals: false,
      systemMaintenance: true
    },
    push: {
      realTimeNotifications: true,
      dashboardUpdates: true,
      emergencyAlerts: true
    }
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginNotifications: true,
    ipWhitelist: "",
    auditLogging: true
  });

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: 365,
    maintenanceMode: false,
    debugMode: false,
    apiRateLimit: 1000
  });

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: `${section} settings have been updated successfully.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSettings = () => {
    const settings = {
      general: generalSettings,
      notifications: notificationSettings,
      security: securitySettings,
      system: systemSettings
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'executive-settings.json';
    link.click();
    
    toast({
      title: "Settings Exported",
      description: "Settings have been exported successfully.",
    });
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const settings = JSON.parse(e.target?.result as string);
            // Update settings state here
            toast({
              title: "Settings Imported",
              description: "Settings have been imported successfully.",
            });
          } catch (error) {
            toast({
              title: "Import Error",
              description: "Invalid settings file format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleResetToDefaults = () => {
    // Reset all settings to defaults
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <ExecutiveNavbar />
      <div className="pt-20 lg:pt-24">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Executive Settings</h1>
              <p className="text-gray-600 mt-2">Manage system configuration and preferences</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportSettings}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleImportSettings}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="destructive" onClick={handleResetToDefaults}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                System
              </TabsTrigger>
            </TabsList>

            {/* General Settings Tab */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Configuration</CardTitle>
                  <CardDescription>
                    Basic system settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={generalSettings.companyName}
                        onChange={(e) => setGeneralSettings({
                          ...generalSettings,
                          companyName: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        value={generalSettings.timezone}
                        onChange={(e) => setGeneralSettings({
                          ...generalSettings,
                          timezone: e.target.value
                        })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <select
                        id="dateFormat"
                        value={generalSettings.dateFormat}
                        onChange={(e) => setGeneralSettings({
                          ...generalSettings,
                          dateFormat: e.target.value
                        })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        value={generalSettings.currency}
                        onChange={(e) => setGeneralSettings({
                          ...generalSettings,
                          currency: e.target.value
                        })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end">
                    <Button onClick={() => handleSaveSettings("General")} disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(notificationSettings.email).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={`email-${key}`} className="text-sm">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <Switch
                          id={`email-${key}`}
                          checked={value}
                          onCheckedChange={(checked) => setNotificationSettings({
                            ...notificationSettings,
                            email: { ...notificationSettings.email, [key]: checked }
                          })}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      SMS Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(notificationSettings.sms).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={`sms-${key}`} className="text-sm">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <Switch
                          id={`sms-${key}`}
                          checked={value}
                          onCheckedChange={(checked) => setNotificationSettings({
                            ...notificationSettings,
                            sms: { ...notificationSettings.sms, [key]: checked }
                          })}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Push Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(notificationSettings.push).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={`push-${key}`} className="text-sm">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <Switch
                          id={`push-${key}`}
                          checked={value}
                          onCheckedChange={(checked) => setNotificationSettings({
                            ...notificationSettings,
                            push: { ...notificationSettings.push, [key]: checked }
                          })}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings("Notifications")} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Notification Settings"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSettings;
