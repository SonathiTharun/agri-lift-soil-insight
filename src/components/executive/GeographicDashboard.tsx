import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, Building2, Target, Users, TrendingUp, DollarSign,
  Calendar, Clock, CheckCircle, AlertTriangle, BarChart3,
  Download, Filter, Settings, Zap, Factory, Truck
} from 'lucide-react';
import { GeographicMap, sampleRegionData } from './charts/GeographicMap';
import type { RegionData, ProjectData } from './charts/GeographicMap';

const GeographicDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [activeView, setActiveView] = useState('overview');

  const handleRegionSelect = (region: RegionData) => {
    setSelectedRegion(region);
    setActiveView('region-details');
  };

  const handleProjectSelect = (project: ProjectData) => {
    setSelectedProject(project);
    setActiveView('project-details');
  };

  const allProjects = sampleRegionData.flatMap(region => region.projects);
  const totalBudget = allProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = allProjects.reduce((sum, p) => sum + p.spent, 0);
  const completedProjects = allProjects.filter(p => p.status === 'completed').length;
  const highPriorityProjects = allProjects.filter(p => p.priority === 'high').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planning': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on_hold': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <MapPin className="h-8 w-8 text-gray-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">Geographic Analytics</h1>
                <p className="text-gray-600 mt-1 text-sm">Executive dashboard for regional performance and project management</p>
              </div>
            </div>
            <div className="flex items-center gap-3 lg:flex-shrink-0">
              <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-50">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Regions</p>
                <p className="text-2xl font-bold text-gray-900">{sampleRegionData.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Across India</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{allProjects.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{completedProjects} completed</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">₹{(totalBudget / 100000).toFixed(1)}L</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">₹{(totalSpent / 100000).toFixed(1)}L spent</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">{highPriorityProjects}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-12 bg-gray-100">
              <TabsTrigger
                value="overview"
                className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="region-details"
                className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Region Details
              </TabsTrigger>
              <TabsTrigger
                value="project-details"
                className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Project Details
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        <TabsContent value="overview" className="space-y-6">
          <GeographicMap
            title="Regional Performance & Project Distribution"
            data={sampleRegionData}
            height="h-[600px]"
            onRegionSelect={handleRegionSelect}
            onProjectSelect={handleProjectSelect}
            showProjects={true}
            showInfrastructure={true}
            showAlerts={true}
          />
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Project Management Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project List */}
                <div className="lg:col-span-2 space-y-4">
                  {allProjects.map((project) => (
                    <Card key={project.id} className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleProjectSelect(project)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{project.name}</h3>
                            <p className="text-sm text-gray-600">Manager: {project.manager}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                              {project.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(project.priority)}`}>
                              {project.priority}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Budget</span>
                            <span className="font-medium">₹{(project.budget / 100000).toFixed(1)}L</span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Farmers Affected</span>
                            <span className="font-medium">{project.impact.farmersAffected}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Project Summary */}
                <div className="space-y-4">
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Project Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {['completed', 'in_progress', 'planning', 'on_hold'].map((status) => {
                        const count = allProjects.filter(p => p.status === status).length;
                        const percentage = (count / allProjects.length) * 100;
                        return (
                          <div key={status} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{status.replace('_', ' ')}</span>
                              <span className="font-medium">{count}</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Budget Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{(totalBudget / 100000).toFixed(1)}L
                        </div>
                        <div className="text-sm text-gray-600">Total Allocated</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Spent</span>
                          <span className="font-medium">₹{(totalSpent / 100000).toFixed(1)}L</span>
                        </div>
                        <Progress value={(totalSpent / totalBudget) * 100} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Remaining</span>
                          <span className="font-medium">₹{((totalBudget - totalSpent) / 100000).toFixed(1)}L</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="region-details" className="space-y-6">
          {selectedRegion ? (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {selectedRegion.name} - Regional Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Region Overview */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{selectedRegion.farmers.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Farmers</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">₹{(selectedRegion.revenue / 100000).toFixed(1)}L</div>
                        <div className="text-sm text-gray-600">Revenue</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{selectedRegion.activeUsers.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Active Users</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">+{selectedRegion.growth}%</div>
                        <div className="text-sm text-gray-600">Growth</div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {Object.entries(selectedRegion.performance).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{key}</span>
                              <span className="font-medium">{value}%</span>
                            </div>
                            <Progress value={value} className="h-2" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Regional Projects */}
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Regional Projects</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {selectedRegion.projects.map((project) => (
                          <div key={project.id} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{project.name}</h4>
                              <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                                {project.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-1" />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Manager: {project.manager}</span>
                                <span>₹{(project.budget / 100000).toFixed(1)}L</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Infrastructure & Alerts */}
                  <div className="space-y-4">
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Infrastructure
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3 w-3 text-gray-600" />
                            <span>{selectedRegion.infrastructure.warehouses} Warehouses</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Factory className="h-3 w-3 text-gray-600" />
                            <span>{selectedRegion.infrastructure.processingCenters} Processing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Truck className="h-3 w-3 text-gray-600" />
                            <span>{selectedRegion.infrastructure.distributionHubs} Distribution</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-gray-600" />
                            <span>{selectedRegion.infrastructure.servicePoints} Service Points</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {selectedRegion.alerts.length > 0 && (
                      <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            Active Alerts
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {selectedRegion.alerts.map((alert, index) => (
                            <div key={index} className={`p-2 rounded text-xs border ${
                              alert.severity === 'high' ? 'bg-red-50 border-red-200 text-red-800' :
                              alert.severity === 'medium' ? 'bg-gray-50 border-gray-200 text-gray-800' :
                              'bg-green-50 border-green-200 text-green-800'
                            }`}>
                              <div className="font-medium capitalize">{alert.type}</div>
                              <div>{alert.message}</div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-12 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Region Selected</h3>
                <p className="text-gray-600">Click on a region in the map to view detailed information</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="project-details" className="space-y-6">
          {selectedProject ? (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {selectedProject.name} - Project Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Project Overview */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{selectedProject.progress}%</div>
                        <div className="text-sm text-gray-600">Progress</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">₹{(selectedProject.budget / 100000).toFixed(1)}L</div>
                        <div className="text-sm text-gray-600">Budget</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">₹{(selectedProject.spent / 100000).toFixed(1)}L</div>
                        <div className="text-sm text-gray-600">Spent</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{selectedProject.impact.farmersAffected}</div>
                        <div className="text-sm text-gray-600">Farmers Affected</div>
                      </div>
                    </div>

                    {/* Project Progress */}
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Project Progress</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Overall Progress</span>
                            <span className="font-medium">{selectedProject.progress}%</span>
                          </div>
                          <Progress value={selectedProject.progress} className="h-3" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Budget Utilization</span>
                            <span className="font-medium">{((selectedProject.spent / selectedProject.budget) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(selectedProject.spent / selectedProject.budget) * 100} className="h-3" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Project Impact */}
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Expected Impact</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="text-lg font-bold text-gray-900">{selectedProject.impact.farmersAffected}</div>
                            <div className="text-xs text-gray-600">Farmers Affected</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="text-lg font-bold text-gray-900">₹{(selectedProject.impact.expectedRevenue / 1000).toFixed(0)}K</div>
                            <div className="text-xs text-gray-600">Expected Revenue</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="text-lg font-bold text-gray-900">{selectedProject.impact.completionRate}%</div>
                            <div className="text-xs text-gray-600">Completion Rate</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-4">
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Project Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type</span>
                            <span className="font-medium capitalize">{selectedProject.type.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status</span>
                            <Badge className={`text-xs ${getStatusColor(selectedProject.status)}`}>
                              {selectedProject.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Priority</span>
                            <Badge className={`text-xs ${getPriorityColor(selectedProject.priority)}`}>
                              {selectedProject.priority}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Manager</span>
                            <span className="font-medium">{selectedProject.manager}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Start Date</span>
                            <span className="font-medium">{new Date(selectedProject.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">End Date</span>
                            <span className="font-medium">{new Date(selectedProject.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Budget Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Budget</span>
                            <span className="font-medium">₹{(selectedProject.budget / 100000).toFixed(1)}L</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Amount Spent</span>
                            <span className="font-medium">₹{(selectedProject.spent / 100000).toFixed(1)}L</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Remaining</span>
                            <span className="font-medium">₹{((selectedProject.budget - selectedProject.spent) / 100000).toFixed(1)}L</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="text-gray-600">Utilization</span>
                            <span className="font-medium">{((selectedProject.spent / selectedProject.budget) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-12 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
                <p className="text-gray-600">Click on a project marker in the map to view detailed information</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeographicDashboard;
