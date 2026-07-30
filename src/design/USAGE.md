# Feldrix Design System — Usage Guide

## Import

```jsx
import {
  // Components
  PremiumCard,
  PremiumStatCard,
  PremiumSectionHeader,
  PremiumActionButton,
  PremiumStatusChip,
  PremiumEmptyState,
  PremiumInfoRow,
  PremiumMetric,
  PremiumLoadingState,

  // Layouts
  PremiumPageLayout,
  PremiumKPIGrid,
  PremiumContentSection,
  PremiumTimeline,
  PremiumTimelineRow,
  PremiumTimelineGroup,
  PremiumWorkspace,
  PremiumDashboardSection,

  // Tokens
  tokens,
  spacing,
  radius,
  elevation,
  transitions,
  typography,
  iconSize,
  componentSize,
} from "../../design";
```

## Standard Page Structure

Every Feldrix page should follow this order:

```
1. Page Header (title, subtitle, actions)
2. KPI Grid (stat cards)
3. Intelligence Section (score + insights)
4. Timeline (upcoming events)
5. Workspace (forms, tables, content)
6. History (records table)
```

## Example Page

```jsx
export default function ModulePage() {
  return (
    <PremiumPageLayout
      title="Module Name"
      subtitle="Module description."
      icon={<ModuleIcon />}
      actions={<PremiumActionButton label="Add Record" />}
    >
      <PremiumKPIGrid>
        <PremiumStatCard label="Total" value={42} icon={<Icon />} iconBg="..." iconColor="..." />
        <PremiumStatCard label="Active" value={12} icon={<Icon />} iconBg="..." iconColor="..." />
      </PremiumKPIGrid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <PremiumContentSection title="Score">
            <PremiumMetric score={85} status="Excellent" color={palette.success.main} />
          </PremiumContentSection>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <PremiumContentSection title="AI Insights">
            <PremiumEmptyState message="All clear." />
          </PremiumContentSection>
        </Grid>
      </Grid>

      <PremiumContentSection title="Timeline">
        <PremiumTimeline>
          <PremiumTimelineGroup label="TODAY" color={palette.warning.main} />
          <PremiumTimelineRow
            icon={<EventIcon />}
            iconColor={palette.info.main}
            title="Animal 456"
            subtitle="Vaccination"
            chipLabel="Today"
            chipColor="info"
            onClick={() => navigate('/animals/456')}
          />
        </PremiumTimeline>
      </PremiumContentSection>
    </PremiumPageLayout>
  );
}
```

## Design Tokens

Use tokens instead of hard-coded values:

```jsx
// Instead of:
sx={{ borderRadius: 3, p: 3, transition: "all 0.2s ease" }}

// Use:
import { radius, spacing, transitions } from "../../design";
sx={{ borderRadius: radius.card, p: spacing.cardPadding, transition: transitions.hover }}
```

## Component Hierarchy

```
PremiumPageLayout
  └── PremiumKPIGrid
       └── PremiumStatCard (x N)
  └── PremiumContentSection
       └── PremiumSectionHeader
       └── PremiumMetric / PremiumEmptyState / PremiumInfoRow
  └── PremiumTimeline
       └── PremiumTimelineGroup
       └── PremiumTimelineRow (x N)
  └── PremiumWorkspace
       └── (forms, tables)
  └── PremiumDashboardSection
       └── (dashboard widgets)
```

## Spacing Rules

| Context | Token |
|---------|-------|
| Between page sections | `spacing.sectionGap` (3) |
| Inside cards | `spacing.cardPadding` ({xs: 2.5, md: 3}) |
| Between cards in grid | `spacing.cardGap` (3) |
| Divider vertical margin | `spacing.dividerMargin` (2.5) |
| Icon to text | `spacing.iconGap` (1) |
| Between buttons | `spacing.buttonGap` (1.5) |

## Icon Sizes

| Context | Size |
|---------|------|
| Navigation | 20px |
| Page headers | 24px |
| Card headers | 22px |
| KPI / score | 28px |
| Timeline | 22px |
| Buttons | 18px |
| Chips | 16px |
