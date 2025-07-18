
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, Menu, Tractor, User, Settings, ShoppingCart, Sparkles, LogOut } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { CartSidebar } from "./CartSidebar";
import { GlassNav, AnimatedDrawer, AnimatedMenuItem } from "@/components/ui/glass-nav";
import { AnimatedNavItem, AnimatedNavContainer } from "@/components/ui/animated-nav-item";
import { AnimatedLogo } from "@/components/ui/animated-logo";

interface MenuItem {
  id: string;
  label: string;
  path?: string;
  action?: () => void;
  icon: React.ReactNode;
}

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(() => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "dashboard";
    if (path === "/loans") return "loans";
    if (path === "/contact") return "contact";
    if (path === "/market") return "market";
    if (path === "/labour") return "labour";
    if (path === "/machinery") return "machinery";
    if (path === "/export") return "export";
    if (path === "/monitoring") return "monitoring";
    if (path === "/services") return "services";
    if (path === "/orders") return "orders";
    if (path === "/settings") return "settings";
    return "dashboard";
  });

  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") setActiveItem("dashboard");
    else if (path === "/loans") setActiveItem("loans");
    else if (path === "/contact") setActiveItem("contact");
    else if (path === "/market") setActiveItem("market");
    else if (path === "/labour") setActiveItem("labour");
    else if (path === "/machinery") setActiveItem("machinery");
    else if (path === "/export") setActiveItem("export");
    else if (path === "/monitoring") setActiveItem("monitoring");
    else if (path === "/services") setActiveItem("services");
    else if (path === "/orders") setActiveItem("orders");
    else if (path === "/settings") setActiveItem("settings");
  }, [location]);

  const navItems = [
    { id: "dashboard", label: t("dashboard"), path: "/dashboard" },
    { id: "loans", label: t("loans"), path: "/loans" },
    { id: "market", label: t("market"), path: "/market" },
    { id: "labour", label: t("labour"), path: "/labour" },
    { id: "machinery", label: t("machinery"), path: "/machinery" },
    { id: "export", label: t("export"), path: "/export" },
    { id: "monitoring", label: t("monitoring"), path: "/monitoring" },
    { id: "services", label: t("services"), path: "/services" },
    { id: "contact", label: t("contact"), path: "/contact" },
  ];
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems: MenuItem[] = [
    { id: "diverse-farming", label: "Diverse Farming", path: "/farming-type", icon: <Tractor size={18} /> },
    { id: "profile", label: "Profile", path: "/profile", icon: <User size={18} /> },
    { id: "settings", label: "Settings", path: "/settings", icon: <Settings size={18} /> },
    { id: "orders", label: "Orders", path: "/orders", icon: <ShoppingCart size={18} /> },
    { id: "logout", label: "Logout", action: handleLogout, icon: <LogOut size={18} /> },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 professional-header-farmer professional-shadow-soft"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-500/3 via-transparent to-green-500/3"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
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
                    className="professional-glow"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="farmer-portal-button professional-shimmer"
                    >
                      <Menu size={22} />
                    </Button>
                  </motion.div>
                </DrawerTrigger>
                <DrawerContent className="p-0 border-none">
                  <AnimatedDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                    <div className="p-6">
                      <motion.div
                        className="flex flex-col space-y-3 pt-2 pb-4"
                        variants={{
                          open: {
                            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                          },
                          closed: {
                            transition: { staggerChildren: 0.05, staggerDirection: -1 }
                          }
                        }}
                      >
                        {menuItems.map((item, index) => (
                          <AnimatedMenuItem key={item.id} onClick={() => setIsDrawerOpen(false)}>
                            {item.action ? (
                              <button
                                onClick={item.action}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all duration-300 group w-full text-left"
                              >
                                <motion.div
                                  className="text-red-600 group-hover:text-red-700"
                                  whileHover={{ rotate: 5, scale: 1.1 }}
                                >
                                  {item.icon}
                                </motion.div>
                                <span className="font-medium text-red-700 group-hover:text-red-800">
                                  {item.label}
                                </span>
                              </button>
                            ) : (
                              <Link
                                to={item.path}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-all duration-300 group"
                              >
                                <motion.div
                                  className="text-green-600 group-hover:text-green-700"
                                  whileHover={{ rotate: 5, scale: 1.1 }}
                                >
                                  {item.icon}
                                </motion.div>
                                <span className="font-medium text-gray-700 group-hover:text-green-700">
                                  {item.label}
                                </span>
                              </Link>
                            )}
                          </AnimatedMenuItem>
                        ))}
                      </motion.div>

                      <div className="border-t border-gray-200 pt-4">
                        <motion.div
                          variants={{
                            open: {
                              transition: { staggerChildren: 0.05, delayChildren: 0.3 }
                            },
                            closed: {
                              transition: { staggerChildren: 0.02, staggerDirection: -1 }
                            }
                          }}
                        >
                          {navItems.map((item, index) => (
                            <AnimatedMenuItem
                              key={item.id}
                              onClick={() => {
                                setActiveItem(item.id);
                                setIsDrawerOpen(false);
                              }}
                            >
                              <div className={`flex items-center px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${
                                activeItem === item.id
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                                  : "hover:bg-green-50 text-gray-700 hover:text-green-700"
                              }`}>
                                <Link to={item.path} className="w-full">
                                  <span className="font-medium text-sm break-words">{item.label}</span>
                                </Link>
                              </div>
                            </AnimatedMenuItem>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </AnimatedDrawer>
                </DrawerContent>
              </Drawer>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="farmer-portal-button mr-2 transition-all duration-300 rounded-xl backdrop-blur-sm"
                    >
                      <Menu size={22} />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-64 bg-white/98 dark:bg-gray-800/95 backdrop-blur-lg border border-green-200/30 dark:border-gray-700/30 shadow-2xl rounded-xl p-2"
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
                        {item.action ? (
                          <DropdownMenuItem className="rounded-lg mb-1">
                            <button
                              onClick={item.action}
                              className="professional-nav-item-farmer flex items-center gap-3 cursor-pointer transition-all duration-300 group w-full text-left hover:bg-red-50"
                            >
                              <motion.div
                                className="text-red-600 group-hover:text-red-700"
                                whileHover={{ rotate: 5, scale: 1.1 }}
                              >
                                {item.icon}
                              </motion.div>
                              <span className="font-medium text-red-700 group-hover:text-red-800">
                                {item.label}
                              </span>
                            </button>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem asChild className="rounded-lg mb-1">
                            <Link
                              to={item.path}
                              className="professional-nav-item-farmer flex items-center gap-3 cursor-pointer transition-all duration-300 group"
                            >
                              <motion.div
                                className="text-green-600 group-hover:text-green-700"
                                whileHover={{ rotate: 5, scale: 1.1 }}
                              >
                                {item.icon}
                              </motion.div>
                              <span className="font-medium text-gray-700 group-hover:text-green-700">
                                {item.label}
                              </span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <AnimatedLogo
              to="/dashboard"
              variant="farmer"
              size="xl"
              className="farmer-portal-logo"
            />
          </div>

          <div className="professional-nav-center">
            <AnimatedNavContainer className="professional-nav-items">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AnimatedNavItem
                  to={item.path}
                  isActive={activeItem === item.id}
                  onClick={() => setActiveItem(item.id)}
                  variant="glass"
                  size="sm"
                  className="relative overflow-hidden text-xs lg:text-sm"
                >
                  {item.label}
                </AnimatedNavItem>
              </motion.div>
            ))}
            </AnimatedNavContainer>
          </div>

          <motion.div
            className="professional-nav-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CartSidebar />
            </motion.div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="farmer-portal-button transition-all duration-300 rounded-xl backdrop-blur-sm"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Globe size={16} className="mr-2" />
                    </motion.div>
                    {language.toUpperCase()}
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white/98 dark:bg-gray-800/95 backdrop-blur-lg border border-green-200/30 dark:border-gray-700/30 shadow-2xl rounded-xl p-2"
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
                        onClick={() => setLanguage(lang.code)}
                        className="rounded-lg mb-1 cursor-pointer hover:bg-green-50 transition-all duration-300"
                      >
                        <span className="mr-2">{lang.flag}</span>
                        <span className="font-medium">{lang.label}</span>
                      </DropdownMenuItem>
                    </motion.div>
                  ))}
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
