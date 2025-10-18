import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import { ShoppingCart, Star, Package } from "lucide-react";

const colors = {
  primary: "#0077B6",
  primaryDark: "#005A8D",
  secondary: "#E0F7FF",
  success: "#4CAF50",
  text: "#1A1A1A",
  textLight: "#505050",
  white: "#FFFFFF",
};

// Marketplace Page
const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = [
    { id: 1, name: "Fresh Fish (1kg)", price: "₹350", seller: "Ocean Fresh", rating: 4.8, category: "fish" },
    { id: 2, name: "Shrimp (500g)", price: "₹450", seller: "Sea Harvest", rating: 4.9, category: "shrimp" },
    { id: 3, name: "Crab (1kg)", price: "₹650", seller: "Marine Catch", rating: 4.7, category: "crab" },
    { id: 4, name: "Oysters (500g)", price: "₹380", seller: "Pearl Seafood", rating: 4.8, category: "oysters" },
    { id: 5, name: "Seaweed (200g)", price: "₹120", seller: "Ocean Greens", rating: 4.6, category: "seaweed" },
    { id: 6, name: "Fish Feed (25kg)", price: "₹2,500", seller: "Aqua Feed Co", rating: 4.9, category: "feed" },
  ];

  const categories = [
    { id: "all", label: "All Products" },
    { id: "fish", label: "Fish" },
    { id: "shrimp", label: "Shrimp" },
    { id: "crab", label: "Crab" },
    { id: "oysters", label: "Oysters" },
  ];

  const filteredProducts = selectedCategory === "all" ? products : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary }}>
      <div className="py-12 px-4" style={{ backgroundColor: colors.primaryDark }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">🌊 Seafood Marketplace</h1>
          <p className="text-blue-100 text-lg">Buy and sell premium seafood and aquaculture products</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10 flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="px-5 py-2.5 rounded-lg font-semibold transition duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: selectedCategory === cat.id ? colors.primary : colors.white,
                color: selectedCategory === cat.id ? colors.white : colors.text,
                border: `2px solid ${colors.primary}`,
                boxShadow: selectedCategory === cat.id ? `0 4px 12px ${colors.primary}40` : "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-xl p-6 transition duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
              style={{
                backgroundColor: colors.white,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                  <Package size={24} style={{ color: colors.primary }} />
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1.5 rounded-lg">
                  <Star size={14} style={{ color: "#FFB800" }} fill="#FFB800" />
                  <span className="text-xs font-bold" style={{ color: colors.text }}>{product.rating}</span>
                </div>
              </div>
              <h3 className="text-base font-bold mb-1.5 line-clamp-2" style={{ color: colors.text }}>
                {product.name}
              </h3>
              <p className="text-xs mb-4 line-clamp-1" style={{ color: colors.textLight }}>
                {product.seller}
              </p>
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <span className="text-xl font-bold" style={{ color: colors.primary }}>
                  {product.price}
                </span>
                <button
                  className="p-2.5 rounded-lg font-semibold transition duration-200 hover:scale-110 active:scale-95 text-white flex items-center justify-center"
                  style={{
                    backgroundColor: colors.primary,
                    boxShadow: `0 4px 12px ${colors.primary}40`,
                  }}
                  onClick={() => alert(`Added ${product.name} to cart!`)}
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Management Page
const Management = () => {
  const [activeTab, setActiveTab] = useState("ponds");

  const tabs = [
    { id: "ponds", label: "Pond Management", icon: "💧" },
    { id: "water", label: "Water Quality", icon: "🧪" },
    { id: "production", label: "Production Tracking", icon: "📊" },
    { id: "schedule", label: "Maintenance Schedule", icon: "📅" },
  ];

  const pondData = [
    { id: 1, name: "Pond A", area: "2 acres", fishType: "Tilapia", status: "Healthy", lastTest: "2025-10-15" },
    { id: 2, name: "Pond B", area: "3 acres", fishType: "Catfish", status: "Healthy", lastTest: "2025-10-14" },
    { id: 3, name: "Pond C", area: "2.5 acres", fishType: "Shrimp", status: "Healthy", lastTest: "2025-10-13" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary }}>
      <div className="py-12 px-4" style={{ backgroundColor: colors.primaryDark }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Aquaculture Management</h1>
          <p className="text-blue-100 text-lg">Manage your ponds and aquaculture operations</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex gap-3 mb-10 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-5 py-2.5 rounded-lg font-semibold transition duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
              style={{
                backgroundColor: activeTab === tab.id ? colors.primary : colors.white,
                color: activeTab === tab.id ? colors.white : colors.text,
                border: `2px solid ${colors.primary}`,
                boxShadow: activeTab === tab.id ? `0 4px 12px ${colors.primary}40` : "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "ponds" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pondData.map((pond) => (
              <div
                key={pond.id}
                className="rounded-xl p-6 transition duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
                style={{
                  backgroundColor: colors.white,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div className="text-4xl mb-4 p-2 w-fit rounded-lg" style={{ backgroundColor: colors.secondary }}>💧</div>
                <h3 className="text-base font-bold mb-1.5" style={{ color: colors.text }}>
                  {pond.name}
                </h3>
                <div className="space-y-2 text-xs mb-4" style={{ color: colors.textLight }}>
                  <p><strong>Area:</strong> {pond.area}</p>
                  <p><strong>Fish Type:</strong> {pond.fishType}</p>
                  <p><strong>Status:</strong> <span style={{ color: colors.success, fontWeight: "bold" }}>{pond.status}</span></p>
                  <p><strong>Last Test:</strong> {pond.lastTest}</p>
                </div>
                <button
                  className="w-full mt-4 px-4 py-2.5 rounded-lg font-semibold transition duration-200 hover:scale-105 active:scale-95 text-white"
                  style={{
                    backgroundColor: colors.primary,
                    boxShadow: `0 4px 12px ${colors.primary}40`,
                  }}
                  onClick={() => alert(`Viewing details for ${pond.name}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "water" && (
          <div className="rounded-lg p-8 shadow-md" style={{ backgroundColor: colors.white }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>Water Quality Monitoring</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pondData.map((pond) => (
                <div key={pond.id} className="p-6 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                  <h3 className="font-bold mb-4" style={{ color: colors.text }}>{pond.name}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: colors.textLight }}>pH Level:</span>
                      <span style={{ color: colors.primary }}>7.2</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colors.textLight }}>Temperature:</span>
                      <span style={{ color: colors.primary }}>28°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colors.textLight }}>Dissolved Oxygen:</span>
                      <span style={{ color: colors.primary }}>6.5 mg/L</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "production" && (
          <div className="rounded-lg p-8 shadow-md" style={{ backgroundColor: colors.white }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>Production Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>2,400 kg</div>
                <p style={{ color: colors.textLight }}>Monthly Fish Yield</p>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>7.5 acres</div>
                <p style={{ color: colors.textLight }}>Total Pond Area</p>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>3</div>
                <p style={{ color: colors.textLight }}>Active Ponds</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="rounded-lg p-8 shadow-md" style={{ backgroundColor: colors.white }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>Maintenance Schedule</h2>
            <div className="space-y-4">
              {[
                { task: "Water Quality Test", date: "2025-10-20", status: "Scheduled" },
                { task: "Pond Cleaning", date: "2025-10-25", status: "Pending" },
                { task: "Equipment Maintenance", date: "2025-10-18", status: "Completed" },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg flex items-center justify-between" style={{ backgroundColor: colors.secondary }}>
                  <div>
                    <h3 className="font-bold" style={{ color: colors.text }}>{item.task}</h3>
                    <p style={{ color: colors.textLight }}>{item.date}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: item.status === "Completed" ? colors.success : colors.primary,
                      color: colors.white,
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Equipment Page
const Equipment = () => {
  const [selectedType, setSelectedType] = useState("all");

  const equipment = [
    { id: 1, name: "Aerator", price: "₹8,500", type: "aeration", image: "💨" },
    { id: 2, name: "Water Pump", price: "₹12,000", type: "pumping", image: "💧" },
    { id: 3, name: "Fish Net", price: "₹2,500", type: "tools", image: "🥅" },
    { id: 4, name: "Filtration System", price: "₹25,000", type: "filtration", image: "🔄" },
    { id: 5, name: "pH Meter", price: "₹3,500", type: "testing", image: "🧪" },
    { id: 6, name: "Pond Liner", price: "₹15,000", type: "construction", image: "📦" },
  ];

  const types = [
    { id: "all", label: "All Equipment" },
    { id: "aeration", label: "Aeration" },
    { id: "pumping", label: "Pumping" },
    { id: "tools", label: "Tools" },
    { id: "filtration", label: "Filtration" },
  ];

  const filtered = selectedType === "all" ? equipment : equipment.filter(e => e.type === selectedType);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary }}>
      <div className="py-12 px-4" style={{ backgroundColor: colors.primaryDark }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Aquaculture Equipment</h1>
          <p className="text-blue-100 text-lg">Browse and purchase aquaculture equipment and supplies</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10 flex gap-3 flex-wrap">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className="px-5 py-2.5 rounded-lg font-semibold transition duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: selectedType === type.id ? colors.primary : colors.white,
                color: selectedType === type.id ? colors.white : colors.text,
                border: `2px solid ${colors.primary}`,
                boxShadow: selectedType === type.id ? `0 4px 12px ${colors.primary}40` : "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-xl p-6 transition duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
              style={{
                backgroundColor: colors.white,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <div className="text-5xl mb-4 p-3 w-fit rounded-lg" style={{ backgroundColor: colors.secondary }}>{item.image}</div>
              <h3 className="text-base font-bold mb-4 line-clamp-2" style={{ color: colors.text }}>
                {item.name}
              </h3>
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <span className="text-xl font-bold" style={{ color: colors.primary }}>
                  {item.price}
                </span>
                <button
                  className="p-2.5 rounded-lg font-semibold transition duration-200 hover:scale-110 active:scale-95 text-white flex items-center justify-center"
                  style={{
                    backgroundColor: colors.primary,
                    boxShadow: `0 4px 12px ${colors.primary}40`,
                  }}
                  onClick={() => alert(`Added ${item.name} to cart!`)}
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HubRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="marketplace" element={<Marketplace />} />
    <Route path="management" element={<Management />} />
    <Route path="equipment" element={<Equipment />} />
    <Route path="*" element={<Dashboard />} />
  </Routes>
);

export default HubRoutes;
