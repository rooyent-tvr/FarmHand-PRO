/**
 * ============================================================
 * Feldrix Design System — Public API
 * Sprint 44 Phase 1 + 1.5
 *
 * Import from '../../design' to access all shared components,
 * layouts, and tokens.
 *
 * Usage:
 *   import { PremiumCard, PremiumPageLayout, tokens } from "../../design";
 * ============================================================
 */

// Design Tokens
export * from "./tokens";
export { default as tokens } from "./tokens";

// Shared Components
export { default as PremiumCard } from "./components/PremiumCard";
export { default as PremiumStatCard } from "./components/PremiumStatCard";
export { default as PremiumSectionHeader } from "./components/PremiumSectionHeader";
export { default as PremiumActionButton } from "./components/PremiumActionButton";
export { default as PremiumStatusChip } from "./components/PremiumStatusChip";
export { default as PremiumEmptyState } from "./components/PremiumEmptyState";
export { default as PremiumInfoRow } from "./components/PremiumInfoRow";
export { default as PremiumMetric } from "./components/PremiumMetric";
export { default as PremiumLoadingState } from "./components/PremiumLoadingState";

// Layout System
export { default as PremiumPageLayout } from "./layouts/PremiumPageLayout";
export { default as PremiumKPIGrid } from "./layouts/PremiumKPIGrid";
export { default as PremiumContentSection } from "./layouts/PremiumContentSection";
export { default as PremiumTimeline, PremiumTimelineRow, PremiumTimelineGroup } from "./layouts/PremiumTimeline";
export { default as PremiumWorkspace } from "./layouts/PremiumWorkspace";
export { default as PremiumDashboardSection } from "./layouts/PremiumDashboardSection";
