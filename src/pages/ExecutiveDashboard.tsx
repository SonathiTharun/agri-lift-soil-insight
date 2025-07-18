import { useState, useEffect } from "react";
import { ExecutiveNavbar } from "@/components/ExecutiveNavbar";
import { withAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Tractor,
  User,
  Calendar,
  Bell,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Zap,
  Download,
  Filter,
  RefreshCw,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import new components
import {
  RevenueTrendChart,
  UserEngagementChart,
  MarketDistributionChart,
  PerformanceMetricsChart,
  KPICard
} from "@/components/executive/charts/AdvancedCharts";
import { GeographicMap, sampleRegionData } from "@/components/executive/charts/GeographicMap";
import GeographicDashboard from "@/components/executive/GeographicDashboard";
import NotificationCenter from "@/components/executive/notifications/NotificationCenter";
import QuickActions from "@/components/executive/dashboard/QuickActions";
import QuickAddModal from "@/components/executive/dashboard/QuickAddModal";
import AssignTaskModal from "@/components/executive/dashboard/AssignTaskModal";

interface DashboardMetrics {
  totalFarmers: number;
  activeFarmers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  pendingLoans: number;
  marketOrders: number;
  machineryBookings: number;
  laborRequests: number;
}

interface RecentActivity {
  id: number;
  type: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'failed';
}

const ExecutiveDashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalFarmers: 1247,
    activeFarmers: 892,
    totalRevenue: 2450000,
    monthlyGrowth: 15.3,
    pendingLoans: 23,
    marketOrders: 156,
    machineryBookings: 78,
    laborRequests: 34
  });

  // Enhanced metrics for comprehensive dashboard
  const [enhancedMetrics, setEnhancedMetrics] = useState({
    userEngagement: {
      dailyActiveUsers: 1156,
      weeklyActiveUsers: 4523,
      monthlyActiveUsers: 12847,
      avgSessionDuration: 24.5,
      bounceRate: 12.3
    },
    financial: {
      totalRevenue: 2450000,
      monthlyRevenue: 485000,
      profitMargin: 23.5,
      operatingExpenses: 1875000,
      netProfit: 575000,
      revenueGrowth: 15.3
    },
    platform: {
      totalTransactions: 8945,
      successRate: 98.7,
      averageOrderValue: 2750,
      customerSatisfaction: 4.8,
      systemUptime: 99.9
    },
    geographic: {
      topRegions: sampleRegionData,
      totalRegions: 28,
      newRegions: 3
    }
  });

  // Chart data for revenue trends
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (₹L)',
        data: [18.5, 22.3, 19.8, 25.1, 28.7, 24.5],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Target (₹L)',
        data: [20, 22, 24, 26, 28, 30],
        borderColor: '#94a3b8',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        fill: false
      }
    ]
  };

  // User engagement chart data
  const userEngagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [1200, 1350, 1180, 1420, 1380, 980, 850],
        backgroundColor: [
          '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16', '#064e3b'
        ],
        borderRadius: 4
      }
    ]
  };

  // Market distribution data
  const marketDistributionData = {
    labels: ['Seeds & Fertilizers', 'Machinery', 'Labor Services', 'Crop Sales', 'Loans'],
    datasets: [
      {
        data: [35, 25, 15, 20, 5],
        backgroundColor: [
          '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'
        ],
        borderWidth: 2
      }
    ]
  };

  // Performance metrics data
  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'System Performance',
        data: [95, 97, 94, 98],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true
      },
      {
        label: 'User Satisfaction',
        data: [4.6, 4.7, 4.5, 4.8],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        yAxisID: 'y1'
      }
    ]
  };

  const performanceOptions = {
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        max: 100,
        min: 0
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        max: 5,
        min: 0,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    { id: 1, type: 'farmer_registration', message: 'New farmer registered: Rajesh Kumar', time: '2 hours ago', priority: 'medium', status: 'completed' },
    { id: 2, type: 'loan_application', message: 'Loan application submitted by Priya Sharma', time: '4 hours ago', priority: 'high', status: 'pending' },
    { id: 3, type: 'market_order', message: 'Large order placed for seeds (₹50,000)', time: '6 hours ago', priority: 'medium', status: 'completed' },
    { id: 4, type: 'machinery_booking', message: 'Tractor booked for next week', time: '8 hours ago', priority: 'low', status: 'completed' }
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeFarmers: prev.activeFarmers + Math.floor(Math.random() * 3),
        marketOrders: prev.marketOrders + Math.floor(Math.random() * 2)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickAction = (action: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Action Completed",
        description: `${action} has been initiated successfully.`,
      });
      
      // Add new activity
      const newActivity: RecentActivity = {
        id: Date.now(),
        type: 'admin_action',
        message: `Executive performed: ${action}`,
        time: 'Just now',
        priority: 'high',
        status: 'completed'
      };
      
      setRecentActivities(prev => [newActivity, ...prev.slice(0, 3)]);
    }, 2000);
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    setIsLoading(true);
    
    setTimeout(() => {
      // Simulate data refresh
      setMetrics(prev => ({
        ...prev,
        monthlyGrowth: timeframe === 'year' ? 25.8 : timeframe === 'week' ? 8.2 : 15.3
      }));
      setIsLoading(false);
    }, 1000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleExport = async () => {
    setExporting(true);

    try {
      // Simulate data preparation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create comprehensive export data
      const exportData = {
        timestamp: new Date().toISOString(),
        timeframe: selectedTimeframe,
        metrics: enhancedMetrics,
        summary: {
          totalFarmers: 1247,
          totalRevenue: enhancedMetrics.financial.totalRevenue,
          systemUptime: enhancedMetrics.platform.systemUptime,
          exportedBy: "Executive Dashboard"
        }
      };

      // Create CSV format for easier analysis
      const csvData = [
        ['Metric', 'Value', 'Period'],
        ['Total Revenue', `₹${enhancedMetrics.financial.totalRevenue.toLocaleString()}`, selectedTimeframe],
        ['Monthly Revenue', `₹${enhancedMetrics.financial.monthlyRevenue.toLocaleString()}`, 'Current Month'],
        ['Daily Active Users', enhancedMetrics.userEngagement.dailyActiveUsers.toString(), 'Today'],
        ['System Uptime', `${enhancedMetrics.platform.systemUptime}%`, 'Current'],
        ['Customer Satisfaction', enhancedMetrics.platform.customerSatisfaction.toString(), 'Average'],
        ['Total Transactions', enhancedMetrics.platform.totalTransactions.toString(), selectedTimeframe]
      ].map(row => row.join(',')).join('\n');

      // Create and download CSV file
      const csvBlob = new Blob([csvData], { type: 'text/csv' });
      const csvUrl = URL.createObjectURL(csvBlob);
      const csvLink = document.createElement('a');
      csvLink.href = csvUrl;
      csvLink.download = `executive-dashboard-${selectedTimeframe}-${new Date().toISOString().split('T')[0]}.csv`;
      csvLink.click();

      toast({
        title: "Export Complete",
        description: "Dashboard analytics exported as CSV file.",
        duration: 4000
      });
    } catch (e) {
      toast({
        title: "Export Failed",
        description: "An error occurred during export. Please try again.",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  if (isLoading && metrics.totalFarmers === 1247) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-foliage-light via-sky-light to-wheat-light">
        <ExecutiveNavbar />
        <div className="pt-20 lg:pt-24">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center animate-pulse">
                <Activity className="h-12 w-12 mx-auto mb-4 text-foliage-dark animate-spin" />
                <h2 className="text-xl font-semibold text-foliage-dark mb-2">Loading Executive Dashboard</h2>
                <p className="text-sky-dark">Fetching latest platform data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <ExecutiveNavbar />
      <div className="pt-20 lg:pt-24 animate-fade-in">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12 animate-slide-in">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-8">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 bg-clip-text text-transparent drop-shadow-sm tracking-tight">
                    Executive Dashboard
                  </h1>
                </div>
                <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
                <div>
                  <p className="text-slate-700 text-lg font-semibold tracking-wide">
                    Monitor and manage AgriLift platform operations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200/50 shadow-sm">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
                <span className="text-sm font-medium text-slate-600">
                  Live data • Updated {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border-slate-300 hover:bg-emerald-50 hover:border-emerald-400 hover:scale-105 transition-all duration-300 shadow-sm font-medium"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border-slate-300 hover:bg-blue-50 hover:border-blue-400 hover:scale-105 transition-all duration-300 shadow-sm font-medium"
                  onClick={handleExport}
                  disabled={exporting}
                >
                  <Download className="h-4 w-4" />
                  {exporting ? "Exporting..." : "Export"}
                </Button>
                <Button
                  onClick={() => handleQuickAction("System Health Check")}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-sm font-semibold"
                  disabled={isLoading}
                  size="sm"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Health Check
                </Button>
                <Button
                  onClick={() => handleQuickAction("Generate Report")}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-sm font-semibold"
                  disabled={isLoading}
                  size="sm"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button
                  onClick={() => setShowQuickAdd(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border-slate-300 hover:bg-purple-50 hover:border-purple-400 hover:scale-105 transition-all duration-300 shadow-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Quick Add
                </Button>
              </div>

              {/* Timeframe Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">Period:</span>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => handleTimeframeChange(e.target.value)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl bg-white/90 backdrop-blur-sm text-slate-700 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 hover:bg-white transition-all duration-300 shadow-sm font-medium"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Enhanced Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="executive-kpi-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <KPICard
                title={t("total-farmers")}
                value={metrics.totalFarmers.toLocaleString()}
                subtitle={`${metrics.activeFarmers} ${t('active-farmers')} this month`}
                icon={Users}
                color="text-emerald-600"
                trend={{ value: 12.5, label: "this month" }}
                className="border-0 shadow-none bg-transparent"
              />
            </div>
            <div className="executive-kpi-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <KPICard
                title={t("total-revenue")}
                value={`₹${(enhancedMetrics.financial.totalRevenue / 100000).toFixed(1)}L`}
                subtitle={`₹${(enhancedMetrics.financial.monthlyRevenue / 100000).toFixed(1)}L this month`}
                icon={DollarSign}
                color="text-blue-600"
                trend={{ value: enhancedMetrics.financial.revenueGrowth, label: "monthly growth" }}
                className="border-0 shadow-none bg-transparent"
              />
            </div>
            <div className="executive-kpi-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <KPICard
                title="Platform Performance"
                value={`${enhancedMetrics.platform.successRate}%`}
                subtitle={`${enhancedMetrics.platform.systemUptime}% uptime`}
                icon={Activity}
                color="text-purple-600"
                trend={{ value: 2.3, label: "improvement" }}
                className="border-0 shadow-none bg-transparent"
              />
            </div>
            <div className="executive-kpi-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <KPICard
                title="Customer Satisfaction"
                value={`${enhancedMetrics.platform.customerSatisfaction}/5`}
                subtitle={`${enhancedMetrics.platform.totalTransactions} transactions`}
                icon={CheckCircle}
                color="text-orange-600"
                trend={{ value: 4.2, label: "rating increase" }}
                className="border-0 shadow-none bg-transparent"
              />
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="executive-kpi-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <KPICard
                title={t("pending-loans")}
                value={metrics.pendingLoans.toString()}
                subtitle="Requiring approval"
                icon={TrendingUp}
                color="text-red-600"
                className="border-0 shadow-none bg-transparent"
              />
            </div>
            <div className="executive-kpi-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <KPICard
                title={t("market-orders")}
                value={metrics.marketOrders.toString()}
                subtitle="Active orders"
                icon={ShoppingCart}
                color="text-green-600"
                className="border-0 shadow-none bg-transparent"
              />
            </div>
            <div className="executive-kpi-card animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <KPICard
                title="Daily Active Users"
                value={enhancedMetrics.userEngagement.dailyActiveUsers.toLocaleString()}
                subtitle={`${enhancedMetrics.userEngagement.avgSessionDuration}min avg session`}
                icon={Users}
                color="text-indigo-600"
                trend={{ value: 8.7, label: "daily growth" }}
                className="border-0 shadow-none bg-transparent"
              />
            </div>
            <div className="executive-kpi-card animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <KPICard
                title="Geographic Reach"
                value={enhancedMetrics.geographic.totalRegions.toString()}
                subtitle={`${enhancedMetrics.geographic.newRegions} new regions`}
                icon={MapPin}
                color="text-teal-600"
                trend={{ value: 15.2, label: "expansion" }}
                className="border-0 shadow-none bg-transparent"
              />
            </div>
          </div>

          {/* System Alerts */}
          <div className="mb-12 animate-slide-in">
            <Alert className="border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm rounded-2xl shadow-sm">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-800 font-medium">
                <strong className="text-amber-900">System Maintenance:</strong> Scheduled maintenance window tomorrow 2:00 AM - 4:00 AM IST
              </AlertDescription>
            </Alert>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-2 shadow-sm">
              <TabsTrigger
                value="overview"
                className="transition-all duration-300 hover:scale-105 flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="transition-all duration-300 hover:scale-105 flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <PieChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="geographic"
                className="transition-all duration-300 hover:scale-105 flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <MapPin className="h-4 w-4" />
                Geographic
              </TabsTrigger>
              <TabsTrigger
                value="quickActions"
                className="transition-all duration-300 hover:scale-105 flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <Zap className="h-4 w-4" />
                Quick Actions
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="transition-all duration-300 hover:scale-105 flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activities */}
                <Card className="executive-chart-card border-0 shadow-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                      <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white">
                        <Bell className="h-5 w-5" />
                      </div>
                      {t('recent-activities')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={activity.id} className={`flex items-start justify-between p-4 rounded-2xl border border-slate-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-slide-in bg-gradient-to-r ${getPriorityColor(activity.priority)}`} style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex-1 flex items-start gap-3">
                            <div className="p-1.5 bg-white/80 rounded-lg">
                              {getStatusIcon(activity.status)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{activity.message}</p>
                              <p className="text-xs text-slate-600 mt-1">{activity.time}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-2 capitalize bg-white/80 border-slate-200 text-slate-700">
                            {activity.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card className="executive-chart-card border-0 shadow-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                        <Activity className="h-5 w-5" />
                      </div>
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        { label: "Platform Uptime", value: 99.8, color: "bg-gradient-to-r from-emerald-500 to-emerald-600", bgColor: "bg-emerald-100" },
                        { label: "Database Performance", value: 96.2, color: "bg-gradient-to-r from-blue-500 to-blue-600", bgColor: "bg-blue-100" },
                        { label: "API Response Time", value: 85, color: "bg-gradient-to-r from-purple-500 to-purple-600", bgColor: "bg-purple-100", unit: "142ms avg" }
                      ].map((stat, index) => (
                        <div key={stat.label} className="animate-slide-in p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200" style={{ animationDelay: `${index * 200}ms` }}>
                          <div className="flex justify-between items-center text-sm mb-3">
                            <span className="font-semibold text-slate-700">{stat.label}</span>
                            <span className="font-bold text-slate-800 bg-white px-2 py-1 rounded-lg">{stat.unit || `${stat.value}%`}</span>
                          </div>
                          <div className="relative">
                            <div className={`h-3 rounded-full ${stat.bgColor}`}>
                              <div
                                className={`h-3 rounded-full ${stat.color} transition-all duration-1000 ease-out`}
                                style={{ width: `${stat.value}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="quickActions" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Perform common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: "Approve Pending Loans", icon: TrendingUp, action: "Approve All Pending Loans", color: "bg-foliage-500 hover:bg-foliage-600" },
                      { label: "Send Weekly Report", icon: User, action: "Send Weekly Report", color: "bg-foliage-500 hover:bg-foliage-600" },
                      { label: "Schedule Maintenance", icon: Tractor, action: "System Maintenance", color: "bg-foliage-500 hover:bg-foliage-600" }
                    ].map((item, index) => (
                      <Button 
                        key={item.label}
                        className={`h-20 flex flex-col ${item.color} text-foliage-50 hover:scale-105 transition-all animate-scale-in`}
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => handleQuickAction(item.action)}
                        disabled={isLoading}
                      >
                        <item.icon className="h-6 w-6 mb-2" />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-foliage-50 rounded-lg">
                        <span className="font-medium">Machinery Utilization</span>
                        <span className="text-foliage-600 font-semibold">78%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-foliage-50 rounded-lg">
                        <span className="font-medium">Labor Efficiency</span>
                        <span className="text-foliage-600 font-semibold">85%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-foliage-50 rounded-lg">
                        <span className="font-medium">Market Success Rate</span>
                        <span className="text-foliage-600 font-semibold">92%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Regional Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { region: "Punjab", percentage: 35, color: "bg-foliage-500" },
                        { region: "Haryana", percentage: 25, color: "bg-foliage-500" },
                        { region: "Gujarat", percentage: 20, color: "bg-foliage-500" },
                        { region: "Others", percentage: 20, color: "bg-foliage-500" }
                      ].map((item, index) => (
                        <div key={item.region} className="animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.region}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-foliage-200 rounded-full h-2">
                            <div 
                              className={`${item.color} h-2 rounded-full transition-all duration-1000`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab with Enhanced Charts */}
            <TabsContent value="analytics" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueTrendChart
                  title="Revenue Trends"
                  data={revenueChartData}
                  showTrend={true}
                  trendValue={enhancedMetrics.financial.revenueGrowth}
                  trendLabel="monthly growth"
                />
                <UserEngagementChart
                  title="User Engagement"
                  data={userEngagementData}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MarketDistributionChart
                  title="Market Distribution"
                  data={marketDistributionData}
                />
                <PerformanceMetricsChart
                  title="Performance Metrics"
                  data={performanceData}
                  options={performanceOptions}
                />
              </div>
            </TabsContent>

            {/* Enhanced Geographic Dashboard Tab */}
            <TabsContent value="geographic" className="animate-fade-in">
              <div className="bg-gray-50 -m-6 min-h-screen">
                <GeographicDashboard />
              </div>
            </TabsContent>

            {/* Quick Actions Tab */}
            <TabsContent value="quickActions" className="space-y-6 animate-fade-in">
              <QuickActions onAssignTask={() => setShowAssignTask(true)} />
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6 animate-fade-in">
              <NotificationCenter />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {showQuickAdd && <QuickAddModal open={showQuickAdd} onClose={() => setShowQuickAdd(false)} />}
      {showAssignTask && <AssignTaskModal open={showAssignTask} onClose={() => setShowAssignTask(false)} />}
    </div>
  );
};

export default withAuth(ExecutiveDashboard, 'executive');
