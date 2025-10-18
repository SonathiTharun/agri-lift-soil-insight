# Quick Reference Guide - Diverse Farming Hubs

## 🎯 Quick Start

### Import Components
```typescript
import { HubLayout, MetricCard, FeatureCard, ExpertAdviceWidget } from "@/components/hub";
import { HUB_THEMES } from "@/lib/theme";
```

### Get Hub Theme
```typescript
const theme = HUB_THEMES.dairy;  // or bee, marine, poultry, organic, crop
```

### Create Dashboard
```typescript
const Dashboard = () => {
  const theme = HUB_THEMES.dairy;
  
  return (
    <div className="w-full min-h-screen pb-20">
      {/* Hero Section */}
      <motion.section className="max-w-6xl mx-auto text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Your Hub Title
        </h1>
      </motion.section>

      {/* Metrics Grid */}
      <motion.section className="max-w-6xl mx-auto px-4 md:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Metric 1"
            value={100}
            unit="unit"
            trend="up"
            trendValue={10}
            icon={<Icon size={24} />}
            accentColor={theme.primaryAccent}
          />
        </div>
      </motion.section>

      {/* Services Grid */}
      <motion.section className="max-w-6xl mx-auto px-4 md:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            title="Service"
            description="Description"
            icon={<Icon size={32} />}
            accentColor={theme.primaryAccent}
            onClick={() => navigate("/path")}
          />
        </div>
      </motion.section>

      {/* Expert Widget */}
      <ExpertAdviceWidget
        hubName={theme.name}
        accentColor={theme.primaryAccent}
      />
    </div>
  );
};
```

### Wrap with HubLayout
```typescript
const HubHome = () => {
  const navLinks = [
    { label: "Home", path: "/hub-name" },
    { label: "Service 1", path: "/hub-name/service1" },
    { label: "Service 2", path: "/hub-name/service2" },
  ];

  return (
    <HubLayout hubId="dairy" navLinks={navLinks}>
      <Dashboard />
    </HubLayout>
  );
};
```

## 🎨 Theme Colors

| Hub | Primary | Secondary | Gradient |
|-----|---------|-----------|----------|
| 🥛 Dairy | #A4C8F0 | #0D3B66 | from-blue-50 via-blue-100 to-blue-200 |
| 🐝 Bee | #F7C948 | #E2A100 | from-yellow-50 via-yellow-100 to-yellow-200 |
| 🌊 Marine | #0077B6 | #90E0EF | from-cyan-50 via-cyan-100 to-cyan-200 |
| 🐔 Poultry | #E76F51 | #FFF3E6 | from-orange-50 via-orange-100 to-orange-200 |
| 🌱 Organic | #3E8914 | #E9E7DA | from-green-50 via-green-100 to-green-200 |
| 🌾 Crop | #E8C547 | #556B2F | from-yellow-50 via-yellow-100 to-yellow-200 |

## 📦 Component Props

### MetricCard
```typescript
<MetricCard
  title="string"              // Card title
  value={number | string}     // Main value
  unit="string"               // Unit (optional)
  trend="up" | "down" | "neutral"  // Trend
  trendValue={number}         // Trend % (optional)
  icon={<Icon />}             // Icon component
  accentColor="#hex"          // Accent color
  animated={true}             // Animation (default: true)
/>
```

### FeatureCard
```typescript
<FeatureCard
  title="string"              // Card title
  description="string"        // Description
  icon={<Icon />}             // Icon component
  accentColor="#hex"          // Accent color
  onClick={() => {}}          // Click handler
  badge="string"              // Badge (optional)
/>
```

### HubLayout
```typescript
<HubLayout
  hubId="dairy"               // Hub ID
  navLinks={[                 // Navigation links
    { label: "Home", path: "/" }
  ]}
>
  {children}                  // Page content
</HubLayout>
```

### ExpertAdviceWidget
```typescript
<ExpertAdviceWidget
  hubName="string"            // Hub name
  accentColor="#hex"          // Accent color
/>
```

## 🎬 Animation Patterns

### Container Variants
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};
```

### Item Variants
```typescript
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
```

### Usage
```typescript
<motion.section
  variants={containerVariants}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
>
  <motion.div variants={itemVariants}>
    {/* Content */}
  </motion.div>
</motion.section>
```

## 🎯 Common Patterns

### Responsive Grid
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Items */}
</div>
```

### Max Width Container
```typescript
<div className="max-w-6xl mx-auto px-4 md:px-8">
  {/* Content */}
</div>
```

### Section Spacing
```typescript
<section className="max-w-6xl mx-auto px-4 md:px-8 mb-16">
  {/* Content */}
</section>
```

### Gradient Background
```typescript
<div className={`bg-gradient-to-br ${theme.gradient}`}>
  {/* Content */}
</div>
```

## 🔗 File Locations

| File | Purpose |
|------|---------|
| `src/lib/theme.ts` | Theme configuration |
| `src/components/hub/` | Hub components |
| `src/pages/*/DashboardNew.tsx` | Dashboard templates |
| `IMPLEMENTATION_SUMMARY.md` | Full documentation |
| `HUB_REDESIGN_TEMPLATE.md` | Implementation guide |
| `INTEGRATION_CHECKLIST.md` | Integration steps |

## 🚀 Common Tasks

### Add New Metric
```typescript
<MetricCard
  title="New Metric"
  value={123}
  unit="unit"
  trend="up"
  trendValue={5}
  icon={<Icon size={24} />}
  accentColor={theme.primaryAccent}
/>
```

### Add New Service
```typescript
<FeatureCard
  title="New Service"
  description="Service description"
  icon={<Icon size={32} />}
  accentColor={theme.primaryAccent}
  onClick={() => navigate("/path")}
/>
```

### Change Hub Theme
```typescript
// Change this line:
const theme = HUB_THEMES.dairy;

// To:
const theme = HUB_THEMES.bee;  // or marine, poultry, organic, crop
```

### Add Navigation Link
```typescript
const navLinks = [
  { label: "Home", path: "/hub-name" },
  { label: "New Link", path: "/hub-name/new-link" },  // Add here
];
```

## 🎨 Tailwind Classes

### Spacing
- `p-4` = padding 16px
- `px-4` = padding-x 16px
- `py-8` = padding-y 32px
- `mb-16` = margin-bottom 64px
- `gap-6` = gap 24px

### Typography
- `text-3xl` = 30px
- `font-bold` = 700 weight
- `text-gray-900` = dark text
- `text-center` = center align

### Responsive
- `md:` = 768px+
- `lg:` = 1024px+
- `xl:` = 1280px+

### Colors
- `bg-gradient-to-br` = gradient bottom-right
- `from-blue-50` = gradient start
- `to-blue-200` = gradient end
- `border-blue-100` = border color

## 📱 Breakpoints

- Mobile: ≤ 640px
- Tablet: 641–1024px
- Desktop: > 1024px

## ✨ Tips & Tricks

1. **Always use theme colors** for consistency
2. **Use motion.section** for viewport animations
3. **Add badges** to popular services
4. **Test on mobile** before deploying
5. **Check accessibility** with keyboard nav
6. **Verify color contrast** ratios
7. **Optimize images** for performance
8. **Use Lucide icons** for consistency

## 🐛 Troubleshooting

### Components not showing?
- Check imports: `import { Component } from "@/components/hub"`
- Verify theme: `const theme = HUB_THEMES.dairy`

### Styling not working?
- Check Tailwind classes
- Verify color hex values
- Check responsive breakpoints

### Animations not smooth?
- Check Framer Motion syntax
- Verify viewport settings
- Test on different devices

### Navigation not working?
- Check route paths
- Verify useNavigate hook
- Check HubLayout navLinks

---

**Last Updated**: 2025-10-18
**Version**: 1.0

