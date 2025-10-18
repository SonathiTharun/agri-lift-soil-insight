import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Lightbulb } from "lucide-react";
import HubCard from "./HubCard";

interface ExpertAdviceWidgetProps {
  hubName: string;
  accentColor?: string;
}

const ExpertAdviceWidget: React.FC<ExpertAdviceWidgetProps> = ({
  hubName,
  accentColor = "#3B82F6",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const tips = [
    "Monitor soil health regularly for optimal crop yield",
    "Use sustainable farming practices to protect the environment",
    "Stay updated with weather forecasts for better planning",
    "Connect with other farmers to share best practices",
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-30 text-white"
        style={{ backgroundColor: accentColor }}
        aria-label="Ask an expert"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] z-50"
            >
              <HubCard variant="elevated" className="flex flex-col h-96">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={20} style={{ color: accentColor }} />
                    <h3 className="font-bold text-gray-900">
                      Expert Advice - {hubName}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Tips Section */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-600 mb-3">
                    Quick Tips:
                  </p>
                  {tips.map((tip, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-sm text-gray-700 p-2 rounded-lg"
                      style={{ backgroundColor: `${accentColor}10` }}
                    >
                      • {tip}
                    </motion.div>
                  ))}
                </div>

                {/* Input Section */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleSendMessage()
                    }
                    placeholder="Ask a question..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ focusRingColor: accentColor }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    className="p-2 rounded-lg text-white transition-colors"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Send size={18} />
                  </motion.button>
                </div>
              </HubCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExpertAdviceWidget;

