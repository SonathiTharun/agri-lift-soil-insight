import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  Camera,
  Award,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Clock,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExecutiveNavbar from "@/components/ExecutiveNavbar";

interface ExecutiveData {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  joinDate: string;
  bio: string;
  avatar: string;
  permissions: string[];
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    type: 'performance' | 'leadership' | 'innovation';
  }>;
  stats: {
    totalFarmersManaged: number;
    revenueGenerated: number;
    projectsCompleted: number;
    teamSize: number;
  };
}

const ExecutiveProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [executiveData, setExecutiveData] = useState<ExecutiveData>({
    id: "EXE-001",
    name: "Rajesh Kumar Singh",
    email: "rajesh.singh@agrilift.com",
    phone: "+91 98765 43210",
    position: "Senior Executive",
    department: "Agricultural Operations",
    location: "Mumbai, Maharashtra",
    joinDate: "2022-03-15",
    bio: "Experienced agricultural executive with over 8 years in the industry. Specialized in farmer relationship management and agricultural technology implementation.",
    avatar: "/api/placeholder/150/150",
    permissions: ["farmer_management", "financial_oversight", "resource_allocation", "market_administration"],
    achievements: [
      {
        title: "Top Performer Q1 2024",
        description: "Achieved 125% of quarterly targets",
        date: "2024-03-31",
        type: "performance"
      },
      {
        title: "Innovation Award",
        description: "Implemented new farmer onboarding system",
        date: "2024-01-15",
        type: "innovation"
      },
      {
        title: "Team Leadership Excellence",
        description: "Successfully managed team of 15+ members",
        date: "2023-12-01",
        type: "leadership"
      }
    ],
    stats: {
      totalFarmersManaged: 1247,
      revenueGenerated: 2450000,
      projectsCompleted: 23,
      teamSize: 15
    }
  });

  const [editData, setEditData] = useState(executiveData);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setExecutiveData(editData);
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData(executiveData);
    setIsEditing(false);
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'leadership': return <Users className="h-4 w-4" />;
      case 'innovation': return <Award className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'performance': return 'bg-green-100 text-green-800 border-green-200';
      case 'leadership': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'innovation': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ExecutiveNavbar />
      <div className="pt-20 lg:pt-24">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Executive Profile</h1>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <img
                        src={executiveData.avatar}
                        alt={executiveData.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold mt-4">{executiveData.name}</h2>
                    <p className="text-gray-600">{executiveData.position}</p>
                    <p className="text-sm text-gray-500">{executiveData.department}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {executiveData.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.replace('_', ' ').toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{executiveData.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{executiveData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{executiveData.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Joined {new Date(executiveData.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Performance Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {executiveData.stats.totalFarmersManaged.toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-700">Farmers Managed</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{(executiveData.stats.revenueGenerated / 100000).toFixed(1)}L
                      </div>
                      <div className="text-xs text-green-700">Revenue Generated</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {executiveData.stats.projectsCompleted}
                      </div>
                      <div className="text-xs text-purple-700">Projects Completed</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {executiveData.stats.teamSize}
                      </div>
                      <div className="text-xs text-orange-700">Team Members</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="details" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Personal Details</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          {isEditing ? (
                            <Input
                              id="name"
                              value={editData.name}
                              onChange={(e) => setEditData({...editData, name: e.target.value})}
                            />
                          ) : (
                            <p className="text-sm text-gray-600">{executiveData.name}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          {isEditing ? (
                            <Input
                              id="email"
                              type="email"
                              value={editData.email}
                              onChange={(e) => setEditData({...editData, email: e.target.value})}
                            />
                          ) : (
                            <p className="text-sm text-gray-600">{executiveData.email}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          {isEditing ? (
                            <Input
                              id="phone"
                              value={editData.phone}
                              onChange={(e) => setEditData({...editData, phone: e.target.value})}
                            />
                          ) : (
                            <p className="text-sm text-gray-600">{executiveData.phone}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          {isEditing ? (
                            <Input
                              id="location"
                              value={editData.location}
                              onChange={(e) => setEditData({...editData, location: e.target.value})}
                            />
                          ) : (
                            <p className="text-sm text-gray-600">{executiveData.location}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        {isEditing ? (
                          <Textarea
                            id="bio"
                            value={editData.bio}
                            onChange={(e) => setEditData({...editData, bio: e.target.value})}
                            rows={4}
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{executiveData.bio}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="achievements">
                  <Card>
                    <CardHeader>
                      <CardTitle>Achievements & Recognition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {executiveData.achievements.map((achievement, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${getAchievementColor(achievement.type)}`}>
                                  {getAchievementIcon(achievement.type)}
                                </div>
                                <div>
                                  <h3 className="font-semibold">{achievement.title}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                      {new Date(achievement.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Badge className={getAchievementColor(achievement.type)}>
                                {achievement.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { action: "Approved loan application", details: "₹75,000 for Priya Sharma", time: "2 hours ago" },
                          { action: "Updated farmer profile", details: "Rajesh Kumar - contact information", time: "4 hours ago" },
                          { action: "Generated financial report", details: "Q1 2024 revenue analysis", time: "1 day ago" },
                          { action: "Scheduled machinery maintenance", details: "Tractor TRC-001", time: "2 days ago" },
                          { action: "Resolved support ticket", details: "Payment processing issue", time: "3 days ago" }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{activity.action}</p>
                              <p className="text-xs text-gray-600">{activity.details}</p>
                              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveProfile;
