import React from "react";
import { motion } from "framer-motion";
import { HubTheme } from "@/lib/theme";
import HubCard from "./HubCard";
import MetricCard from "./MetricCard";
import FeatureCard from "./FeatureCard";

interface MetricData {
  title: string;
  value: number | string;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  icon?: React.ReactNode;
}

interface FeatureData {
  title: string;
  description: string;
  icon?: React.ReactNode;
  badge?: string;
  onClick?: () => void;
}

interface UnifiedHubDashboardProps {
  theme: HubTheme;
  heroTitle: string;
  heroDescription: string;
  heroImage?: string;
  metrics: MetricData[];
  features: FeatureData[];
  children?: React.ReactNode;
}

const UnifiedHubDashboard: React.FC<UnifiedHubDashboardProps> = ({
  theme,
  heroTitle,
  heroDescription,
  heroImage,
  metrics,
  features,
  children,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <HubCard variant="elevated" className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {heroTitle}
                </h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {heroDescription}
                </p>
                <div className="flex gap-3">
                  <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: theme.primaryAccent }}
                  />
                  <p className="text-sm text-gray-500 italic">
                    {theme.motif}
                  </p>
                </div>
              </div>
              {heroImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="hidden md:block"
                >
                  <img
                    src={heroImage}
                    alt={heroTitle}
                    className="w-full h-auto rounded-xl shadow-lg"
                  />
                </motion.div>
              )}
            </div>
          </HubCard>
        </motion.div>

        {/* Metrics Section */}
        {metrics.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Key Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <MetricCard
                    title={metric.title}
                    value={metric.value}
                    unit={metric.unit}
                    trend={metric.trend}
                    trendValue={metric.trendValue}
                    icon={metric.icon}
                    accentColor={theme.primaryAccent}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Features Section */}
        {features.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Core Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <FeatureCard
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    accentColor={theme.primaryAccent}
                    badge={feature.badge}
                    onClick={feature.onClick}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Custom Content */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UnifiedHubDashboard;

