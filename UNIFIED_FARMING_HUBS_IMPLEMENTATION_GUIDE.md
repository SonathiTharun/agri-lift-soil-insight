# Unified Farming Hubs - Implementation Guide

## 🎯 Overview

This guide explains how to use the new unified design system for all farming hubs (Dairy, Bee, Marine, Poultry, Organic, Crop).

## 📁 New File Structure

```
src/
├── lib/
│   └── theme.ts                    # Global theme configuration
├── components/hub/
│   ├── HubLayout.tsx               # Main layout wrapper
│   ├── HubTopNav.tsx               # Navigation header
│   ├── HubSidebar.tsx              # Sidebar menu
│   ├── HubCard.tsx                 # Reusable card component
│   ├── MetricCard.tsx              # Statistics card
│   ├── FeatureCard.tsx             # Feature showcase card
│   ├── ExpertAdviceWidget.tsx      # Expert advice floating widget
│   └── index.ts                    # Barrel export
```

## 🎨 Theme System

### Available Hubs

```typescript
import { HUB_THEMES } from "@/lib/theme";

// Access any hub theme
const dairyTheme = HUB_THEMES.dairy;
const beeTheme = HUB_THEMES.bee;
const marineTheme = HUB_THEMES.marine;
const poultryTheme = HUB_THEMES.poultry;
const organicTheme = HUB_THEMES.organic;
const cropTheme = HUB_THEMES.crop;
```

### Theme Properties

Each theme includes:
- `id`: Unique identifier
- `name`: Display name
- `emoji`: Hub emoji
- `primaryAccent`: Main color (#hex)
- `secondaryAccent`: Secondary color
- `gradient`: Background gradient (Tailwind classes)
- `navGradient`: Navigation gradient
- `sidebarGradient`: Sidebar gradient
- `accentGradient`: Accent gradient
- `motif`: Visual description

## 🏗️ Using HubLayout

### Basic Setup

```typescript
import { HubLayout } from "@/components/hub";
import { HUB_THEMES } from "@/lib/theme";

const MyHubHome = () => {
  const theme = HUB_THEMES.dairy;
  
  const navLinks = [
    { label: "Home", path: "/dairy-lift" },
    { label: "Livestock", path: "/dairy-lift/livestock-market" },
    { label: "Equipment", path: "/dairy-lift/equipment-mart" },
  ];

  return (
    <HubLayout hubId="dairy" navLinks={navLinks}>
      {/* Your hub content here */}
    </HubLayout>
  );
};
```

## 🎴 Using Components

### MetricCard

```typescript
import { MetricCard } from "@/components/hub";
import { Milk } from "lucide-react";

<MetricCard
  title="Active Cattle"
  value={24}
  unit="heads"
  trend="up"
  trendValue={12}
  icon={<Milk size={24} />}
  accentColor={theme.primaryAccent}
/>
```

### FeatureCard

```typescript
import { FeatureCard } from "@/components/hub";
import { Award } from "lucide-react";

<FeatureCard
  title="Equipment Mart"
  description="Browse farming machinery"
  icon={<Award size={32} />}
  accentColor={theme.primaryAccent}
  badge="Popular"
  onClick={() => navigate("/dairy-lift/equipment-mart")}
/>
```

### ExpertAdviceWidget

```typescript
import { ExpertAdviceWidget } from "@/components/hub";

<ExpertAdviceWidget
  hubName="Dairy Lift"
  accentColor={theme.primaryAccent}
/>
```

## 🎯 Color Palette Reference

| Hub | Primary | Secondary | Motif |
|-----|---------|-----------|-------|
| 🥛 Dairy | #A4C8F0 | #0D3B66 | Clean, cool, reliable |
| 🐝 Bee | #F7C948 | #E2A100 | Natural, warm, optimistic |
| 🌊 Marine | #0077B6 | #90E0EF | Calm, aquatic, precise |
| 🐔 Poultry | #E76F51 | #FFF3E6 | Friendly, energetic |
| 🌱 Organic | #3E8914 | #E9E7DA | Natural, healthy, earthy |
| 🌾 Crop | #E8C547 | #556B2F | Productive, rich, fertile |

## 📱 Responsive Design

All components are fully responsive:
- **Mobile**: ≤ 640px
- **Tablet**: 641–1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- Contrast ratios ≥ 4.5:1
- All interactive elements ≥ 44×44 px
- Full keyboard navigation
- Focus rings visible
- Supports prefers-reduced-motion

## 🚀 Migration Steps

1. Update hub home component to use `HubLayout`
2. Replace dashboard with new components
3. Update navigation links
4. Test responsive design
5. Verify accessibility

## 📊 Example Dashboard

See `src/pages/dairy-lift/Dashboard.tsx` for a complete example implementation.

