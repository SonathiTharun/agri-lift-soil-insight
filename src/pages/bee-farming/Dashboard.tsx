import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/components/LanguageContext";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, ShoppingCart, Users, Zap, ArrowRight } from "lucide-react";
import LiveMarketTicker from "./components/LiveMarketTicker";
import ProfitCalculator from "./components/ProfitCalculator";
import SeasonalInsights from "./components/SeasonalInsights";
import HoneycombGrid from "./components/HoneycombGrid";
import {
  staggerContainerVariants,
  staggerItemVariants,
  buttonHoverVariants,
  cardHoverVariants,
  slideInTopVariants,
  fadeInVariants,
  floatingVariants,
} from "./utils/animations";
import { gradients, shadows, cardStyles } from "./utils/styles";

const serviceBlocks = [
  {
    label: "Find Your Next Bee Colony",
    icon: "🐝",
    link: "/bee-farming/bee-colonies",
    color: "from-yellow-200 via-yellow-300 to-amber-400",
    description: "Browse and purchase quality bee colonies",
  },
  {
    label: "Sell Your Honey",
    icon: "🍯",
    link: "/bee-farming/honey-market",
    color: "from-orange-200 via-orange-300 to-amber-400",
    description: "Connect with buyers for your honey",
  },
  {
    label: "Buy Beekeeping Equipment",
    icon: "🔧",
    link: "/bee-farming/equipment",
    color: "from-green-200 via-emerald-300 to-teal-400",
    description: "Quality equipment and supplies",
  },
  {
    label: "Expert Bee Farming Advice",
    icon: "📚",
    link: "/bee-farming/expert-advice",
    color: "from-purple-200 via-purple-300 to-indigo-400",
    description: "Get expert consultation and guidance",
  },
];

const getTestimonials = (t: (key: string) => string) => [
  {
    name: "Rajesh Kumar, Telangana",
    quote: "Increased my honey production by 40% using the expert advice from this platform!",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Sharma, Karnataka",
    quote: "Found the best quality bee colonies and equipment all in one place. Highly recommended!",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Vikram Singh, Andhra Pradesh",
    quote: "The profit calculator helped me plan my expansion perfectly. Great platform!",
    img: "https://randomuser.me/api/portraits/men/65.jpg",
  },
];

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  React.useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  // Premium gradient background
  const premiumBg = "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900";

  return (
    <div className={`w-full min-h-screen ${premiumBg} pb-20 overflow-hidden relative`}>
      {/* Premium animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full opacity-10 blur-3xl"
        animate={{ y: [0, 40, 0], x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-20 w-96 h-96 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full opacity-8 blur-3xl"
        animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-full opacity-5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Premium Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto text-center py-16 px-4 relative z-10"
      >
        {/* Premium Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-block mb-8"
        >
          <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-6 py-3 rounded-full border border-amber-400/40 backdrop-blur-xl hover:border-amber-400/60 transition-all duration-300">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </motion.div>
            <span className="text-sm font-semibold text-amber-200">Premium Bee Farming Platform</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 bg-clip-text text-transparent mb-6 leading-tight tracking-tight"
        >
          Bee Farming Excellence
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto font-light"
        >
          Professional platform for beekeepers to maximize profits through smart trading, expert guidance, and advanced analytics
        </motion.p>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 mt-12"
        >
          {[
            { label: "Active Beekeepers", value: "5,000+" },
            { label: "Honey Traded", value: "50K+ Tons" },
            { label: "Success Rate", value: "98.5%" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-amber-300">{stat.value}</div>
              <div className="text-sm text-slate-400 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Premium Service Cards */}
      <motion.section
        variants={staggerContainerVariants}
        initial="initial"
        animate={isLoaded ? "animate" : "initial"}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 px-4 relative z-10"
      >
        {serviceBlocks.map((block, idx) => {
          const icons = [
            <TrendingUp key="trending" className="w-10 h-10" />,
            <ShoppingCart key="shopping" className="w-10 h-10" />,
            <Zap key="zap" className="w-10 h-10" />,
            <Users key="users" className="w-10 h-10" />,
          ];

          return (
            <motion.button
              key={block.label}
              variants={staggerItemVariants}
              whileHover={{ y: -12, boxShadow: "0px 30px 60px rgba(251, 146, 60, 0.4)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(block.link)}
              className="relative flex flex-col items-start justify-between rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 overflow-hidden group border border-slate-700/50 hover:border-amber-500/50 shadow-xl hover:shadow-2xl transition-all duration-300 min-h-64"
            >
              {/* Gradient overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.4 }}
              />

              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                style={{
                  background: "radial-gradient(circle at top right, rgba(251, 146, 60, 0.3), transparent)",
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Content */}
              <div className="relative z-10 w-full">
                {/* Icon */}
                <motion.div
                  className="mb-6 p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30 w-fit group-hover:border-amber-400/60 transition-all"
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="text-amber-300">{icons[idx]}</div>
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors duration-300">
                  {block.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300 mb-6">
                  {block.description}
                </p>
                {/* CTA Button */}
                <motion.div
                  className="flex items-center justify-between w-full mt-auto pt-4 border-t border-slate-700/50 group-hover:border-amber-500/30 transition-colors"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <span className="text-xs font-semibold text-amber-400">Explore Now</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </motion.section>

      {/* Premium Section Header Component */}
      {/* Live Market Ticker */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="max-w-6xl mx-auto mb-16 px-4 relative z-10"
      >
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Live Market Insights</h2>
          </motion.div>
          <p className="text-slate-400 ml-4">Real-time honey and colony prices across South India</p>
        </div>
        <LiveMarketTicker />
      </motion.section>

      {/* Featured Services Grid */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="max-w-6xl mx-auto mb-16 px-4 relative z-10"
      >
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Services</h2>
          </motion.div>
          <p className="text-slate-400 ml-4">Discover premium bee farming opportunities</p>
        </div>
        <HoneycombGrid />
      </motion.section>

      {/* Seasonal Insights */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="max-w-6xl mx-auto mb-16 px-4 relative z-10"
      >
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Seasonal Guidance</h2>
          </motion.div>
          <p className="text-slate-400 ml-4">Optimize your farming with seasonal insights</p>
        </div>
        <SeasonalInsights />
      </motion.section>

      {/* Profit Calculator */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="max-w-6xl mx-auto mb-16 px-4 relative z-10"
      >
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Profit Calculator</h2>
          </motion.div>
          <p className="text-slate-400 ml-4">Estimate your potential earnings with our advanced calculator</p>
        </div>
        <ProfitCalculator />
      </motion.section>

      {/* How It Works - Premium Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="max-w-6xl mx-auto mb-16 px-4 relative z-10"
      >
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">How It Works</h2>
          </motion.div>
          <p className="text-slate-400 ml-4">Simple steps to start your bee farming journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: 1, title: "Register Your Farm", desc: "Create your profile and verify your details" },
            { step: 2, title: "List or Find", desc: "Browse colonies, honey, or equipment" },
            { step: 3, title: "Connect & Trade", desc: "Negotiate and complete transactions" },
            { step: 4, title: "Grow Your Business", desc: "Track profits and expand operations" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 1 + idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative"
            >
              {/* Connector line */}
              {idx < 3 && (
                <div className="hidden md:block absolute top-12 left-full w-6 h-0.5 bg-gradient-to-r from-amber-500 to-transparent" />
              )}

              {/* Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 hover:border-amber-500/50 transition-all h-full">
                {/* Step Number */}
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 text-2xl font-bold text-white shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {item.step}
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>

                {/* Description */}
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className="max-w-6xl mx-auto mb-16 px-4 relative z-10"
      >
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Success Stories</h2>
          </motion.div>
          <p className="text-slate-400 ml-4">Hear from our thriving community of beekeepers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {getTestimonials(t).map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 1.1 + idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 hover:border-amber-500/50 transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.img}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-amber-500/50"
                />
                <div>
                  <p className="font-bold text-white text-sm">{testimonial.name}</p>
                  <p className="text-amber-400 text-xs">Verified Beekeeper</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
        transition={{ duration: 0.7, delay: 1 }}
        className="max-w-4xl mx-auto mb-16 px-4 relative z-10"
      >
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl border border-amber-500/30 p-12 text-center backdrop-blur-xl">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Bee Farming?</h2>
          <p className="text-slate-300 mb-8 text-lg">Join thousands of successful beekeepers on our platform</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/bee-farming/bee-colonies")}
            className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold rounded-xl hover:shadow-2xl transition-all"
          >
            Get Started Now
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default Dashboard;

