import { Link } from "react-router-dom";
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
  CheckCircle,
  ArrowRight
} from "lucide-react";

export const ExecutivePortalTest = () => {
  const modules = [
    {
      title: "Product Management",
      description: "Manage products, inventory, and catalog",
      icon: Package,
      path: "/executive-portal/products",
      status: "Active",
      color: "bg-blue-500"
    },
    {
      title: "Loan Management", 
      description: "Handle loan schemes and applications",
      icon: CreditCard,
      path: "/executive-portal/loans",
      status: "Active",
      color: "bg-green-500"
    },
    {
      title: "Order Management",
      description: "Track and manage customer orders",
      icon: ShoppingCart,
      path: "/executive-portal/orders", 
      status: "Active",
      color: "bg-purple-500"
    },
    {
      title: "Inventory Management",
      description: "Monitor stock levels and warehouse",
      icon: Warehouse,
      path: "/executive-portal/inventory",
      status: "Ready",
      color: "bg-orange-500"
    },
    {
      title: "Analytics Dashboard",
      description: "Business intelligence and reports",
      icon: BarChart3,
      path: "/executive-portal/analytics",
      status: "Active",
      color: "bg-indigo-500"
    },
    {
      title: "Support Center",
      description: "Customer support and tickets",
      icon: MessageSquare,
      path: "/executive-portal/support",
      status: "Ready",
      color: "bg-red-500"
    },
    {
      title: "User Management",
      description: "Manage user accounts and roles",
      icon: Users,
      path: "/executive-portal/users",
      status: "Ready", 
      color: "bg-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Executive Management Portal
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Comprehensive administrative access to AgriLift Soil Insight platform
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Backend APIs Ready
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Frontend Components Ready
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Database Models Ready
            </Badge>
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Card key={module.title} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${module.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge 
                      variant={module.status === "Active" ? "default" : "secondary"}
                      className={module.status === "Active" ? "bg-green-100 text-green-800" : ""}
                    >
                      {module.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{module.description}</p>
                  <Link to={module.path}>
                    <Button className="w-full group">
                      Access Module
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Implementation Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Implementation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-gray-600">Backend APIs</div>
                <div className="text-sm text-gray-500">All executive endpoints implemented</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">Frontend Components</div>
                <div className="text-sm text-gray-500">All portal components ready</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                <div className="text-gray-600">Database Integration</div>
                <div className="text-sm text-gray-500">MongoDB models and schemas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link to="/executive-portal">
                <Button variant="outline">Portal Dashboard</Button>
              </Link>
              <Link to="/executive-portal/products">
                <Button variant="outline">Product Management</Button>
              </Link>
              <Link to="/executive-portal/orders">
                <Button variant="outline">Order Management</Button>
              </Link>
              <Link to="/executive-portal/analytics">
                <Button variant="outline">Analytics</Button>
              </Link>
              <Link to="/">
                <Button variant="outline">Back to Main App</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
