import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Polygon } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  MapPin, Users, TrendingUp, DollarSign, Building2, Truck,
  Factory, Sprout, AlertTriangle, CheckCircle, Clock,
  BarChart3, Target, Zap, Settings, Filter, Download,
  Calendar, MapIcon, Layers, Eye, EyeOff
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export interface ProjectData {
  id: string;
  name: string;
  type: 'infrastructure' | 'technology' | 'training' | 'market_expansion';
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'high' | 'medium' | 'low';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  manager: string;
  progress: number;
  coordinates: [number, number];
  impact: {
    farmersAffected: number;
    expectedRevenue: number;
    completionRate: number;
  };
}

export interface RegionData {
  id: string;
  name: string;
  coordinates: [number, number];
  farmers: number;
  revenue: number;
  growth: number;
  activeUsers: number;
  marketActivity: number;
  projects: ProjectData[];
  infrastructure: {
    warehouses: number;
    processingCenters: number;
    distributionHubs: number;
    servicePoints: number;
  };
  performance: {
    satisfaction: number;
    efficiency: number;
    adoption: number;
    retention: number;
  };
  alerts: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    severity: 'high' | 'medium' | 'low';
  }>;
}

interface GeographicMapProps {
  title?: string;
  data: RegionData[];
  className?: string;
  height?: string;
  showProjects?: boolean;
  showInfrastructure?: boolean;
  showAlerts?: boolean;
  onRegionSelect?: (region: RegionData) => void;
  onProjectSelect?: (project: ProjectData) => void;
}

// Custom hook to fit map bounds
const FitBounds: React.FC<{ data: RegionData[] }> = ({ data }) => {
  const map = useMap();
  
  useEffect(() => {
    if (data.length > 0) {
      const bounds = data.map(region => region.coordinates);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [data, map]);
  
  return null;
};

// Get marker size based on revenue
const getMarkerSize = (revenue: number, maxRevenue: number): number => {
  const minSize = 8;
  const maxSize = 25;
  const ratio = revenue / maxRevenue;
  return minSize + (maxSize - minSize) * ratio;
};

// Get marker color based on growth
const getMarkerColor = (growth: number): string => {
  if (growth >= 15) return '#22c55e'; // Green for high growth
  if (growth >= 10) return '#64748b'; // Gray for medium growth
  if (growth >= 5) return '#94a3b8';  // Light gray for low growth
  return '#ef4444'; // Red for negative/very low growth
};

// Get project marker color based on status
const getProjectColor = (status: string): string => {
  switch (status) {
    case 'completed': return '#22c55e';
    case 'in_progress': return '#3b82f6';
    case 'planning': return '#64748b';
    case 'on_hold': return '#ef4444';
    default: return '#6b7280';
  }
};

// Get project icon based on type
const getProjectIcon = (type: string) => {
  switch (type) {
    case 'infrastructure': return Building2;
    case 'technology': return Zap;
    case 'training': return Users;
    case 'market_expansion': return Target;
    default: return MapPin;
  }
};

// Get priority color
const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const GeographicMap: React.FC<GeographicMapProps> = ({
  title = "Geographic Distribution",
  data,
  className = "",
  height = "h-96",
  showProjects = true,
  showInfrastructure = true,
  showAlerts = true,
  onRegionSelect,
  onProjectSelect
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [layerVisibility, setLayerVisibility] = useState({
    regions: true,
    projects: showProjects,
    infrastructure: showInfrastructure,
    alerts: showAlerts
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const maxRevenue = Math.max(...data.map(region => region.revenue));
  const allProjects = data.flatMap(region => region.projects);
  const totalProjects = allProjects.length;
  const completedProjects = allProjects.filter(p => p.status === 'completed').length;
  const inProgressProjects = allProjects.filter(p => p.status === 'in_progress').length;

  const handleRegionClick = (region: RegionData) => {
    setSelectedRegion(region);
    onRegionSelect?.(region);
  };

  const toggleLayer = (layer: keyof typeof layerVisibility) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const filteredProjects = allProjects.filter(project => {
    const statusMatch = filterStatus === 'all' || project.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || project.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Header with Controls */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg flex-shrink-0">
                <MapIcon className="h-6 w-6 text-gray-700" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-xl font-bold text-gray-900 leading-tight">{title}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Executive Geographic Analytics & Project Management</p>
              </div>
            </div>

            {/* Layer Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:flex-shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <Layers className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Layers:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {Object.entries(layerVisibility).map(([key, visible]) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => toggleLayer(key as keyof typeof layerVisibility)}
                    className={`text-xs h-8 px-3 ${visible ? 'bg-gray-900 text-white hover:bg-gray-800 border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {visible ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Button>
                ))}
                <Button variant="outline" size="sm" className="text-xs h-8 px-3 text-gray-600 border-gray-300 hover:bg-gray-50">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      {/* Main Content with Tabs */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Map Section */}
        <div className="xl:col-span-3">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <div className={`${height} rounded-lg overflow-hidden border border-gray-200`}>
                <MapContainer
                  center={[20.5937, 78.9629]} // Center of India
                  zoom={5}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={true}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FitBounds data={data} />

                  {/* Region Markers */}
                  {layerVisibility.regions && data.map((region) => (
                    <CircleMarker
                      key={region.id}
                      center={region.coordinates}
                      radius={getMarkerSize(region.revenue, maxRevenue)}
                      fillColor={getMarkerColor(region.growth)}
                      color="#fff"
                      weight={2}
                      opacity={1}
                      fillOpacity={0.8}
                      eventHandlers={{
                        click: () => handleRegionClick(region)
                      }}
                    >
                      <Popup className="custom-popup">
                        <div className="p-3 min-w-[280px]">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-lg text-gray-900">{region.name}</h3>
                            {region.alerts.length > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {region.alerts.length} Alert{region.alerts.length > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>

                          <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-3">
                              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                              <TabsTrigger value="projects" className="text-xs">Projects</TabsTrigger>
                              <TabsTrigger value="infrastructure" className="text-xs">Infrastructure</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-center p-2 bg-gray-50 rounded">
                                  <div className="text-lg font-bold text-gray-900">{region.farmers.toLocaleString()}</div>
                                  <div className="text-xs text-gray-600">Farmers</div>
                                </div>
                                <div className="text-center p-2 bg-gray-50 rounded">
                                  <div className="text-lg font-bold text-gray-900">₹{(region.revenue / 100000).toFixed(1)}L</div>
                                  <div className="text-xs text-gray-600">Revenue</div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Satisfaction</span>
                                  <span className="font-medium">{region.performance.satisfaction}%</span>
                                </div>
                                <Progress value={region.performance.satisfaction} className="h-2" />

                                <div className="flex justify-between text-sm">
                                  <span>Efficiency</span>
                                  <span className="font-medium">{region.performance.efficiency}%</span>
                                </div>
                                <Progress value={region.performance.efficiency} className="h-2" />
                              </div>
                            </TabsContent>

                            <TabsContent value="projects" className="space-y-2">
                              <div className="text-sm text-gray-600 mb-2">
                                {region.projects.length} Active Projects
                              </div>
                              {region.projects.slice(0, 3).map((project) => (
                                <div key={project.id} className="p-2 bg-gray-50 rounded text-xs">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium truncate">{project.name}</span>
                                    <Badge className={`text-xs ${getPriorityColor(project.priority)}`}>
                                      {project.priority}
                                    </Badge>
                                  </div>
                                  <Progress value={project.progress} className="h-1 mb-1" />
                                  <div className="text-gray-600">{project.progress}% Complete</div>
                                </div>
                              ))}
                            </TabsContent>

                            <TabsContent value="infrastructure" className="space-y-2">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  <span>{region.infrastructure.warehouses} Warehouses</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Factory className="h-3 w-3" />
                                  <span>{region.infrastructure.processingCenters} Processing</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Truck className="h-3 w-3" />
                                  <span>{region.infrastructure.distributionHubs} Distribution</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{region.infrastructure.servicePoints} Service Points</span>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}

                  {/* Project Markers */}
                  {layerVisibility.projects && filteredProjects.map((project) => {
                    const IconComponent = getProjectIcon(project.type);
                    return (
                      <CircleMarker
                        key={`project-${project.id}`}
                        center={project.coordinates}
                        radius={8}
                        fillColor={getProjectColor(project.status)}
                        color="#fff"
                        weight={1}
                        opacity={1}
                        fillOpacity={0.9}
                        eventHandlers={{
                          click: () => onProjectSelect?.(project)
                        }}
                      >
                        <Popup>
                          <div className="p-2 min-w-[200px]">
                            <h4 className="font-semibold text-sm mb-2">{project.name}</h4>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span>Status:</span>
                                <Badge className={`text-xs ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {project.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Progress:</span>
                                <span>{project.progress}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Budget:</span>
                                <span>₹{(project.budget / 100000).toFixed(1)}L</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Manager:</span>
                                <span>{project.manager}</span>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Panel */}
        <div className="xl:col-span-1 space-y-4">
          {/* Quick Stats */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Quick Stats
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">
                    {data.reduce((sum, region) => sum + region.farmers, 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Total Farmers</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">
                    ₹{(data.reduce((sum, region) => sum + region.revenue, 0) / 100000).toFixed(1)}L
                  </div>
                  <div className="text-xs text-gray-600">Total Revenue</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">
                    {totalProjects}
                  </div>
                  <div className="text-xs text-gray-600">Active Projects</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">
                    {data.length}
                  </div>
                  <div className="text-xs text-gray-600">Regions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Filters */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Project Filters
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900"
                >
                  <option value="all">All Status</option>
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Project Summary */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Project Overview
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium text-gray-900">{completedProjects}/{totalProjects}</span>
                </div>
                <Progress value={(completedProjects / totalProjects) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-medium text-gray-900">{inProgressProjects}/{totalProjects}</span>
                </div>
                <Progress value={(inProgressProjects / totalProjects) * 100} className="h-2" />
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-600 mb-2">Total Budget Allocated</div>
                <div className="text-lg font-bold text-gray-900">
                  ₹{(allProjects.reduce((sum, p) => sum + p.budget, 0) / 100000).toFixed(1)}L
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Panel */}
          {layerVisibility.alerts && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Active Alerts
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.flatMap(region =>
                  region.alerts.map((alert, index) => (
                    <div key={`${region.id}-${index}`} className={`p-2 rounded text-xs border ${
                      alert.severity === 'high' ? 'bg-red-50 border-red-200 text-red-800' :
                      alert.severity === 'medium' ? 'bg-gray-50 border-gray-200 text-gray-800' :
                      'bg-green-50 border-green-200 text-green-800'
                    }`}>
                      <div className="font-medium">{region.name}</div>
                      <div>{alert.message}</div>
                    </div>
                  ))
                ).slice(0, 5)}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Summary Panel */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-gray-700" />
              </div>
              Regional Performance Summary
            </CardTitle>
            <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export Summary
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {data.reduce((sum, region) => sum + region.farmers, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Farmers</div>
              <div className="text-xs text-green-600 mt-1">
                +{((data.reduce((sum, region) => sum + region.growth, 0) / data.length)).toFixed(1)}% avg growth
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                ₹{(data.reduce((sum, region) => sum + region.revenue, 0) / 100000).toFixed(1)}L
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xs text-gray-600 mt-1">
                Across {data.length} regions
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {data.reduce((sum, region) => sum + region.activeUsers, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
              <div className="text-xs text-gray-600 mt-1">
                {((data.reduce((sum, region) => sum + region.activeUsers, 0) / data.reduce((sum, region) => sum + region.farmers, 0)) * 100).toFixed(1)}% adoption rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {(data.reduce((sum, region) => sum + region.performance.satisfaction, 0) / data.length).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Avg Satisfaction</div>
              <div className="text-xs text-gray-600 mt-1">
                Platform-wide rating
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Enhanced sample data for testing
export const sampleRegionData: RegionData[] = [
  {
    id: '1',
    name: 'Punjab',
    coordinates: [30.7333, 76.7794],
    farmers: 450,
    revenue: 1800000,
    growth: 15.2,
    activeUsers: 380,
    marketActivity: 156,
    infrastructure: {
      warehouses: 12,
      processingCenters: 8,
      distributionHubs: 15,
      servicePoints: 45
    },
    performance: {
      satisfaction: 92,
      efficiency: 88,
      adoption: 84,
      retention: 91
    },
    alerts: [
      { type: 'warning', message: 'Storage capacity reaching limit', severity: 'medium' }
    ],
    projects: [
      {
        id: 'p1',
        name: 'Smart Irrigation Network',
        type: 'technology',
        status: 'in_progress',
        priority: 'high',
        budget: 2500000,
        spent: 1800000,
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        manager: 'Rajesh Kumar',
        progress: 72,
        coordinates: [30.7333, 76.7794],
        impact: {
          farmersAffected: 180,
          expectedRevenue: 450000,
          completionRate: 72
        }
      },
      {
        id: 'p2',
        name: 'Warehouse Expansion',
        type: 'infrastructure',
        status: 'planning',
        priority: 'medium',
        budget: 1800000,
        spent: 200000,
        startDate: '2024-03-01',
        endDate: '2024-10-31',
        manager: 'Priya Singh',
        progress: 15,
        coordinates: [30.8333, 76.8794],
        impact: {
          farmersAffected: 120,
          expectedRevenue: 280000,
          completionRate: 15
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Haryana',
    coordinates: [29.0588, 76.0856],
    farmers: 320,
    revenue: 1450000,
    growth: 12.8,
    activeUsers: 290,
    marketActivity: 134,
    infrastructure: {
      warehouses: 8,
      processingCenters: 6,
      distributionHubs: 12,
      servicePoints: 32
    },
    performance: {
      satisfaction: 89,
      efficiency: 85,
      adoption: 81,
      retention: 88
    },
    alerts: [],
    projects: [
      {
        id: 'p3',
        name: 'Farmer Training Program',
        type: 'training',
        status: 'completed',
        priority: 'high',
        budget: 1200000,
        spent: 1150000,
        startDate: '2023-06-01',
        endDate: '2024-02-28',
        manager: 'Amit Sharma',
        progress: 100,
        coordinates: [29.0588, 76.0856],
        impact: {
          farmersAffected: 250,
          expectedRevenue: 320000,
          completionRate: 100
        }
      }
    ]
  },
  {
    id: '3',
    name: 'Gujarat',
    coordinates: [23.0225, 72.5714],
    farmers: 280,
    revenue: 1250000,
    growth: 18.5,
    activeUsers: 245,
    marketActivity: 98,
    infrastructure: {
      warehouses: 10,
      processingCenters: 7,
      distributionHubs: 14,
      servicePoints: 38
    },
    performance: {
      satisfaction: 94,
      efficiency: 91,
      adoption: 87,
      retention: 93
    },
    alerts: [
      { type: 'info', message: 'New market opportunities identified', severity: 'low' }
    ],
    projects: [
      {
        id: 'p4',
        name: 'Market Expansion Initiative',
        type: 'market_expansion',
        status: 'in_progress',
        priority: 'high',
        budget: 3200000,
        spent: 2100000,
        startDate: '2024-02-01',
        endDate: '2024-11-30',
        manager: 'Neha Patel',
        progress: 65,
        coordinates: [23.0225, 72.5714],
        impact: {
          farmersAffected: 200,
          expectedRevenue: 580000,
          completionRate: 65
        }
      }
    ]
  },
  {
    id: '4',
    name: 'Maharashtra',
    coordinates: [19.7515, 75.7139],
    farmers: 190,
    revenue: 950000,
    growth: 10.3,
    activeUsers: 165,
    marketActivity: 87,
    infrastructure: {
      warehouses: 6,
      processingCenters: 4,
      distributionHubs: 9,
      servicePoints: 25
    },
    performance: {
      satisfaction: 86,
      efficiency: 82,
      adoption: 78,
      retention: 85
    },
    alerts: [
      { type: 'error', message: 'Equipment maintenance required', severity: 'high' },
      { type: 'warning', message: 'Low adoption in rural areas', severity: 'medium' }
    ],
    projects: [
      {
        id: 'p5',
        name: 'Equipment Modernization',
        type: 'technology',
        status: 'on_hold',
        priority: 'medium',
        budget: 1500000,
        spent: 300000,
        startDate: '2024-01-01',
        endDate: '2024-08-31',
        manager: 'Suresh Patil',
        progress: 20,
        coordinates: [19.7515, 75.7139],
        impact: {
          farmersAffected: 95,
          expectedRevenue: 180000,
          completionRate: 20
        }
      }
    ]
  },
  {
    id: '5',
    name: 'Uttar Pradesh',
    coordinates: [26.8467, 80.9462],
    farmers: 520,
    revenue: 2100000,
    growth: 14.7,
    activeUsers: 445,
    marketActivity: 203,
    infrastructure: {
      warehouses: 15,
      processingCenters: 11,
      distributionHubs: 18,
      servicePoints: 58
    },
    performance: {
      satisfaction: 90,
      efficiency: 87,
      adoption: 85,
      retention: 89
    },
    alerts: [],
    projects: [
      {
        id: 'p6',
        name: 'Digital Platform Enhancement',
        type: 'technology',
        status: 'in_progress',
        priority: 'high',
        budget: 2800000,
        spent: 1950000,
        startDate: '2023-11-01',
        endDate: '2024-09-30',
        manager: 'Vikash Gupta',
        progress: 70,
        coordinates: [26.8467, 80.9462],
        impact: {
          farmersAffected: 350,
          expectedRevenue: 720000,
          completionRate: 70
        }
      }
    ]
  },
  {
    id: '6',
    name: 'Rajasthan',
    coordinates: [27.0238, 74.2179],
    farmers: 210,
    revenue: 890000,
    growth: 8.9,
    activeUsers: 178,
    marketActivity: 76,
    infrastructure: {
      warehouses: 7,
      processingCenters: 5,
      distributionHubs: 10,
      servicePoints: 28
    },
    performance: {
      satisfaction: 83,
      efficiency: 79,
      adoption: 75,
      retention: 82
    },
    alerts: [
      { type: 'warning', message: 'Water scarcity affecting operations', severity: 'high' }
    ],
    projects: [
      {
        id: 'p7',
        name: 'Water Conservation Project',
        type: 'infrastructure',
        status: 'planning',
        priority: 'high',
        budget: 2200000,
        spent: 150000,
        startDate: '2024-04-01',
        endDate: '2025-03-31',
        manager: 'Kavita Joshi',
        progress: 8,
        coordinates: [27.0238, 74.2179],
        impact: {
          farmersAffected: 180,
          expectedRevenue: 350000,
          completionRate: 8
        }
      }
    ]
  }
];

export default GeographicMap;
