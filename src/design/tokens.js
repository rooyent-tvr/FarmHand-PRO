/**
 * ============================================================
 * Feldrix Design System — Design Tokens
 * Sprint 44 Phase 1
 *
 * Centralised visual values for the entire application.
 * Import these tokens wherever styling decisions are needed.
 * ============================================================
 */

// ============================================================
// SPACING
// ============================================================

export const spacing = {
  /** Gap between page sections */
  sectionGap: 3,
  /** Internal card padding */
  cardPadding: { xs: 2.5, md: 3 },
  /** Space between cards in a grid */
  cardGap: 3,
  /** Divider vertical margin */
  dividerMargin: 2.5,
  /** Form field spacing */
  fieldGap: 2.5,
  /** Icon to text spacing */
  iconGap: 1,
  /** Button group spacing */
  buttonGap: 1.5,
};

// ============================================================
// BORDER RADIUS
// ============================================================

export const radius = {
  /** Standard card radius */
  card: 3,
  /** Large cards / dialogs */
  cardLarge: 4,
  /** Buttons */
  button: 2.5,
  /** Chips / badges */
  chip: 2,
  /** Circular elements */
  circle: "50%",
  /** Input fields */
  input: 2,
  /** Timeline icons */
  icon: "50%",
};

// ============================================================
// ELEVATION & SHADOWS
// ============================================================

export const elevation = {
  /** Default card elevation */
  card: 2,
  /** Hover state */
  cardHover: "0 8px 24px rgba(0,0,0,0.08)",
  /** Subtle hover */
  cardHoverSubtle: "0 4px 12px rgba(0,0,0,0.06)",
  /** Timeline row hover */
  rowHover: "0 2px 8px rgba(0,0,0,0.06)",
  /** No elevation (flat cards) */
  flat: 0,
};

// ============================================================
// TRANSITIONS
// ============================================================

export const transitions = {
  /** Standard hover transition */
  hover: "all 0.2s ease",
  /** Fast interactions */
  fast: "all 0.15s ease",
  /** Background color changes */
  background: "background-color 0.15s ease",
  /** Smooth entrance */
  entrance: "all 0.25s ease",
};

// ============================================================
// TYPOGRAPHY SIZES
// ============================================================

export const typography = {
  /** Page title */
  pageTitle: { variant: "h5", fontWeight: 700 },
  /** Section/card title */
  sectionTitle: { variant: "subtitle1", fontWeight: 700 },
  /** Metric large value */
  metricValue: { fontSize: "1.75rem", fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.3 },
  /** Metric label */
  metricLabel: { fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 },
  /** Metric subtitle */
  metricSubtitle: { fontSize: "0.78rem" },
  /** Summary row label */
  summaryLabel: { variant: "body2" },
  /** Summary row value */
  summaryValue: { variant: "body2", fontWeight: 700 },
  /** Section header caption */
  sectionCaption: { fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 },
  /** Score explanation */
  explanation: { variant: "caption", lineHeight: 1.5 },
};

// ============================================================
// ICON SIZES
// ============================================================

export const iconSize = {
  /** Navigation / sidebar */
  navigation: 20,
  /** Page headers */
  pageHeader: 24,
  /** Card headers */
  cardHeader: 22,
  /** KPI / score icons */
  kpi: 28,
  /** Timeline event icons */
  timeline: 22,
  /** Button icons */
  button: 18,
  /** Status chips */
  chip: 16,
  /** Info / helper */
  info: 14,
};

// ============================================================
// COMPONENT SIZES
// ============================================================

export const componentSize = {
  /** Score circle diameter */
  scoreCircle: 100,
  /** Score circle border width */
  scoreCircleBorder: 4,
  /** Timeline icon container */
  timelineIcon: 40,
  /** KPI icon container */
  kpiIcon: 52,
  /** Card minimum height (intelligence cards) */
  intelligenceCardMinHeight: 360,
  /** Progress bar height */
  progressBar: 8,
  /** Chip height */
  chipSmall: 22,
  /** Chip badge height */
  chipBadge: 24,
  /** Quick action button padding */
  quickButtonPx: 2,
  quickButtonPy: 0.75,
};

// ============================================================
// HOVER STATES
// ============================================================

export const hoverState = {
  /** Card lift on hover */
  cardLift: { transform: "translateY(-3px)" },
  /** Subtle row highlight */
  rowHighlight: { bgcolor: "action.hover" },
  /** Danger button fill */
  dangerFill: { bgcolor: "error.main", color: "#fff" },
};

// ============================================================
// COLOR HELPERS (for alpha-based backgrounds)
// ============================================================

export const alphaValues = {
  /** Icon background opacity */
  iconBg: 0.1,
  /** Severity card background */
  severityBg: 0.04,
  /** Severity card border */
  severityBorder: 0.12,
  /** Score circle fill */
  scoreFill: 0.09,
};

export default {
  spacing,
  radius,
  elevation,
  transitions,
  typography,
  iconSize,
  componentSize,
  hoverState,
  alphaValues,
};
