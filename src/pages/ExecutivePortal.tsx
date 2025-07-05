import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { withAuth } from "@/contexts/AuthContext";
import { ExecutiveNavbar } from "@/components/ExecutiveNavbar";
import { ExecutiveSidebar } from "@/components/executive/ExecutiveSidebar";
import { ProductManagement } from "@/components/executive/ProductManagement";
import { LoanManagement } from "@/components/executive/LoanManagement";
import { OrderManagement } from "@/components/executive/OrderManagement";
import { InventoryManagement } from "@/components/executive/InventoryManagement";
import { SupportCenter } from "@/components/executive/SupportCenter";
import { UserManagement } from "@/components/executive/UserManagement";
import { ExecutiveAnalytics } from "@/components/executive/ExecutiveAnalytics";
import { QuickAddActions } from "@/components/executive/QuickAddActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  CreditCard, 
  ShoppingCart, 
  BarChart3, 
  MessageSquare, 
  Users,
  Warehouse,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/apiService";

interface DashboardStats {
  products: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    featuredProducts: number;
  };
  orders: Array<{
    _id: string;
    count: number;
    totalValue: number;
    avgOrderValue: number;
  }>;
  tickets: Array<{
    _id: string;
    count: number;
    avgResolutionTime: number;
  }>;
  users: Array<{
    _id: string;
    count: number;
    activeUsers: number;
  }>;
  revenue: Array<{
    _id: { year: number; month: number };
    totalRevenue: number;
    orderCount: number;
    avgOrderValue: number;
  }>;
}

const ExecutivePortalDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/executive/analytics/dashboard');
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getOrderStatusCount = (status: string) => {
    return stats?.orders.find(order => order._id === status)?.count || 0;
  };

  const getTicketStatusCount = (status: string) => {
    return stats?.tickets.find(ticket => ticket._id === status)?.count || 0;
  };

  const getTotalRevenue = () => {
    return stats?.revenue.reduce((total, month) => total + month.totalRevenue, 0) || 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Portal</h1>
          <p className="text-gray-600">Manage your AgriLift platform operations</p>
        </div>
        <Button onClick={fetchDashboardStats} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.products.totalProducts || 0}</div>
            <p className="text-xs opacity-80">
              {stats?.products.activeProducts || 0} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingCart className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getOrderStatusCount('pending')}</div>
            <p className="text-xs opacity-80">
              {getOrderStatusCount('processing')} processing
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageSquare className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTicketStatusCount('open')}</div>
            <p className="text-xs opacity-80">
              {getTicketStatusCount('in_progress')} in progress
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(getTotalRevenue() / 100000).toFixed(1)}L</div>
            <p className="text-xs opacity-80">
              {stats?.revenue.length || 0} months data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Urgent Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.products.lowStockProducts > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-800">Low Stock Alert</p>
                  <p className="text-sm text-red-600">{stats.products.lowStockProducts} products</p>
                </div>
                <Badge variant="destructive">{stats.products.lowStockProducts}</Badge>
              </div>
            )}
            
            {getTicketStatusCount('urgent') > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-800">Urgent Tickets</p>
                  <p className="text-sm text-orange-600">Require immediate attention</p>
                </div>
                <Badge variant="secondary">{getTicketStatusCount('urgent')}</Badge>
              </div>
            )}
            
            {getOrderStatusCount('pending') > 10 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-800">Pending Orders</p>
                  <p className="text-sm text-yellow-600">Need processing</p>
                </div>
                <Badge variant="outline">{getOrderStatusCount('pending')}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">Orders Delivered</p>
                <p className="text-sm text-green-600">This month</p>
              </div>
              <Badge variant="secondary">{getOrderStatusCount('delivered')}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-800">Tickets Resolved</p>
                <p className="text-sm text-blue-600">This month</p>
              </div>
              <Badge variant="secondary">{getTicketStatusCount('resolved')}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => window.location.href = '/executive-portal/products'}
            >
              <Package className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => window.location.href = '/executive-portal/loans'}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Create Loan Scheme
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => window.location.href = '/executive-portal/quick-add'}
            >
              <Plus className="h-4 w-4 mr-2" />
              Quick Add Actions
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => window.location.href = '/executive-portal/analytics'}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ExecutivePortal = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExecutiveNavbar />
      <div className="flex pt-16">
        <ExecutiveSidebar />
        <main className="flex-1 ml-64 p-6">
          <Routes>
            <Route path="/" element={<ExecutivePortalDashboard />} />
            <Route path="/quick-add" element={<QuickAddActions />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/loans" element={<LoanManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/inventory" element={<InventoryManagement />} />
            <Route path="/analytics" element={<ExecutiveAnalytics />} />
            <Route path="/support" element={<SupportCenter />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="*" element={<Navigate to="/executive-portal" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default withAuth(ExecutivePortal, 'executive');
