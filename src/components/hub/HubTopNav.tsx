import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Bell, User } from "lucide-react";
import { HubTheme } from "@/lib/theme";

interface HubTopNavProps {
  theme: HubTheme;
  navLinks: Array<{ label: string; path: string }>;
  currentPath: string;
  language: string;
  onLanguageChange: (lang: string) => void;
  onHamburger: () => void;
  onNavigate: (path: string) => void;
  t: (key: string) => string;
}

const HubTopNav: React.FC<HubTopNavProps> = ({
  theme,
  navLinks,
  currentPath,
  language,
  onLanguageChange,
  onHamburger,
  onNavigate,
  t,
}) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: "en", label: "English" },
    { code: "te", label: "తెలుగు" },
    { code: "hi", label: "हिंदी" },
    { code: "ta", label: "தமிழ்" },
  ];

  const currentLanguage = languages.find((l) => l.code === language);

  return (
    <nav
      className={`bg-gradient-to-r ${theme.navGradient} shadow-2xl flex items-center justify-between px-4 md:px-8 py-4 sticky top-0 z-40 border-b-4 backdrop-blur-sm`}
      style={{ borderBottomColor: theme.primaryAccent }}
    >
      {/* Left Section: Hamburger + Logo */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Hamburger Button */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={onHamburger}
          className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 md:hidden flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu size={28} className="text-white font-bold" strokeWidth={3} />
        </motion.button>

        {/* Logo Section */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => onNavigate(navLinks[0]?.path || "/")}
        >
          <span className="text-3xl md:text-4xl drop-shadow-lg">{theme.emoji}</span>
          <div className="hidden sm:flex flex-col">
            <span className="text-lg md:text-xl font-bold text-white leading-tight">
              {theme.name}
            </span>
            <span className="text-xs md:text-sm text-white/80 italic">
              {theme.motif}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Center Section: Navigation Links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link, idx) => (
          <motion.button
            key={link.path}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(link.path)}
            className={`relative mx-2 px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
              currentPath === link.path
                ? "bg-white/30 text-white shadow-lg"
                : "text-white/90 hover:bg-white/15"
            }`}
          >
            {link.label}
            {currentPath === link.path && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-1 left-5 right-5 h-1.5 bg-white rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 relative"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
        </motion.button>

        {/* Language Selector */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-2 px-3 py-2 border-2 border-white/40 bg-white/15 text-white rounded-lg hover:bg-white/20 transition-all duration-200 font-semibold text-sm"
          >
            <Globe size={16} />
            <span className="hidden sm:inline">{currentLanguage?.label}</span>
          </motion.button>

          <AnimatePresence>
            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl overflow-hidden z-50 min-w-max"
              >
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm font-semibold transition-colors ${
                      language === lang.code
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {lang.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
          aria-label="Profile"
        >
          <User size={20} className="text-white" />
        </motion.button>
      </div>
    </nav>
  );
};

export default HubTopNav;

