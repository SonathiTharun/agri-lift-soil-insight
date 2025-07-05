import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Package, 
  Sprout, 
  Bug, 
  Wrench, 
  Droplets,
  Tractor,
  Leaf,
  Heart,
  CreditCard,
  ShoppingCart,
  Users,
  MessageSquare,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickAddActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Add Fertilizers",
      description: "NPK, Organic, Liquid fertilizers",
      icon: Sprout,
      color: "bg-green-500",
      action: () => navigate("/executive-portal/products?category=fertilizers&action=add"),
      category: "Products"
    },
    {
      title: "Add Pesticides", 
      description: "Insecticides, Herbicides, Fungicides",
      icon: Bug,
      color: "bg-red-500",
      action: () => navigate("/executive-portal/products?category=pesticides&action=add"),
      category: "Products"
    },
    {
      title: "Add Seeds",
      description: "Crop seeds, Saplings, Varieties",
      icon: Package,
      color: "bg-yellow-500",
      action: () => navigate("/executive-portal/products?category=seeds&action=add"),
      category: "Products"
    },
    {
      title: "Add Farm Tools",
      description: "Hand tools, Equipment, Implements",
      icon: Wrench,
      color: "bg-blue-500",
      action: () => navigate("/executive-portal/products?category=tools&action=add"),
      category: "Products"
    },
    {
      title: "Add Irrigation",
      description: "Drip systems, Sprinklers, Pipes",
      icon: Droplets,
      color: "bg-cyan-500",
      action: () => navigate("/executive-portal/products?category=irrigation&action=add"),
      category: "Products"
    },
    {
      title: "Add Machinery",
      description: "Tractors, Harvesters, Tillers",
      icon: Tractor,
      color: "bg-purple-500",
      action: () => navigate("/executive-portal/products?category=machinery&action=add"),
      category: "Products"
    },
    {
      title: "Add Organic Products",
      description: "Bio-fertilizers, Organic pesticides",
      icon: Leaf,
      color: "bg-emerald-500",
      action: () => navigate("/executive-portal/products?category=organic&action=add"),
      category: "Products"
    },
    {
      title: "Add Livestock Products",
      description: "Animal feed, Veterinary supplies",
      icon: Heart,
      color: "bg-pink-500",
      action: () => navigate("/executive-portal/products?category=livestock&action=add"),
      category: "Products"
    },
    {
      title: "Add Loan Scheme",
      description: "Agricultural loans, Credit facilities",
      icon: CreditCard,
      color: "bg-indigo-500",
      action: () => navigate("/executive-portal/loans?action=add"),
      category: "Financial"
    },
    {
      title: "Process Orders",
      description: "Manage pending orders",
      icon: ShoppingCart,
      color: "bg-orange-500",
      action: () => navigate("/executive-portal/orders"),
      category: "Operations"
    },
    {
      title: "Add Users",
      description: "Register farmers, executives",
      icon: Users,
      color: "bg-teal-500",
      action: () => navigate("/executive-portal/users?action=add"),
      category: "Management"
    },
    {
      title: "Handle Support",
      description: "Farmer queries, Technical issues",
      icon: MessageSquare,
      color: "bg-rose-500",
      action: () => navigate("/executive-portal/support"),
      category: "Support"
    }
  ];

  const categories = ["All", "Products", "Financial", "Operations", "Management", "Support"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredActions = selectedCategory === "All" 
    ? quickActions 
    : quickActions.filter(action => action.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Add Actions</h2>
        <p className="text-gray-600">Quickly add products, manage operations, and handle administrative tasks</p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {action.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                <Button 
                  className="w-full group-hover:bg-primary/90 transition-colors"
                  onClick={action.action}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Add
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">Product Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600">Quick Actions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">4</div>
              <div className="text-sm text-gray-600">Management Areas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">Ready to Use</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
