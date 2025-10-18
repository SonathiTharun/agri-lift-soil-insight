import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HubRoutes from "./routes";
import { useLanguage } from "@/components/LanguageContext";
import { Menu, X, Bell, Globe, User, LogOut } from "lucide-react";

const HubHome: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [languageDropdown, setLanguageDropdown] = useState(false);

  const colors = {
    primary: "#3E8914",
    primaryDark: "#2D6A0F",
    secondary: "#F0F8E8",
    accent: "#3E8914",
    text: "#1A1A1A",
    textLight: "#505050",
    white: "#FFFFFF",
    border: "#E0E0E0",
  };

  const navLinks = [
    { label: "Home", path: "/organic-farming" },
    { label: "Dashboard", path: "/organic-farming/dashboard" },
    { label: "Marketplace", path: "/organic-farming/marketplace" },
    { label: "Management", path: "/organic-farming/management" },
    { label: "Equipment", path: "/organic-farming/equipment" },
  ];

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "te", label: "తెలుగు" },
    { code: "ta", label: "தமிழ்" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary }}>
      {/* Top Navigation */}
      <nav
        className="sticky top-0 z-50 shadow-lg"
        style={{ backgroundColor: colors.primaryDark }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-opacity-80 transition"
              style={{ backgroundColor: colors.primary }}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <X size={24} style={{ color: colors.primaryDark }} />
              ) : (
                <Menu size={24} style={{ color: colors.primaryDark }} />
              )}
            </button>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: colors.primary }}
              >
                🌱
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Organic Hub</h1>
                <p className="text-xs text-white text-opacity-80">Grow Certified Organic</p>
              </div>
            </div>
          </div>

          {/* Center: Nav Links (Desktop) */}
          <div className="hidden md:flex gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigate(link.path)}
                className="px-4 py-2 rounded-lg font-medium transition"
                style={{
                  backgroundColor:
                    location.pathname === link.path
                      ? colors.primary
                      : "transparent",
                  color:
                    location.pathname === link.path
                      ? colors.primaryDark
                      : "white",
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-opacity-80 transition text-white">
              <Bell size={20} />
            </button>
            <div className="relative">
              <button
                onClick={() => setLanguageDropdown(!languageDropdown)}
                className="p-2 rounded-lg hover:bg-opacity-80 transition text-white flex items-center gap-1"
              >
                <Globe size={20} />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </button>
              {languageDropdown && (
                <div
                  className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50"
                  style={{ backgroundColor: colors.white }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setLanguageDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                      style={{ color: colors.text }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="p-2 rounded-lg hover:bg-opacity-80 transition text-white">
              <User size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="fixed left-0 top-16 w-64 h-screen shadow-lg z-40 overflow-y-auto"
            style={{ backgroundColor: colors.white }}
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavigate(link.path)}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium transition"
                  style={{
                    backgroundColor:
                      location.pathname === link.path
                        ? colors.primary
                        : "#F5F5F5",
                    color:
                      location.pathname === link.path
                        ? colors.primaryDark
                        : colors.text,
                  }}
                >
                  {link.label}
                </button>
              ))}
              <hr style={{ borderColor: colors.border }} />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-2"
                style={{ color: "#D32F2F" }}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <HubRoutes />
      </main>
    </div>
  );
};

export default HubHome;
