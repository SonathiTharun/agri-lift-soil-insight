#!/usr/bin/env python3
"""
Create professional farming hub pages with hamburger menu and professional UI
"""

import os

# Hub configurations
HUBS = {
    "dairy-lift": {
        "emoji": "🥛",
        "name": "Dairy Lift",
        "tagline": "Maximize Your Dairy Profits",
        "description": "Everything you need to manage, buy, and sell dairy products.",
        "primary": "#A4C8F0",
        "primaryDark": "#0D3B66",
        "secondary": "#E8F4FD",
        "metrics": [
            ("Active Cattle", "245", "heads", "up", "+12%", "Milk"),
            ("Milk Yield", "1,850", "L/day", "up", "+8%", "TrendingUp"),
            ("Quality Grade", "A+", "", "neutral", "Excellent", "Award"),
            ("Revenue", "₹2.4L", "", "up", "+15%", "BarChart3"),
        ],
        "features": [
            ("Livestock Market", "Find and sell quality cattle with verified buyers", "🐄"),
            ("Milk Production", "Track yield, quality metrics, and production trends", "🥛"),
            ("Equipment Mart", "Browse and purchase farming machinery", "🔧"),
            ("Cattle Management", "Health records, vaccination schedules, breeding info", "📋"),
            ("Market Trends", "Real-time price updates and market analysis", "📊"),
            ("Expert Consultation", "Connect with veterinarians and dairy experts", "👨‍⚕️"),
        ],
    },
    "bee-farming": {
        "emoji": "🐝",
        "name": "Bee Farming Hub",
        "tagline": "Maximize Your Honey Production",
        "description": "Complete beekeeping management platform. Track colonies, sell honey, and connect with experts.",
        "primary": "#F7C948",
        "primaryDark": "#E2A100",
        "secondary": "#FFFACD",
        "metrics": [
            ("Active Colonies", "156", "colonies", "up", "+9%", "Zap"),
            ("Honey Yield", "2,340", "kg/month", "up", "+14%", "TrendingUp"),
            ("Colony Health", "Excellent", "", "neutral", "All Good", "Heart"),
            ("Revenue", "₹1.8L", "", "up", "+11%", "BarChart3"),
        ],
        "features": [
            ("Bee Colonies", "Manage and monitor your bee colonies", "🐝"),
            ("Honey Market", "Sell honey to verified buyers", "🍯"),
            ("Equipment", "Purchase beekeeping equipment", "🔧"),
            ("Health Tracking", "Monitor colony health and diseases", "📋"),
            ("Market Trends", "Real-time honey price updates", "📊"),
            ("Expert Advice", "Connect with beekeeping experts", "👨‍⚕️"),
        ],
    },
    "marine-farming": {
        "emoji": "🌊",
        "name": "Marine Hub",
        "tagline": "Optimize Your Aquaculture",
        "description": "Complete marine farming platform. Manage ponds, track water quality, and sell seafood.",
        "primary": "#0077B6",
        "primaryDark": "#005A8D",
        "secondary": "#E0F7FF",
        "metrics": [
            ("Active Ponds", "12", "ponds", "up", "+3%", "Waves"),
            ("Fish Yield", "3,200", "kg/month", "up", "+18%", "TrendingUp"),
            ("Water Quality", "Optimal", "", "neutral", "Perfect", "Droplet"),
            ("Revenue", "₹3.2L", "", "up", "+22%", "BarChart3"),
        ],
        "features": [
            ("Pond Management", "Monitor and manage your fish ponds", "🌊"),
            ("Seafood Market", "Sell fresh seafood to buyers", "🐟"),
            ("Water Quality", "Track pH, oxygen, and temperature", "💧"),
            ("Feed Management", "Optimize fish feed and nutrition", "🥗"),
            ("Market Trends", "Real-time seafood prices", "📊"),
            ("Expert Support", "Connect with aquaculture experts", "👨‍⚕️"),
        ],
    },
    "poultry-farming": {
        "emoji": "🐔",
        "name": "Poultry Hub",
        "tagline": "Boost Your Poultry Production",
        "description": "Complete poultry farming platform. Manage flocks, track egg production, and connect with buyers.",
        "primary": "#E76F51",
        "primaryDark": "#D45A3A",
        "secondary": "#FFF3E6",
        "metrics": [
            ("Active Flocks", "8", "flocks", "up", "+5%", "Bird"),
            ("Egg Yield", "4,500", "eggs/day", "up", "+12%", "TrendingUp"),
            ("Flock Health", "Healthy", "", "neutral", "Excellent", "Heart"),
            ("Revenue", "₹2.8L", "", "up", "+16%", "BarChart3"),
        ],
        "features": [
            ("Flock Management", "Manage your poultry flocks", "🐔"),
            ("Egg Market", "Sell eggs to verified buyers", "🥚"),
            ("Feed Supply", "Purchase quality poultry feed", "🌾"),
            ("Health Monitoring", "Track flock health and diseases", "📋"),
            ("Market Trends", "Real-time egg prices", "📊"),
            ("Veterinary Support", "Connect with poultry vets", "👨‍⚕️"),
        ],
    },
    "organic-farming": {
        "emoji": "🌱",
        "name": "Organic Hub",
        "tagline": "Grow Certified Organic",
        "description": "Complete organic farming platform. Manage certified crops, connect with buyers, and maintain standards.",
        "primary": "#3E8914",
        "primaryDark": "#2D6A0F",
        "secondary": "#F0F8E8",
        "metrics": [
            ("Certified Acres", "85", "acres", "up", "+9%", "Leaf"),
            ("Organic Yield", "1,650", "kg/month", "up", "+11%", "TrendingUp"),
            ("Certification", "Active", "", "neutral", "Valid", "CheckCircle"),
            ("Revenue", "₹2.1L", "", "up", "+18%", "BarChart3"),
        ],
        "features": [
            ("Crop Management", "Manage organic crops", "🌱"),
            ("Organic Market", "Sell certified organic produce", "🥬"),
            ("Certification", "Maintain organic certification", "✅"),
            ("Soil Health", "Monitor soil quality", "🌍"),
            ("Market Trends", "Organic produce prices", "📊"),
            ("Expert Guidance", "Connect with organic experts", "👨‍⚕️"),
        ],
    },
    "crop-farming": {
        "emoji": "🌾",
        "name": "Crop Hub",
        "tagline": "Maximize Your Crop Yield",
        "description": "Complete crop farming platform. Manage fields, track weather, and optimize harvests.",
        "primary": "#E8C547",
        "primaryDark": "#D4A830",
        "secondary": "#FFFEF0",
        "metrics": [
            ("Active Fields", "42", "fields", "up", "+7%", "Leaf"),
            ("Crop Yield", "3,800", "kg/season", "up", "+13%", "TrendingUp"),
            ("Soil Health", "Good", "", "neutral", "Optimal", "Droplet"),
            ("Revenue", "₹3.5L", "", "up", "+19%", "BarChart3"),
        ],
        "features": [
            ("Field Management", "Manage your crop fields", "🌾"),
            ("Crop Market", "Sell crops to buyers", "🌽"),
            ("Equipment", "Purchase farming equipment", "🚜"),
            ("Weather Tracking", "Monitor weather patterns", "⛅"),
            ("Market Trends", "Real-time crop prices", "📊"),
            ("Agricultural Support", "Connect with experts", "👨‍⚕️"),
        ],
    },
}

def create_dashboard(hub_key, hub_config):
    """Create Dashboard.tsx for a hub"""
    path = f"src/pages/{hub_key}/Dashboard.tsx"

    metrics_code = ",\n    ".join([
        '{' + f'\n      id: "{metric[0].lower().replace(" ", "_")}",\n      title: "{metric[0]}",\n      value: "{metric[1]}",\n      unit: "{metric[2]}",\n      trend: "{metric[3]}",\n      change: "{metric[4]}",\n      icon: {metric[5]},\n      bgColor: "{hub_config["secondary"]}",\n    ' + '}'
        for metric in hub_config["metrics"]
    ])

    features_code = ",\n    ".join([
        '{' + f'\n      title: "{feature[0]}",\n      description: "{feature[1]}",\n      icon: "{feature[2]}",\n    ' + '}'
        for feature in hub_config["features"]
    ])
    
    # Build content without f-string to avoid JSX conflicts
    tagline = hub_config['tagline']
    description = hub_config['description']
    primary = hub_config['primary']
    primaryDark = hub_config['primaryDark']
    secondary = hub_config['secondary']

    content = f'''import React, {{ useState }} from "react";
import {{
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
}} from "lucide-react";

const Dashboard: React.FC = () => {{
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const colors = {{
    primary: "{primary}",
    primaryDark: "{primaryDark}",
    secondary: "{secondary}",
    success: "#4CAF50",
    text: "#1A1A1A",
    textLight: "#505050",
    white: "#FFFFFF",
  }};

  const metrics = [
    {metrics_code}
  ];

  const features = [
    {features_code}
  ];

  return (
    <div className="min-h-screen" style={{{{ backgroundColor: colors.secondary }}}}>
      {{/* Hero Section */}}
      <div
        className="py-12 px-4"
        style={{{{ backgroundColor: colors.primaryDark }}}}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            {tagline}
          </h1>
          <p className="text-white text-opacity-90 text-lg">
            {description}
          </p>
          <div
            className="mt-4 h-1 w-24 rounded-full"
            style={{{{ backgroundColor: colors.primary }}}}
          />
        </div>
      </div>

      {{/* Main Content */}}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {{/* Metrics Section */}}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{{{ color: colors.text }}}}>
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {{metrics.map((metric) => {{
              const Icon = metric.icon;
              return (
                <div
                  key={{metric.id}}
                  className="rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer"
                  style={{{{ backgroundColor: colors.white }}}}
                  onClick={{() => setSelectedMetric(metric.id)}}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="p-3 rounded-lg"
                      style={{{{ backgroundColor: metric.bgColor }}}}
                    >
                      <Icon
                        size={{24}}
                        style={{{{ color: colors.primary }}}}
                      />
                    </div>
                    {{metric.trend === "up" ? (
                      <ArrowUpRight size={{20}} style={{{{ color: colors.success }}}} />
                    ) : (
                      <span style={{{{ color: colors.textLight }}}}>→</span>
                    )}}
                  </div>
                  <h3 className="text-sm font-medium" style={{{{ color: colors.textLight }}}}>
                    {{metric.title}}
                  </h3>
                  <p className="text-2xl font-bold mt-2" style={{{{ color: colors.text }}}}>
                    {{metric.value}}
                    <span className="text-sm ml-1" style={{{{ color: colors.textLight }}}}>
                      {{metric.unit}}
                    </span>
                  </p>
                  <p
                    className="text-sm mt-2 font-medium"
                    style={{{{ color: metric.trend === "up" ? colors.success : colors.textLight }}}}
                  >
                    {{metric.change}}
                  </p>
                </div>
              );
            }})}}
          </div>
        </div>

        {{/* Features Section */}}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{{{ color: colors.text }}}}>
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {{features.map((feature, idx) => (
              <div
                key={{idx}}
                className="rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer group"
                style={{{{ backgroundColor: colors.white }}}}
              >
                <div className="text-4xl mb-4">{{feature.icon}}</div>
                <h3 className="text-lg font-bold mb-2" style={{{{ color: colors.text }}}}>
                  {{feature.title}}
                </h3>
                <p className="text-sm" style={{{{ color: colors.textLight }}}}>
                  {{feature.description}}
                </p>
                <div
                  className="mt-4 h-1 w-0 group-hover:w-full transition-all duration-300 rounded-full"
                  style={{{{ backgroundColor: colors.primary }}}}
                />
              </div>
            ))}}
          </div>
        </div>
      </div>
    </div>
  );
}};

export default Dashboard;
'''
    
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Created {path}")

# Create dashboards for all hubs
for hub_key, hub_config in HUBS.items():
    create_dashboard(hub_key, hub_config)

print("\n✅ All professional dashboards created successfully!")

