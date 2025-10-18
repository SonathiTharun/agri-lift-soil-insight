import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import { ShoppingCart, Star, Package } from "lucide-react";

const colors = {
  primary: "#3E8914",
  primaryDark: "#2D6A0F",
  secondary: "#F0F8E8",
  success: "#4CAF50",
  text: "#1A1A1A",
  textLight: "#505050",
  white: "#FFFFFF",
};

// Marketplace Page
const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = [
    { id: 1, name: "Organic Rice (5kg)", price: "₹450", seller: "Green Farm", rating: 4.9, category: "grains" },
    { id: 2, name: "Organic Vegetables (1kg)", price: "₹180", seller: "Fresh Organic", rating: 4.8, category: "vegetables" },
    { id: 3, name: "Organic Pulses (1kg)", price: "₹280", seller: "Pure Organic", rating: 4.7, category: "pulses" },
    { id: 4, name: "Organic Honey (500g)", price: "₹350", seller: "Organic Bee", rating: 4.8, category: "honey" },
    { id: 5, name: "Organic Spices (100g)", price: "₹150", seller: "Spice Farm", rating: 4.6, category: "spices" },
    { id: 6, name: "Organic Oils (1L)", price: "₹380", seller: "Oil Press", rating: 4.9, category: "oils" },
  ];

  const categories = [
    { id: "all", label: "All Products" },
    { id: "grains", label: "Grains" },
    { id: "vegetables", label: "Vegetables" },
    { id: "pulses", label: "Pulses" },
    { id: "honey", label: "Honey" },
  ];

  const filteredProducts = selectedCategory === "all" ? products : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary }}>
      <div className="py-12 px-4" style={{ backgroundColor: colors.primaryDark }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">🌱 Organic Marketplace</h1>
          <p className="text-green-100 text-lg">Buy and sell certified organic products</p>
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
  const [activeTab, setActiveTab] = useState("fields");

  const tabs = [
    { id: "fields", label: "Field Management", icon: "🌾" },
    { id: "soil", label: "Soil Health", icon: "🌍" },
    { id: "production", label: "Production Tracking", icon: "📊" },
    { id: "schedule", label: "Maintenance Schedule", icon: "📅" },
  ];

  const fieldData = [
    { id: 1, name: "Field A", crop: "Rice", area: "2 acres", status: "Growing", lastTended: "2025-10-15" },
    { id: 2, name: "Field B", crop: "Wheat", area: "2.5 acres", status: "Growing", lastTended: "2025-10-14" },
    { id: 3, name: "Field C", crop: "Pulses", area: "1.5 acres", status: "Harvesting", lastTended: "2025-10-13" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary }}>
      <div className="py-12 px-4" style={{ backgroundColor: colors.primaryDark }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Organic Farm Management</h1>
          <p className="text-green-100 text-lg">Manage your organic crops and farm operations</p>
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

        {activeTab === "fields" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fieldData.map((field) => (
              <div
                key={field.id}
                className="rounded-xl p-6 transition duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
                style={{
                  backgroundColor: colors.white,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div className="text-4xl mb-4 p-2 w-fit rounded-lg" style={{ backgroundColor: colors.secondary }}>🌾</div>
                <h3 className="text-base font-bold mb-1.5" style={{ color: colors.text }}>
                  {field.name}
                </h3>
                <div className="space-y-2 text-xs mb-4" style={{ color: colors.textLight }}>
                  <p><strong>Crop:</strong> {field.crop}</p>
                  <p><strong>Area:</strong> {field.area}</p>
                  <p><strong>Status:</strong> <span style={{ color: colors.success, fontWeight: "bold" }}>{field.status}</span></p>
                  <p><strong>Last Tended:</strong> {field.lastTended}</p>
                </div>
                <button
                  className="w-full mt-4 px-4 py-2.5 rounded-lg font-semibold transition duration-200 hover:scale-105 active:scale-95 text-white"
                  style={{
                    backgroundColor: colors.primary,
                    boxShadow: `0 4px 12px ${colors.primary}40`,
                  }}
                  onClick={() => alert(`Viewing details for ${field.name}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "soil" && (
          <div className="rounded-lg p-8 shadow-md" style={{ backgroundColor: colors.white }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>Soil Health Monitoring</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fieldData.map((field) => (
                <div key={field.id} className="p-6 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                  <h3 className="font-bold mb-4" style={{ color: colors.text }}>{field.name}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: colors.textLight }}>pH Level:</span>
                      <span style={{ color: colors.primary }}>6.8</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colors.textLight }}>Organic Matter:</span>
                      <span style={{ color: colors.primary }}>4.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colors.textLight }}>Nitrogen:</span>
                      <span style={{ color: colors.primary }}>180 kg/ha</span>
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
                <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>1,650 kg</div>
                <p style={{ color: colors.textLight }}>Monthly Organic Yield</p>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>6 acres</div>
                <p style={{ color: colors.textLight }}>Total Certified Area</p>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>3</div>
                <p style={{ color: colors.textLight }}>Active Fields</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="rounded-lg p-8 shadow-md" style={{ backgroundColor: colors.white }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>Maintenance Schedule</h2>
            <div className="space-y-4">
              {[
                { task: "Soil Testing", date: "2025-10-20", status: "Scheduled" },
                { task: "Crop Rotation Planning", date: "2025-10-25", status: "Pending" },
                { task: "Compost Preparation", date: "2025-10-18", status: "Completed" },
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
    { id: 1, name: "Organic Compost", price: "₹500/bag", type: "soil", image: "🌱" },
    { id: 2, name: "Tractor", price: "₹8,50,000", type: "machinery", image: "🚜" },
    { id: 3, name: "Plow", price: "₹25,000", type: "tools", image: "🔧" },
    { id: 4, name: "Seed Drill", price: "₹35,000", type: "machinery", image: "📦" },
    { id: 5, name: "Organic Fertilizer", price: "₹300/kg", type: "soil", image: "🌾" },
    { id: 6, name: "Irrigation System", price: "₹45,000", type: "water", image: "💧" },
  ];

  const types = [
    { id: "all", label: "All Equipment" },
    { id: "soil", label: "Soil" },
    { id: "machinery", label: "Machinery" },
    { id: "tools", label: "Tools" },
    { id: "water", label: "Water" },
  ];

  const filtered = selectedType === "all" ? equipment : equipment.filter(e => e.type === selectedType);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary }}>
      <div className="py-12 px-4" style={{ backgroundColor: colors.primaryDark }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Organic Farming Equipment</h1>
          <p className="text-green-100 text-lg">Browse and purchase organic farming equipment and supplies</p>
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
