import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  LineChart,
  Download,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/apiService";

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    monthly: Array<{ month: string; amount: number }>;
  };
  orders: {
    total: number;
    growth: number;
    byStatus: Array<{ status: string; count: number }>;
  };
  customers: {
    total: number;
    growth: number;
    active: number;
  };
  products: {
    total: number;
    topSelling: Array<{ name: string; sales: number }>;
  };
}

export const ExecutiveAnalytics = () => {
  const { toast } = useToast();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/executive/analytics/dashboard');
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      // Use mock data for now
      setData({
        revenue: {
          total: 1250000,
          growth: 12.5,
          monthly: [
            { month: 'Jan', amount: 95000 },
            { month: 'Feb', amount: 105000 },
            { month: 'Mar', amount: 125000 },
            { month: 'Apr', amount: 115000 },
            { month: 'May', amount: 135000 },
            { month: 'Jun', amount: 145000 }
          ]
        },
        orders: {
          total: 1234,
          growth: 8.2,
          byStatus: [
            { status: 'completed', count: 856 },
            { status: 'pending', count: 234 },
            { status: 'processing', count: 144 }
          ]
        },
        customers: {
          total: 856,
          growth: 15.3,
          active: 742
        },
        products: {
          total: 342,
          topSelling: [
            { name: 'Organic Fertilizer', sales: 156 },
            { name: 'Seeds - Wheat', sales: 134 },
            { name: 'Pesticide Spray', sales: 98 }
          ]
        }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Business intelligence and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(data?.revenue.total || 0).toLocaleString()}</div>
            <p className="text-xs text-green-600">
              +{data?.revenue.growth || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.orders.total || 0}</div>
            <p className="text-xs text-blue-600">
              +{data?.orders.growth || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.customers.total || 0}</div>
            <p className="text-xs text-purple-600">
              +{data?.customers.growth || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.products.total || 0}</div>
            <p className="text-xs text-orange-600">
              Active inventory
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Revenue chart will be displayed here</p>
                <p className="text-sm text-gray-500 mt-1">
                  Monthly revenue: ₹{((data?.revenue.total || 0) / 6).toLocaleString()} avg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Order distribution chart will be displayed here</p>
                <div className="flex justify-center gap-4 mt-2">
                  {data?.orders.byStatus.map((status, index) => (
                    <div key={status.status} className="text-xs">
                      <Badge variant="outline">{status.status}: {status.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.products.topSelling.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                </div>
                <Badge variant="outline">{product.sales} units</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Analytics Placeholder */}
      <Card>
        <CardContent className="p-12 text-center">
          <LineChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
          <p className="text-gray-600 mb-4">
            More comprehensive analytics and reporting features are coming soon.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline">Customer Insights</Badge>
            <Badge variant="outline">Product Performance</Badge>
            <Badge variant="outline">Geographic Analysis</Badge>
            <Badge variant="outline">Predictive Analytics</Badge>
            <Badge variant="outline">ROI Analysis</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
