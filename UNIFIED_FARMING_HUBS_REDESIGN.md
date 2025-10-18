# Unified Farming Hubs Redesign - Implementation Guide

## ✅ Completed Components

### Phase 1: Design System & Core Components ✓
- **HubButton.tsx** - Reusable button component with variants (primary, secondary, ghost, outline)
- **ContactForm.tsx** - Professional contact form with validation and success states
- **UnifiedHubDashboard.tsx** - Template component for all hub dashboards
- **Enhanced HubTopNav.tsx** - Improved navigation with language selector, notifications, profile
- **Enhanced HubSidebar.tsx** - Updated sidebar with more menu options

### Phase 2: Global Navigation & Layout ✓
- Responsive header with hub-specific theming
- Hamburger menu with smooth animations
- Language selector dropdown
- Notification and profile icons
- Consistent layout structure across all hubs

### Phase 3: Hub-Specific Pages (In Progress)

#### Template Created:
- **HubDashboardTemplate.tsx** - Reusable template for all hubs

#### Dashboards to Create:
1. **Dairy Hub** - `/src/pages/dairy-lift/Dashboard.tsx`
2. **Bee Hub** - `/src/pages/bee-farming/Dashboard.tsx`
3. **Marine Hub** - `/src/pages/marine-farming/Dashboard.tsx`
4. **Poultry Hub** - `/src/pages/poultry-farming/Dashboard.tsx`
5. **Organic Hub** - `/src/pages/organic-farming/Dashboard.tsx`
6. **Crop Hub** - `/src/pages/crop-farming/Dashboard.tsx`

## 🎨 Design System

### Global Colors (Neutral Core)
- Background: #FFFFFF
- Surface: #F7F7F7
- Text Primary: #1A1A1A
- Text Secondary: #505050
- Success: #2E8B57
- Error: #D64545
- Info: #0B75D1

### Hub-Specific Accent Colors
| Hub | Primary | Secondary | Motif |
|-----|---------|-----------|-------|
| 🥛 Dairy | #A4C8F0 | #0D3B66 | Clean, cool, reliable |
| 🐝 Bee | #F7C948 | #E2A100 | Natural, warm, optimistic |
| 🌊 Marine | #0077B6 | #90E0EF | Calm, aquatic, precise |
| 🐔 Poultry | #E76F51 | #FFF3E6 | Friendly, energetic |
| 🌱 Organic | #3E8914 | #E9E7DA | Natural, healthy, earthy |
| 🌾 Crop | #E8C547 | #556B2F | Productive, rich, fertile |

## 📋 Implementation Checklist

### For Each Hub Dashboard:
- [ ] Create Dashboard.tsx with UnifiedHubDashboard component
- [ ] Define 4 key metrics with icons and trends
- [ ] Define 6 core features with descriptions and badges
- [ ] Add navigation links to feature pages
- [ ] Integrate ExpertAdviceWidget
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Verify accessibility (contrast, keyboard navigation)

### Hub Navigation Structure
Each hub should have these header buttons:
- Home
- Hub-specific pages (3-4 main sections)
- Expert Advice
- Contact

### Contact Page for Each Hub
- Use ContactForm component
- Hub-specific contact information
- Integration with messaging system

## 🚀 Quick Start for Creating Hub Dashboards

```typescript
import React from "react";
import { useNavigate } from "react-router-dom";
import { UnifiedHubDashboard, ExpertAdviceWidget } from "@/components/hub";
import { HUB_THEMES } from "@/lib/theme";
import { IconName } from "lucide-react";

const theme = HUB_THEMES.hubId; // dairy, bee, marine, poultry, organic, crop

const metrics = [
    {
        title: "Metric Name",
        value: 100,
        unit: "unit",
        trend: "up" as const,
        trendValue: 10,
        icon: <IconName size={24} style={{ color: theme.primaryAccent }} />,
    },
    // ... 3 more metrics
];

const features = [
    {
        title: "Feature Name",
        description: "Feature description",
        icon: <IconName size={32} />,
        badge: "Popular",
    },
    // ... 5 more features
];

const Dashboard = () => {
    const navigate = useNavigate();

    const handleFeatureClick = (index: number) => {
        const links = [
            "/hub-path/feature-1",
            // ... more links
        ];
        navigate(links[index] || "/hub-path");
    };

    return (
        <>
            <UnifiedHubDashboard
                theme={theme}
                heroTitle="Hub Title"
                heroDescription="Hub description"
                metrics={metrics}
                features={features.map((f, idx) => ({
                    ...f,
                    onClick: () => handleFeatureClick(idx),
                }))}
            />
            <ExpertAdviceWidget hubName={theme.name} accentColor={theme.primaryAccent} />
        </>
    );
};

export default Dashboard;
```

## 📱 Responsive Breakpoints
- Mobile: ≤ 640px
- Tablet: 641–1024px
- Desktop: > 1024px

## ♿ Accessibility Requirements
- Contrast ratios ≥ 4.5:1 for text
- All interactive elements ≥ 44×44 px
- Tab-navigable with visible focus rings
- Support prefers-reduced-motion

## 🔄 Next Steps
1. Create Dashboard.tsx for each hub using the template
2. Create Contact pages for each hub
3. Update routes.tsx in each hub to include new pages
4. Test all pages for responsiveness and accessibility
5. Integrate with backend APIs for real data

