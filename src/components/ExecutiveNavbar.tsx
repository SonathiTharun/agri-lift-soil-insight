import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Globe, Menu, Users, BarChart3, DollarSign, Settings, Bell, LogOut, Shield, Sparkles, User,
  Search, Activity, AlertTriangle, CheckCircle, Clock, Zap, TrendingUp, MessageSquare,
  Download, Upload, RefreshCw, Plus, Filter, Calendar, MapPin, Database, Wifi, WifiOff
} from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { GlassNav, AnimatedDrawer, AnimatedMenuItem } from "@/components/ui/glass-nav";
import { useToast } from "@/hooks/use-toast";
import { AnimatedNavItem, AnimatedNavContainer } from "@/components/ui/animated-nav-item";
import { AnimatedLogo } from "@/components/ui/animated-logo";

export function ExecutiveNavbar() {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(() => {
    const path = location.pathname;
    if (path === "/executive-dashboard") return "dashboard";
    if (path === "/executive/farmers") return "farmers";
    if (path === "/executive/analytics") return "analytics";
    if (path === "/executive/financial") return "financial";
    if (path === "/executive/operations") return "operations";
    if (path === "/executive/communications") return "communications";
    return "dashboard";
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNav, setLoadingNav] = useState<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/executive-dashboard") setActiveItem("dashboard");
    else if (path === "/executive/farmers") setActiveItem("farmers");
    else if (path === "/executive/analytics") setActiveItem("analytics");
    else if (path === "/executive/financial") setActiveItem("financial");
    else if (path === "/executive/operations") setActiveItem("operations");
    else if (path === "/executive/communications") setActiveItem("communications");
  }, [location]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", path: "/executive-dashboard", icon: BarChart3 },
    { id: "farmers", label: "Farmers", path: "/executive/farmers", icon: Users },
    { id: "analytics", label: "Analytics", path: "/executive/analytics", icon: TrendingUp },
    { id: "geographic", label: "Geographic", path: "/executive/geographic", icon: MapPin },
    { id: "financial", label: "Financial", path: "/executive/financial", icon: DollarSign },
    { id: "operations", label: "Operations", path: "/executive/operations", icon: Settings },
    { id: "communications", label: "Communications", path: "/executive/communications", icon: MessageSquare },
  ];
  
  const menuItems = [
    { id: "profile", label: "Profile", path: "/profile", icon: <User size={18} /> },
    { id: "notifications", label: "Notifications", path: "/executive/notifications", icon: <Bell size={18} /> },
    { id: "settings", label: "Settings", path: "/executive/settings", icon: <Settings size={18} /> },
    { id: "logout", label: "Logout", path: "/", icon: <LogOut size={18} /> },
  ];

  const notifications = [
    { id: 1, title: "New Farmer Registered", time: "2m ago" },
    { id: 2, title: "Loan Approved", time: "10m ago" },
    { id: 3, title: "System Update Scheduled", time: "1h ago" },
  ];

  const handleNavClick = (id: string, path: string) => {
    setLoadingNav(id);

    // Handle special cases
    if (id === "logout") {
      toast({
        title: "Logging out...",
        description: "You are being logged out of the executive portal.",
      });
      setTimeout(() => {
        setActiveItem(id);
        setLoadingNav(null);
        // Clear any stored auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate(path);
      }, 1000);
      return;
    }

    setTimeout(() => {
      setActiveItem(id);
      setLoadingNav(null);
      navigate(path);

      // Show navigation feedback
      toast({
        title: `Navigating to ${menuItems.find(item => item.id === id)?.label || 'Page'}`,
        description: "Loading executive portal section...",
      });
    }, 400);
  };

  const handleLogout = () => {
    // Clear session (simulate)
    localStorage.removeItem("userSession");
    navigate("/");
  };

  return (
    <TooltipProvider>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50 professional-header-executive professional-shadow-executive"
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-green-500/5"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative professional-container">
          <div className="professional-nav-container">
            <div className="professional-nav-left">
              {isMobile ? (
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <DrawerTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="professional-glow professional-glow-executive"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="professional-button-executive professional-shimmer"
                      >
                        <Menu size={22} />
                      </Button>
                    </motion.div>
                  </DrawerTrigger>
                <DrawerContent className="p-0 border-none">
                  <div className="professional-mobile-menu-executive p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col space-y-3 pt-2 pb-4"
                    >
                      {menuItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          <Link
                            to={item.path}
                            className="professional-dropdown-item-executive professional-shimmer group"
                          >
                            <motion.div
                              className="text-emerald-600 group-hover:text-emerald-800"
                              whileHover={{ rotate: 5, scale: 1.1 }}
                            >
                              {item.icon}
                            </motion.div>
                            <span className="font-medium">
                              {item.label}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>

                    <div className="border-t border-emerald-200/50 pt-4 mt-4">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {navItems.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (index + 3) * 0.1 }}
                            onClick={() => {
                              setActiveItem(item.id);
                              setIsDrawerOpen(false);
                            }}
                          >
                            <div className={`mb-2 rounded-xl transition-all duration-300 ${
                              activeItem === item.id
                                ? "professional-nav-item-active-executive professional-shadow-medium"
                                : "professional-nav-item-executive professional-shimmer"
                            }`}>
                              <Link to={item.path} className="block w-full px-4 py-3">
                                <span className="font-medium text-sm break-words">{item.label}</span>
                              </Link>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="professional-glow professional-glow-executive"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="professional-button-executive professional-shimmer"
                    >
                      <Menu size={22} />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-64 professional-dropdown-executive"
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <DropdownMenuItem asChild className="rounded-lg mb-1">
                          <Link
                            to={item.path}
                            className="professional-dropdown-item-executive professional-shimmer group"
                          >
                            <motion.div
                              className="text-emerald-600 group-hover:text-emerald-800"
                              whileHover={{ rotate: 5, scale: 1.1 }}
                            >
                              {item.icon}
                            </motion.div>
                            <span className="font-medium">
                              {item.label}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      </motion.div>
                    ))}
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="professional-logo-executive professional-glow professional-glow-executive"
            >
              <AnimatedLogo
                to="/executive-dashboard"
                variant="executive"
                size="xl"
                showText={false}
              />
            </motion.div>
          </div>

          <div className="professional-nav-center">
            <div className="professional-nav-items">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="professional-glow professional-glow-executive"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => handleNavClick(item.id, item.path)}
                      className={`relative overflow-hidden ${
                        activeItem === item.id
                          ? 'professional-nav-item-active-executive professional-shadow-medium'
                          : 'professional-nav-item-executive professional-shimmer'
                      } ${loadingNav === item.id ? 'opacity-60 pointer-events-none' : ''}`}
                      aria-current={activeItem === item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {activeItem === item.id && (
                        <motion.div
                          className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"
                          layoutId="underline"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      {loadingNav === item.id && (
                        <motion.span
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-400"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ●
                        </motion.span>
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent className="professional-dropdown-executive">
                    <span className="professional-text-gradient-executive font-medium">{item.label}</span>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
            </div>
          </div>

          <motion.div
            className="professional-nav-right ml-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="professional-glow professional-glow-executive"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="professional-button-primary-executive professional-shimmer relative"
                    onClick={() => setShowNotifications((v) => !v)}
                    aria-label="Notifications"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Bell size={14} className="mr-1" />
                    </motion.div>
                    <motion.span
                      className="professional-notification-badge"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {notifications.length}
                    </motion.span>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="professional-dropdown-executive">
                <span className="professional-text-gradient-executive font-medium">Notifications</span>
              </TooltipContent>
            </Tooltip>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-20 top-16 w-80 professional-dropdown-executive professional-shadow-large z-50"
              >
                <div className="p-4 border-b border-emerald-200/50">
                  <h3 className="font-semibold professional-text-gradient-executive">Notifications</h3>
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  {notifications.map((n, index) => (
                    <motion.li
                      key={n.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="professional-dropdown-item-executive professional-shimmer cursor-pointer border-b last:border-b-0 border-emerald-100/50"
                    >
                      <div>
                        <div className="font-medium text-emerald-800">{n.title}</div>
                        <div className="text-xs text-emerald-600">{n.time}</div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <div className="p-3 text-center border-t border-emerald-200/50">
                  <motion.button
                    className="professional-button-executive text-sm"
                    onClick={() => setShowNotifications(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="professional-glow professional-glow-executive"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="professional-button-secondary professional-shimmer"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Globe size={14} className="mr-1" />
                    </motion.div>
                    <span className="font-semibold">{language.toUpperCase()}</span>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="professional-dropdown-executive"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {[
                    { code: 'en', label: 'English', flag: '🇺🇸' },
                    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
                    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
                    { code: 'te', label: 'తెలుగు', flag: '🇮🇳' }
                  ].map((lang, index) => (
                    <motion.div
                      key={lang.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <DropdownMenuItem
                        onClick={() => setLanguage(lang.code as 'en' | 'hi' | 'ta' | 'te')}
                        className="professional-dropdown-item-executive professional-shimmer rounded-lg mb-1 cursor-pointer"
                      >
                        <span className="mr-3 text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.label}</span>
                      </DropdownMenuItem>
                    </motion.div>
                  ))}
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile section removed as requested */}
          </motion.div>
        </div>
        </div>
      </motion.nav>
    </TooltipProvider>
  );
}
