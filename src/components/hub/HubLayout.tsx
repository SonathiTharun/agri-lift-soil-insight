import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";
import { HubType, getHubTheme } from "@/lib/theme";
import HubTopNav from "./HubTopNav";
import HubSidebar from "./HubSidebar";

interface HubLayoutProps {
  hubId: HubType;
  navLinks: Array<{ label: string; path: string }>;
  children: React.ReactNode;
}

const HubLayout: React.FC<HubLayoutProps> = ({ hubId, navLinks, children }) => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = getHubTheme(hubId);

  const handleHome = () => {
    setSidebarOpen(false);
    navigate("/dashboard");
  };

  const handleNavigate = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as "en" | "hi" | "ta" | "te");
  };

  const handleHamburger = () => setSidebarOpen(true);
  const handleOverlayClick = () => setSidebarOpen(false);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div
      className={`flex flex-col min-h-screen bg-gradient-to-br ${theme.gradient}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${theme.gradient.split(' ')[1]} 0%, ${theme.gradient.split(' ')[3]} 100%)`,
      }}
    >
      <HubTopNav
        theme={theme}
        navLinks={navLinks}
        currentPath={location.pathname}
        language={language}
        onLanguageChange={handleLanguageChange}
        onHamburger={handleHamburger}
        onNavigate={handleNavigate}
        t={t}
      />

      <div className="flex flex-1 relative">
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                onClick={handleOverlayClick}
              />
              <HubSidebar
                theme={theme}
                onHome={handleHome}
                onClose={handleSidebarClose}
              />
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default HubLayout;

