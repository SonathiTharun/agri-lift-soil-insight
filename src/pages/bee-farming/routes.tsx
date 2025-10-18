import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import BeeColonyMarket from "./BeeColonyMarket";
import HoneyMarketplace from "./HoneyMarketplace";
import EquipmentMart from "./EquipmentMart";
import ExpertConsultation from "./ExpertConsultation";

const BeeFarmingRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="bee-colonies" element={<BeeColonyMarket />} />
    <Route path="honey-market" element={<HoneyMarketplace />} />
    <Route path="equipment" element={<EquipmentMart />} />
    <Route path="expert-advice" element={<ExpertConsultation />} />
  </Routes>
);

export default BeeFarmingRoutes;

