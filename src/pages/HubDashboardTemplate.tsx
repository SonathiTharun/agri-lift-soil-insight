/**
 * Hub Dashboard Template
 * Use this template to create unified dashboards for all farming hubs
 * 
 * Usage:
 * 1. Copy this file to your hub's directory
 * 2. Replace THEME_ID with your hub's theme (dairy, bee, marine, poultry, organic, crop)
 * 3. Customize metrics and features for your hub
 * 4. Update navigation links
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { UnifiedHubDashboard, ExpertAdviceWidget } from "@/components/hub";
import { HUB_THEMES } from "@/lib/theme";
import { HubType } from "@/lib/theme";

// Replace with your hub's theme ID
const THEME_ID: HubType = "dairy"; // Change to: bee, marine, poultry, organic, crop
const theme = HUB_THEMES[THEME_ID];

// Define metrics for your hub
const metrics = [
    {
        title: "Metric 1",
        value: 100,
        unit: "unit",
        trend: "up" as const,
        trendValue: 10,
        icon: null,
    },
    {
        title: "Metric 2",
        value: 200,
        unit: "unit",
        trend: "up" as const,
        trendValue: 15,
        icon: null,
    },
    {
        title: "Metric 3",
        value: "A+",
        trend: "neutral" as const,
        icon: null,
    },
    {
        title: "Metric 4",
        value: "₹1.5L",
        trend: "up" as const,
        trendValue: 12,
        icon: null,
    },
];

// Define features for your hub
const features = [
    {
        title: "Feature 1",
        description: "Description for feature 1",
        icon: null,
        badge: "Popular",
    },
    {
        title: "Feature 2",
        description: "Description for feature 2",
        icon: null,
        badge: "New",
    },
    {
        title: "Feature 3",
        description: "Description for feature 3",
        icon: null,
    },
    {
        title: "Feature 4",
        description: "Description for feature 4",
        icon: null,
    },
    {
        title: "Feature 5",
        description: "Description for feature 5",
        icon: null,
    },
    {
        title: "Feature 6",
        description: "Description for feature 6",
        icon: null,
    },
];

const Dashboard = () => {
    const navigate = useNavigate();

    const handleFeatureClick = (index: number) => {
        // Update these links to match your hub's routes
        const links = [
            "/hub-path/feature-1",
            "/hub-path/feature-2",
            "/hub-path/feature-3",
            "/hub-path/feature-4",
            "/hub-path/feature-5",
            "/hub-path/feature-6",
        ];
        navigate(links[index] || "/hub-path");
    };

    return (
        <>
            <UnifiedHubDashboard
                theme={theme}
                heroTitle="Your Hub Title"
                heroDescription="Your hub description goes here"
                metrics={metrics}
                features={features.map((f, idx) => ({
                    ...f,
                    onClick: () => handleFeatureClick(idx),
                }))}
            />
            <ExpertAdviceWidget hubName={theme.name} accentColor={theme.primaryAccent} />
        </>
    );
};

export default Dashboard;

