#!/usr/bin/env python3
"""
Generate unified dashboards for all farming hubs
Run: python generate_hub_dashboards.py
"""

import os

HUBS = {
    "dairy": {
        "path": "src/pages/dairy-lift",
        "theme": "dairy",
        "title": "Maximize Your Dairy Profits",
        "description": "Everything you need to manage, buy, and sell dairy products.",
        "metrics": [
            ("Active Cattle", 245, "heads", "up", 12, "Milk"),
            ("Milk Yield", 1850, "L/day", "up", 8, "TrendingUp"),
            ("Quality Grade", "A+", "", "neutral", 0, "Award"),
            ("Revenue", "₹2.4L", "", "up", 15, "BarChart3"),
        ],
        "features": [
            ("Livestock Market", "Find and sell quality cattle with verified buyers", "Milk", "Popular"),
            ("Milk Production", "Track yield, quality metrics, and production trends", "TrendingUp", "Analytics"),
            ("Equipment Mart", "Browse and purchase farming machinery", "Award", "New"),
            ("Cattle Management", "Health records, vaccination schedules, breeding info", "Users", ""),
            ("Market Trends", "Real-time price updates and market analysis", "BarChart3", ""),
            ("Expert Consultation", "Connect with veterinarians and dairy experts", "Zap", ""),
        ],
        "links": [
            "/dairy-lift/livestock-market",
            "/dairy-lift/milk-production",
            "/dairy-lift/equipment-mart",
            "/dairy-lift/cattle-management",
            "/dairy-lift/market-trends",
            "/dairy-lift/expert-consultation",
        ],
    },
    "bee": {
        "path": "src/pages/bee-farming",
        "theme": "bee",
        "title": "Maximize Your Honey Production",
        "description": "Complete beekeeping management platform. Track colonies, sell honey, and connect with experts.",
        "metrics": [
            ("Active Colonies", 48, "hives", "up", 8, "Beehive"),
            ("Honey Yield", 320, "kg/season", "up", 12, "TrendingUp"),
            ("Hive Health", "Excellent", "", "neutral", 0, "Zap"),
            ("Revenue", "₹1.8L", "", "up", 18, "BarChart3"),
        ],
        "features": [
            ("Bee Colonies", "Manage hive health, inspections, and colony tracking", "Beehive", "Popular"),
            ("Honey Market", "Buy and sell honey with verified buyers", "ShoppingCart", "Active"),
            ("Equipment", "Browse beekeeping tools and supplies", "Zap", "New"),
            ("Seasonal Insights", "Get expert tips for each season", "TrendingUp", ""),
            ("Market Analytics", "Real-time honey prices and trends", "BarChart3", ""),
            ("Expert Consultation", "Connect with beekeeping experts", "Users", ""),
        ],
        "links": [
            "/bee-farming/bee-colonies",
            "/bee-farming/honey-market",
            "/bee-farming/equipment",
            "/bee-farming/seasonal-insights",
            "/bee-farming/market-analytics",
            "/bee-farming/expert-consultation",
        ],
    },
    "marine": {
        "path": "src/pages/marine-farming",
        "theme": "marine",
        "title": "Optimize Your Aquaculture",
        "description": "Complete marine farming platform. Manage ponds, track water quality, and sell seafood.",
        "metrics": [
            ("Active Ponds", 32, "tanks", "up", 6, "Fish"),
            ("Fish Yield", 2400, "kg/month", "up", 14, "TrendingUp"),
            ("Water Quality", "Optimal", "", "neutral", 0, "Waves"),
            ("Revenue", "₹3.2L", "", "up", 20, "Award"),
        ],
        "features": [
            ("Aquaculture", "Manage ponds, tanks, and water quality monitoring", "Fish", "Popular"),
            ("Seafood Market", "Buy and sell fresh seafood with verified traders", "Package", "Active"),
            ("Equipment", "Browse aquaculture equipment and supplies", "Ship", "New"),
            ("Water Analytics", "Real-time water quality and environmental data", "Waves", ""),
            ("Market Trends", "Seafood prices and market analysis", "TrendingUp", ""),
            ("Expert Consultation", "Connect with aquaculture specialists", "Zap", ""),
        ],
        "links": [
            "/marine-farming/aquaculture",
            "/marine-farming/seafood-market",
            "/marine-farming/equipment",
            "/marine-farming/water-analytics",
            "/marine-farming/market-trends",
            "/marine-farming/expert-consultation",
        ],
    },
    "poultry": {
        "path": "src/pages/poultry-farming",
        "theme": "poultry",
        "title": "Boost Your Poultry Production",
        "description": "Complete poultry farming platform. Manage flocks, track egg production, and connect with buyers.",
        "metrics": [
            ("Active Flocks", 156, "birds", "up", 10, "Bird"),
            ("Egg Yield", 4200, "eggs/day", "up", 16, "TrendingUp"),
            ("Flock Health", "Excellent", "", "neutral", 0, "Heart"),
            ("Revenue", "₹2.8L", "", "up", 22, "BarChart3"),
        ],
        "features": [
            ("Flock Management", "Track health, feed, and breeding records", "Bird", "Popular"),
            ("Egg Market", "Sell eggs to retailers and consumers", "ShoppingCart", "Active"),
            ("Feed & Supplies", "Browse quality feed and farming supplies", "Package", "New"),
            ("Health Monitoring", "Disease prevention and vaccination tracking", "Heart", ""),
            ("Market Analytics", "Real-time egg prices and trends", "BarChart3", ""),
            ("Expert Consultation", "Connect with poultry veterinarians", "Users", ""),
        ],
        "links": [
            "/poultry-farming/flock-management",
            "/poultry-farming/egg-market",
            "/poultry-farming/feed-supplies",
            "/poultry-farming/health-monitoring",
            "/poultry-farming/market-analytics",
            "/poultry-farming/expert-consultation",
        ],
    },
    "organic": {
        "path": "src/pages/organic-farming",
        "theme": "organic",
        "title": "Grow Certified Organic",
        "description": "Complete organic farming platform. Manage certified crops, connect with buyers, and maintain standards.",
        "metrics": [
            ("Certified Acres", 85, "acres", "up", 9, "Leaf"),
            ("Organic Yield", 1650, "kg/month", "up", 11, "TrendingUp"),
            ("Certification", "Active", "", "neutral", 0, "CheckCircle"),
            ("Revenue", "₹2.1L", "", "up", 18, "BarChart3"),
        ],
        "features": [
            ("Crop Management", "Manage certified organic crops and rotations", "Leaf", "Popular"),
            ("Organic Marketplace", "Sell certified organic produce", "ShoppingCart", "Active"),
            ("Certification", "Track and maintain organic certification", "CheckCircle", "New"),
            ("Soil Health", "Monitor soil quality and amendments", "Sprout", ""),
            ("Market Trends", "Organic product prices and demand", "TrendingUp", ""),
            ("Expert Consultation", "Connect with organic farming experts", "Users", ""),
        ],
        "links": [
            "/organic-farming/crop-management",
            "/organic-farming/marketplace",
            "/organic-farming/certification",
            "/organic-farming/soil-health",
            "/organic-farming/market-trends",
            "/organic-farming/expert-consultation",
        ],
    },
    "crop": {
        "path": "src/pages/crop-farming",
        "theme": "crop",
        "title": "Maximize Your Crop Yield",
        "description": "Complete crop farming platform. Manage fields, track weather, and optimize harvests.",
        "metrics": [
            ("Active Fields", 42, "fields", "up", 7, "Sprout"),
            ("Crop Yield", 3800, "kg/season", "up", 13, "TrendingUp"),
            ("Soil Health", "Good", "", "neutral", 0, "Leaf"),
            ("Revenue", "₹3.5L", "", "up", 19, "BarChart3"),
        ],
        "features": [
            ("Field Management", "Track crops, soil, and field conditions", "Sprout", "Popular"),
            ("Crop Market", "Sell crops to traders and buyers", "ShoppingCart", "Active"),
            ("Equipment", "Browse farming machinery and tools", "Wrench", "New"),
            ("Weather Analytics", "Real-time weather and forecasts", "Cloud", ""),
            ("Market Trends", "Crop prices and market analysis", "TrendingUp", ""),
            ("Expert Consultation", "Connect with agricultural experts", "Users", ""),
        ],
        "links": [
            "/crop-farming/field-management",
            "/crop-farming/crop-market",
            "/crop-farming/equipment",
            "/crop-farming/weather-analytics",
            "/crop-farming/market-trends",
            "/crop-farming/expert-consultation",
        ],
    },
}

DASHBOARD_TEMPLATE = '''import React from "react";
import {{ useNavigate }} from "react-router-dom";
import {{ UnifiedHubDashboard, ExpertAdviceWidget }} from "@/components/hub";
import {{ {icons} }} from "lucide-react";
import {{ HUB_THEMES }} from "@/lib/theme";

const theme = HUB_THEMES.{theme};

const metrics = [
{metrics}
];

const features = [
{features}
];

const Dashboard = () => {{
    const navigate = useNavigate();
    const handleFeatureClick = (index: number) => {{
        const links = [{links}];
        navigate(links[index] || "/{path}");
    }};
    return (
        <>
            <UnifiedHubDashboard
                theme={{theme}}
                heroTitle="{title}"
                heroDescription="{description}"
                metrics={{metrics}}
                features={{features.map((f, idx) => ({{
                    ...f,
                    onClick: () => handleFeatureClick(idx),
                }})}}
            />
            <ExpertAdviceWidget hubName={{theme.name}} accentColor={{theme.primaryAccent}} />
        </>
    );
}};

export default Dashboard;
'''

def generate_dashboards():
    for hub_id, config in HUBS.items():
        # Generate metrics
        metrics_lines = []
        for metric in config["metrics"]:
            name, value, unit, trend, trend_val, icon = metric
            val_str = str(value) if isinstance(value, int) else f'"{value}"'
            metrics_lines.append(
                f'    {{ title: "{name}", value: {val_str}, unit: "{unit}", trend: "{trend}" as const, trendValue: {trend_val}, icon: <{icon} size={{24}} style={{{{ color: theme.primaryAccent }}}} /> }},'
            )
        metrics_str = "\n".join(metrics_lines)

        # Generate features
        features_lines = []
        for feature in config["features"]:
            title, desc, icon, badge = feature
            badge_str = f', badge: "{badge}"' if badge else ""
            features_lines.append(
                f'    {{ title: "{title}", description: "{desc}", icon: <{icon} size={{32}} />{badge_str} }},'
            )
        features_str = "\n".join(features_lines)

        # Generate links
        links_str = ", ".join([f'"{link}"' for link in config["links"]])

        # Get unique icons
        icons = set()
        for metric in config["metrics"]:
            icons.add(metric[5])
        for feature in config["features"]:
            icons.add(feature[2])
        icons_str = ", ".join(sorted(icons))

        # Generate dashboard content
        dashboard_content = DASHBOARD_TEMPLATE.format(
            theme=config["theme"],
            title=config["title"],
            description=config["description"],
            metrics=metrics_str,
            features=features_str,
            links=links_str,
            path=config["path"].split("/")[-1],
            icons=icons_str,
        )

        # Write file
        output_path = os.path.join(config["path"], "Dashboard.tsx")
        os.makedirs(config["path"], exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(dashboard_content)
        print(f"✅ Created {output_path}")

if __name__ == "__main__":
    generate_dashboards()
    print("\n✨ All dashboards generated successfully!")

