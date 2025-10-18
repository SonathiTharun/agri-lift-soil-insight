# Unified Farming Hubs - Complete Redesign Template

## 🎯 Project Status

### ✅ Completed
- [x] Global Design System (`src/lib/theme.ts`)
- [x] Unified Layout Component (`src/components/hub/HubLayout.tsx`)
- [x] Navigation Components (TopNav, Sidebar)
- [x] Reusable UI Components (Card, MetricCard, FeatureCard, ExpertAdviceWidget)
- [x] Example Implementation (Bee Hub - `src/pages/bee-farming/DashboardNew.tsx`)
- [x] Implementation Guide

### 🔄 In Progress
- [ ] Dairy Hub Dashboard Update
- [ ] Marine Hub Dashboard Update
- [ ] Poultry Hub Dashboard Update
- [ ] Organic Hub Dashboard Update
- [ ] Crop Hub Dashboard Update

### 📋 To Do
- [ ] Integrate Expert Advice Widget across all hubs
- [ ] Test responsive design on all devices
- [ ] Verify accessibility compliance
- [ ] Performance optimization

## 🎨 Design System Overview

### Color Palette

```
Dairy:   #A4C8F0 (Pastel Blue) + #0D3B66 (Deep Navy)
Bee:     #F7C948 (Honey Gold) + #E2A100 (Amber)
Marine:  #0077B6 (Ocean Blue) + #90E0EF (Seafoam)
Poultry: #E76F51 (Warm Salmon) + #FFF3E6 (Cream)
Organic: #3E8914 (Forest Green) + #E9E7DA (Beige)
Crop:    #E8C547 (Wheat Gold) + #556B2F (Olive)
```

### Typography
- Headings: Poppins, Inter, Nunito Sans (600 weight)
- Body: Roboto, Lato (400 weight)

### Spacing & Shadows
- Consistent 8px grid system
- Soft shadows for depth
- Rounded corners (16-24px)

## 📝 Implementation Steps for Each Hub

### Step 1: Update Dashboard Component

Replace old dashboard with new structure:

```typescript
import { MetricCard, FeatureCard } from "@/components/hub";
import { HUB_THEMES } from "@/lib/theme";

const theme = HUB_THEMES.dairy; // or bee, marine, etc.

// Use MetricCard for KPIs
<MetricCard
  title="Active Cattle"
  value={24}
  unit="heads"
  trend="up"
  trendValue={12}
  accentColor={theme.primaryAccent}
/>

// Use FeatureCard for services
<FeatureCard
  title="Service Name"
  description="Service description"
  accentColor={theme.primaryAccent}
/>
```

### Step 2: Update Hub Home Component

Wrap with HubLayout:

```typescript
import { HubLayout } from "@/components/hub";

const HubHome = () => {
  const navLinks = [
    { label: "Home", path: "/hub-name" },
    { label: "Service 1", path: "/hub-name/service1" },
  ];

  return (
    <HubLayout hubId="dairy" navLinks={navLinks}>
      <Dashboard />
    </HubLayout>
  );
};
```

### Step 3: Add Expert Advice Widget

```typescript
import { ExpertAdviceWidget } from "@/components/hub";

// Add to main layout or dashboard
<ExpertAdviceWidget
  hubName="Dairy Lift"
  accentColor={theme.primaryAccent}
/>
```

## 🔧 Component API Reference

### MetricCard Props
- `title`: string
- `value`: number | string
- `unit`: string (optional)
- `trend`: "up" | "down" | "neutral"
- `trendValue`: number
- `icon`: React.ReactNode
- `accentColor`: string (hex color)
- `animated`: boolean (default: true)

### FeatureCard Props
- `title`: string
- `description`: string
- `icon`: React.ReactNode
- `accentColor`: string
- `onClick`: () => void
- `badge`: string (optional)

### HubLayout Props
- `hubId`: HubType ("dairy" | "bee" | "marine" | "poultry" | "organic" | "crop")
- `navLinks`: Array<{ label: string; path: string }>
- `children`: React.ReactNode

## 📱 Responsive Breakpoints

- Mobile: ≤ 640px
- Tablet: 641–1024px
- Desktop: > 1024px

All components use Tailwind's responsive utilities (md:, lg:, etc.)

## ♿ Accessibility Features

- WCAG 2.1 AA compliant
- Contrast ratios ≥ 4.5:1
- Minimum touch target: 44×44px
- Full keyboard navigation
- Focus indicators visible
- Supports prefers-reduced-motion

## 🚀 Quick Start

1. Copy `DashboardNew.tsx` pattern from Bee Hub
2. Update theme reference to your hub
3. Customize metrics and services
4. Update navigation links
5. Test on mobile, tablet, desktop
6. Verify accessibility

## 📊 Example Files

- **Bee Hub Example**: `src/pages/bee-farming/DashboardNew.tsx`
- **Theme Config**: `src/lib/theme.ts`
- **Components**: `src/components/hub/`

## 🎯 Next Steps

1. Apply template to remaining hubs
2. Integrate Expert Advice Widget
3. Add Contact Forms
4. Implement Data Tables
5. Add Charts/Analytics
6. Performance testing
7. Accessibility audit
8. User testing

## 📞 Support

For questions or issues, refer to:
- `UNIFIED_FARMING_HUBS_IMPLEMENTATION_GUIDE.md`
- Component source files in `src/components/hub/`
- Theme configuration in `src/lib/theme.ts`

