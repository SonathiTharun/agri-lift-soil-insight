import React from "react";
import { motion } from "framer-motion";
import { X, Home, MessageSquare, Settings, LogOut, HelpCircle, Share2 } from "lucide-react";
import { HubTheme } from "@/lib/theme";

interface HubSidebarProps {
  theme: HubTheme;
  onHome: () => void;
  onClose: () => void;
  onContact?: () => void;
  onSettings?: () => void;
}

const HubSidebar: React.FC<HubSidebarProps> = ({
  theme,
  onHome,
  onClose,
  onContact,
  onSettings,
}) => {
  const menuItems = [
    { icon: Home, label: "Home", action: onHome },
    { icon: MessageSquare, label: "Contact Us", action: onContact || (() => {}) },
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
    { icon: Settings, label: "Settings", action: onSettings || (() => {}) },
    { icon: Share2, label: "Share Hub", action: () => {} },
  ];

  return (
    <motion.aside
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      exit={{ x: -320 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`bg-gradient-to-br ${theme.sidebarGradient} text-white w-80 min-h-screen p-8 flex flex-col fixed top-0 left-0 z-50 shadow-2xl rounded-r-3xl border-r-4`}
      style={{ borderRightColor: theme.primaryAccent }}
    >
      {/* Close Button */}
      <motion.button
        whileHover={{ scale: 1.15, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-6 right-6 p-3 hover:bg-white/20 rounded-xl transition-all duration-200"
        aria-label="Close sidebar"
      >
        <X size={28} className="text-white font-bold" strokeWidth={3} />
      </motion.button>

      {/* Hub Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center mt-12 mb-12"
      >
        <div
          className="rounded-full p-5 shadow-lg mb-4 flex items-center justify-center"
          style={{ backgroundColor: theme.primaryAccent }}
        >
          <span className="text-5xl">{theme.emoji}</span>
        </div>
        <h2 className="text-3xl font-bold tracking-wide text-center">
          {theme.name}
        </h2>
        <p className="text-sm text-white/80 mt-3 text-center italic font-medium">
          {theme.motif}
        </p>
      </motion.div>

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex flex-col gap-4"
      >
        {menuItems.map((item, idx) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            whileHover={{ scale: 1.05, x: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={item.action}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-xl hover:bg-white/15 transition-all duration-200 font-semibold text-lg"
          >
            <item.icon size={24} />
            <span>{item.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Divider */}
      <div className="my-6 h-1 bg-white/20 rounded-full" />

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-white/70 text-xs"
      >
        <p className="font-semibold mb-2">&copy; {new Date().getFullYear()}</p>
        <p className="text-white/60">{theme.name}</p>
        <p className="text-white/60 mt-1">Empowering Farmers</p>
      </motion.div>
    </motion.aside>
  );
};

export default HubSidebar;

