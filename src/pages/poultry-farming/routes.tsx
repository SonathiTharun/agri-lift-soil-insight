import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import { ShoppingCart, Star, Package } from "lucide-react";

const colors = {
  primary: "#E76F51",
  primaryDark: "#D45A3A",
  secondary: "#FFF3E6",
  success: "#4CAF50",
  text: "#1A1A1A",
  textLight: "#505050",
  white: "#FFFFFF",
};

// Marketplace Page
const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = [
    { id: 1, name: "Fresh Eggs (30 pcs)", price: "₹180", seller: "Farm Fresh Eggs", rating: 4.9, category: "eggs" },
    { id: 2, name: "Chicken (1kg)", price: "₹280", seller: "Quality Poultry", rating: 4.8, category: "meat" },
    { id: 3, name: "Duck Eggs (12 pcs)", price: "₹150", seller: "Duck Farm", rating: 4.7, category: "eggs" },
    { id: 4, name: "Broiler Chicks", price: "₹25/pc", seller: "Hatchery Pro", rating: 4.8, category: "chicks" },
    { id: 5, name: "Layer Feed (25kg)", price: "₹850", seller: "Feed Co", rating: 4.6, category: "feed" },
    { id: 6, name: "Poultry Supplements", price: "₹450", seller: "Health Plus", rating: 4.9, category: "supplements" },
  ];

  const categories = [
    { id: "all", label: "All Products" },
    { id: "eggs", label: "Eggs" },
    { id: "meat", label: "Meat" },
    { id: "chicks", label: "Chicks" },
    { id: "feed", label: "Feed" },
  ];

  const filteredProducts = selectedCategory === "all" ? products : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary }}>
      <div className="py-12 px-4" style={{ backgroundColor: colors.primaryDark }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">🐔 Poultry Marketplace</h1>
          <p className="text-orange-100 text-lg">Buy and sell premium poultry and eggs</p>
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
  const [activeTab, setActiveTab] = useState("flocks");

  const tabs = [
    { id: "flocks", label: "Flock Management", icon: "🐔" },
    { id: "health", label: "Health Records", icon: "🏥" },
    { id: "production", label: "Production Tracking", icon: "📊" },
    { id: "schedule", label: "Maintenance Schedule", icon: "📅" },
  ];

  const flockData = [
    { id: 1, name: "Flock A", birds: "500", breed: "Leghorn", status: "Healthy", lastCheckup: "2025-10-15" },
    { id: 2, name: "Flock B", birds: "450", breed: "Rhode Island", status: "Healthy", lastCheckup: "2025-10-14" },
    { id: 3, name: "Flock C", birds: "480", breed: "Wyandotte", status: "Healthy", lastCheckup: "2025-10-13" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary }}>
      <div className="py-12 px-4" style={{ backgroundColor: colors.primaryDark }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Flock Management</h1>
          <p className="text-orange-100 text-lg">Manage your flocks and poultry operations</p>
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

        {activeTab === "flocks" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flockData.map((flock) => (
              <div
                key={flock.id}
                className="rounded-xl p-6 transition duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
                style={{
                  backgroundColor: colors.white,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div className="text-4xl mb-4 p-2 w-fit rounded-lg" style={{ backgroundColor: colors.secondary }}>🐔</div>
                <h3 className="text-base font-bold mb-1.5" style={{ color: colors.text }}>
                  {flock.name}
                </h3>
                <div className="space-y-2 text-xs mb-4" style={{ color: colors.textLight }}>
                  <p><strong>Birds:</strong> {flock.birds}</p>
                  <p><strong>Breed:</strong> {flock.breed}</p>
                  <p><strong>Status:</strong> <span style={{ color: colors.success, fontWeight: "bold" }}>{flock.status}</span></p>
                  <p><strong>Last Checkup:</strong> {flock.lastCheckup}</p>
                </div>
                <button
                  className="w-full mt-4 px-4 py-2.5 rounded-lg font-semibold transition duration-200 hover:scale-105 active:scale-95 text-white"
                  style={{
                    backgroundColor: colors.primary,
                    boxShadow: `0 4px 12px ${colors.primary}40`,
                  }}
                  onClick={() => alert(`Viewing details for ${flock.name}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "health" && (
          <div className="rounded-lg p-8 shadow-md" style={{ backgroundColor: colors.white }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>Health Records</h2>
            <div className="space-y-4">
              {flockData.map((flock) => (
                <div key={flock.id} className="p-4 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold" style={{ color: colors.text }}>{flock.name}</h3>
                      <p style={{ color: colors.textLight }}>Last Checkup: {flock.lastCheckup}</p>
                    </div>
                    <button
                      className="px-4 py-2 rounded-lg font-medium text-white"
                      style={{ backgroundColor: colors.primary }}
                      onClick={() => alert(`Viewing health records for ${flock.name}`)}
                    >
                      View Records
                    </button>
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
                <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>4,200</div>
                <p style={{ color: colors.textLight }}>Daily Egg Production</p>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>1,430</div>
                <p style={{ color: colors.textLight }}>Total Birds</p>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>3</div>
                <p style={{ color: colors.textLight }}>Active Flocks</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="rounded-lg p-8 shadow-md" style={{ backgroundColor: colors.white }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>Maintenance Schedule</h2>
            <div className="space-y-4">
              {[
                { task: "Veterinary Checkup", date: "2025-10-20", status: "Scheduled" },
                { task: "Coop Cleaning", date: "2025-10-22", status: "Pending" },
                { task: "Feed Inventory Check", date: "2025-10-18", status: "Completed" },
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
    { id: 1, name: "Chicken Coop", price: "₹8,500", type: "housing", image: "🏠" },
    { id: 2, name: "Feeder", price: "₹1,200", type: "feeding", image: "🍽️" },
    { id: 3, name: "Waterer", price: "₹800", type: "feeding", image: "💧" },
    { id: 4, name: "Egg Incubator", price: "₹12,000", type: "breeding", image: "🥚" },
    { id: 5, name: "Nesting Box", price: "₹2,500", type: "housing", image: "📦" },
    { id: 6, name: "Poultry Net", price: "₹3,500", type: "protection", image: "🥅" },
  ];

  const types = [
    { id: "all", label: "All Equipment" },
    { id: "housing", label: "Housing" },
    { id: "feeding", label: "Feeding" },
    { id: "breeding", label: "Breeding" },
    { id: "protection", label: "Protection" },
  ];

  const filtered = selectedType === "all" ? equipment : equipment.filter(e => e.type === selectedType);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary }}>
      <div className="py-12 px-4" style={{ backgroundColor: colors.primaryDark }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Poultry Equipment</h1>
          <p className="text-orange-100 text-lg">Browse and purchase poultry equipment and supplies</p>
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
