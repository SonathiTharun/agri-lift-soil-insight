import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  ShoppingCart,
  Warehouse,
  BarChart3,
  MessageSquare,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  TrendingUp,
  FileText,
  Shield,
  Plus
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  description?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/executive-portal",
    icon: LayoutDashboard,
    description: "Overview and quick stats"
  },
  {
    title: "Quick Add",
    href: "/executive-portal/quick-add",
    icon: Plus,
    description: "Add products, fertilizers, pesticides"
  },
  {
    title: "Product Management",
    href: "/executive-portal/products",
    icon: Package,
    description: "Manage marketplace products"
  },
  {
    title: "Loan Schemes",
    href: "/executive-portal/loans",
    icon: CreditCard,
    description: "Agricultural loan offerings"
  },
  {
    title: "Order Management",
    href: "/executive-portal/orders",
    icon: ShoppingCart,
    badge: "12",
    description: "Track and manage orders"
  },
  {
    title: "Inventory",
    href: "/executive-portal/inventory",
    icon: Warehouse,
    description: "Stock levels and alerts"
  },
  {
    title: "Analytics",
    href: "/executive-portal/analytics",
    icon: BarChart3,
    description: "Business intelligence"
  },
  {
    title: "Support Center",
    href: "/executive-portal/support",
    icon: MessageSquare,
    badge: "5",
    description: "Farmer support tickets"
  },
  {
    title: "User Management",
    href: "/executive-portal/users",
    icon: Users,
    description: "Manage user accounts"
  }
];

const quickActions = [
  {
    title: "Performance",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Reports",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Security",
    icon: Shield,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Alerts",
    icon: Bell,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

export const ExecutiveSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/executive-portal") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Collapse Toggle */}
      <div className="absolute -right-3 top-6 z-50">
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 rounded-full p-0 bg-white border-gray-300"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          {!isCollapsed ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Executive Portal</h2>
              <p className="text-sm text-gray-600">AgriLift Management</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                  active
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  active ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                )} />
                
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge 
                        variant={active ? "secondary" : "default"}
                        className={cn(
                          "text-xs",
                          active ? "bg-white/20 text-white" : ""
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.title}
                    {item.badge && (
                      <span className="ml-2 bg-primary px-1 rounded">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.title}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-auto p-2 flex flex-col items-center gap-1",
                      action.bgColor,
                      "hover:opacity-80"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", action.color)} />
                    <span className={cn("text-xs font-medium", action.color)}>
                      {action.title}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Collapsed Quick Actions */}
        {isCollapsed && (
          <div className="p-2 border-t border-gray-200">
            <div className="space-y-2">
              {quickActions.slice(0, 2).map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.title}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full h-8 p-0 flex items-center justify-center group relative",
                      action.bgColor
                    )}
                  >
                    <Icon className={cn("h-4 w-4", action.color)} />
                    
                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {action.title}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!isCollapsed ? (
            <div className="text-xs text-gray-500 text-center">
              <p>AgriLift Executive Portal</p>
              <p>v2.0.0</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
