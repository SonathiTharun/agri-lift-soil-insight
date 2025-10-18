import React, { useState } from "react";
import {
  Zap,
  TrendingUp,
  Award,
  BarChart3,
  ArrowUpRight,
  Waves,
  Heart,
  Droplet,
  Bird,
  Leaf,
  CheckCircle,
  Milk,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const colors = {
    primary: "#3E8914",
    primaryDark: "#2D6A0F",
    secondary: "#F0F8E8",
    success: "#4CAF50",
    text: "#1A1A1A",
    textLight: "#505050",
    white: "#FFFFFF",
  };

  const metrics = [
    {
      id: "certified_acres",
      title: "Certified Acres",
      value: "85",
      unit: "acres",
      trend: "up",
      change: "+9%",
      icon: Leaf,
      bgColor: "#F0F8E8",
    },
    {
      id: "organic_yield",
      title: "Organic Yield",
      value: "1,650",
      unit: "kg/month",
      trend: "up",
      change: "+11%",
      icon: TrendingUp,
      bgColor: "#F0F8E8",
    },
    {
      id: "certification",
      title: "Certification",
      value: "Active",
      unit: "",
      trend: "neutral",
      change: "Valid",
      icon: CheckCircle,
      bgColor: "#F0F8E8",
    },
    {
      id: "revenue",
      title: "Revenue",
      value: "₹2.1L",
      unit: "",
      trend: "up",
      change: "+18%",
      icon: BarChart3,
      bgColor: "#F0F8E8",
    }
  ];

  const features = [
    {
      id: "crop_management",
      title: "Crop Management",
      description: "Manage organic crops",
      icon: "🌱",
      action: () => alert("Opening Crop Management..."),
    },
    {
      id: "organic_market",
      title: "Organic Market",
      description: "Sell certified organic produce",
      icon: "🥬",
      action: () => alert("Opening Organic Market..."),
    },
    {
      id: "certification",
      title: "Certification",
      description: "Maintain organic certification",
      icon: "✅",
      action: () => alert("Opening Certification..."),
    },
    {
      id: "soil_health",
      title: "Soil Health",
      description: "Monitor soil quality",
      icon: "🌍",
      action: () => alert("Opening Soil Health..."),
    },
    {
      id: "market_trends",
      title: "Market Trends",
      description: "Organic produce prices",
      icon: "📊",
      action: () => alert("Opening Market Trends..."),
    },
    {
      id: "expert_guidance",
      title: "Expert Guidance",
      description: "Connect with organic experts",
      icon: "👨‍⚕️",
      action: () => alert("Opening Expert Guidance..."),
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary }}>
      {/* Hero Section */}
      <div
        className="py-12 px-4"
        style={{ backgroundColor: colors.primaryDark }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            Grow Certified Organic
          </h1>
          <p className="text-white text-opacity-90 text-lg">
            Complete organic farming platform. Manage certified crops, connect with buyers, and maintain standards.
          </p>
          <div
            className="mt-4 h-1 w-24 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Metrics Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.id}
                  className="rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer"
                  style={{ backgroundColor: colors.white }}
                  onClick={() => setSelectedMetric(metric.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: metric.bgColor }}
                    >
                      <Icon
                        size={24}
                        style={{ color: colors.primary }}
                      />
                    </div>
                    {metric.trend === "up" ? (
                      <ArrowUpRight size={20} style={{ color: colors.success }} />
                    ) : (
                      <span style={{ color: colors.textLight }}>→</span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium" style={{ color: colors.textLight }}>
                    {metric.title}
                  </h3>
                  <p className="text-2xl font-bold mt-2" style={{ color: colors.text }}>
                    {metric.value}
                    <span className="text-sm ml-1" style={{ color: colors.textLight }}>
                      {metric.unit}
                    </span>
                  </p>
                  <p
                    className="text-sm mt-2 font-medium"
                    style={{ color: metric.trend === "up" ? colors.success : colors.textLight }}
                  >
                    {metric.change}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => {
                  setSelectedFeature(feature.id);
                  feature.action();
                }}
                className="rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer group text-left"
                style={{ backgroundColor: colors.white, border: "none" }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
                  {feature.title}
                </h3>
                <p className="text-sm" style={{ color: colors.textLight }}>
                  {feature.description}
                </p>
                <div
                  className="mt-4 h-1 w-0 group-hover:w-full transition-all duration-300 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
