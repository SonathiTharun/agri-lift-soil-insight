import React from 'react';
import { ExecutiveNavbar } from "@/components/ExecutiveNavbar";
import { withAuth } from "@/contexts/AuthContext";
import GeographicDashboard from "@/components/executive/GeographicDashboard";

const ExecutiveGeographic = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExecutiveNavbar />
      <div className="pt-16">
        <GeographicDashboard />
      </div>
    </div>
  );
};

export default withAuth(ExecutiveGeographic);
