#!/usr/bin/env python3
"""
Update routes files for all farming hubs to use the new Dashboard component
"""

import os

ROUTES_TEMPLATE = '''import React from "react";
import {{ Routes, Route }} from "react-router-dom";
import Dashboard from "./Dashboard";

const HubRoutes = () => (
  <Routes>
    <Route path="/" element={{<Dashboard />}} />
    <Route path="dashboard" element={{<Dashboard />}} />
    <Route path="*" element={{<Dashboard />}} />
  </Routes>
);

export default HubRoutes;
'''

HUBS = [
    "bee-farming",
    "marine-farming",
    "poultry-farming",
    "organic-farming",
    "crop-farming",
]

for hub in HUBS:
    path = f"src/pages/{hub}/routes.tsx"
    
    # Create the routes file
    content = ROUTES_TEMPLATE
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Updated {path}")

print("\n✅ All routes files updated successfully!")

