import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import BeeFarmingRoutes from "./routes";
import { useLanguage } from "@/components/LanguageContext";

// Bee Farming color scheme - Yellow/Gold/Amber theme
const beeFarmingBg = "bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 min-h-screen";
const sidebarBg = "bg-gradient-to-br from-yellow-600 via-amber-700 to-orange-800/90 bg-opacity-90 text-white w-80 min-h-screen p-8 flex flex-col fixed top-0 left-0 z-50 transition-transform duration-300 shadow-2xl rounded-r-3xl backdrop-blur-lg border-r-2 border-yellow-300";
const sidebarClosed = "-translate-x-full";
const sidebarOpen = "translate-x-0";
const overlayBg = "fixed inset-0 bg-black bg-opacity-30 z-40";
const topNavBg = "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500/80 bg-opacity-90 backdrop-blur-lg shadow-2xl flex items-center justify-between px-8 py-3 sticky top-0 z-40 rounded-b-3xl border-b-2 border-yellow-200";
const navLinkStyle = `relative mx-2 px-4 py-2 rounded-full font-bold text-white transition-all duration-300 ease-in-out
  hover:bg-white/20 hover:text-yellow-100 hover:shadow-lg focus:bg-white/30 focus:text-yellow-200
  after:content-[''] after:absolute after:left-4 after:right-4 after:-bottom-1 after:h-1 after:rounded-full
  after:bg-gradient-to-r after:from-yellow-300 after:to-orange-300 after:opacity-0 hover:after:opacity-100 after:transition-all after:duration-300`;

const getTopNavLinks = (t: (key: string) => string) => [
  { label: t("home"), path: "/bee-farming" },
  { label: "Bee Colonies", path: "/bee-farming/bee-colonies" },
  { label: "Honey Market", path: "/bee-farming/honey-market" },
  { label: "Equipment", path: "/bee-farming/equipment" },
  { label: "Expert Advice", path: "/bee-farming/expert-advice" },
];

const getLanguages = (t: (key: string) => string) => [
  { code: "en", label: t("english") },
  { code: "te", label: t("telugu") },
  { code: "hi", label: t("hindi") },
  { code: "ta", label: t("tamil") },
];

const HamburgerIcon = ({ onClick }: { onClick: () => void }) => (
  <button
    className="mr-4 focus:outline-none"
    aria-label="Open sidebar"
    onClick={onClick}
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-700">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  </button>
);

const CloseIcon = ({ onClick }: { onClick: () => void }) => (
  <button
    className="absolute top-4 right-4 text-white hover:text-yellow-200 text-2xl focus:outline-none"
    aria-label="Close sidebar"
    onClick={onClick}
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
);

const Sidebar = ({ onHome, onClose }: { onHome: () => void; onClose: () => void }) => (
  <aside className={sidebarBg + " relative"}>
    <CloseIcon onClick={onClose} />
    <div className="flex flex-col items-center mt-8 mb-12">
      <div className="bg-white rounded-full p-3 shadow-lg mb-3">
        <span className="text-4xl">🐝</span>
      </div>
      <h2 className="text-2xl font-bold tracking-wide">Bee Farming</h2>
    </div>
    <div className="flex-1 flex flex-col justify-center items-center">
      <button
        className="w-full bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 text-amber-900 font-bold py-3 px-6 rounded-full shadow-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-200 text-lg scale-100 hover:scale-105"
        onClick={onHome}
      >
        <span className="mr-2">🏠</span> Home
      </button>
    </div>
    <div className="mt-auto text-center text-yellow-200 text-xs pt-8">
      &copy; {new Date().getFullYear()} Bee Farming Hub
    </div>
  </aside>
);

const TopNav = ({ onNavigate, currentPath, language, onLanguageChange, onHamburger, t }: {
  onNavigate: (path: string) => void;
  currentPath: string;
  language: string;
  onLanguageChange: (lang: string) => void;
  onHamburger: () => void;
  t: (key: string) => string;
}) => (
  <nav className={topNavBg}>
    <div className="flex items-center gap-2">
      <HamburgerIcon onClick={onHamburger} />
      <span className="text-3xl mr-3">🐝</span>
      <span className="text-xl font-bold text-white hidden sm:inline">Bee Farming Hub</span>
      {getTopNavLinks(t).map((link, idx) => (
        <motion.button
          key={link.path}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${navLinkStyle} ${currentPath === link.path ? "bg-yellow-100 text-amber-900 shadow-lg" : ""} hidden sm:inline-block`}
          onClick={() => onNavigate(link.path)}
        >
          {link.label}
        </motion.button>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <select
        value={language}
        onChange={e => onLanguageChange(e.target.value)}
        className="border border-yellow-300 rounded px-2 py-1 text-yellow-700 focus:outline-none"
      >
        {getLanguages(t).map(lang => (
          <option key={lang.code} value={lang.code}>{lang.label}</option>
        ))}
      </select>
    </div>
  </nav>
);

const BeeFarmingHome: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleHome = () => {
    setSidebarOpen(false);
    navigate("/dashboard");
  };
  const handleNavigate = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
  };
  const handleLanguageChange = (lang: string) => setLanguage(lang as 'en' | 'hi' | 'ta' | 'te');
  const handleHamburger = () => setSidebarOpen(true);
  const handleOverlayClick = () => setSidebarOpen(false);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className={`flex flex-col ${beeFarmingBg}`} style={{ minHeight: "100vh" }}>
      <TopNav
        onNavigate={handleNavigate}
        currentPath={location.pathname}
        language={language}
        onLanguageChange={handleLanguageChange}
        onHamburger={handleHamburger}
        t={t}
      />
      <div className="flex flex-1">
        {/* Sidebar overlay for all devices */}
        {sidebarOpen && (
          <>
            <div className={overlayBg} onClick={handleOverlayClick} />
            <div className={`${sidebarBg} ${sidebarOpen ? sidebarOpen : sidebarClosed}`} style={{ minHeight: "100vh" }}>
              <Sidebar onHome={handleHome} onClose={handleSidebarClose} />
            </div>
          </>
        )}
        <main className="flex-1">
          <BeeFarmingRoutes />
        </main>
      </div>
    </div>
  );
};

export default BeeFarmingHome;

