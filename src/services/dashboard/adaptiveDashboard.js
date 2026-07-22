/**
 * FarmHand PRO — Adaptive Dashboard Engine
 * Sprint 37
 *
 * Determines which dashboard sections should receive visual emphasis
 * based on current farm conditions. Enables the UI layer to dynamically
 * highlight, expand, or compact sections without hardcoded logic.
 *
 * @module adaptiveDashboard
 */

/**
 * Generates an adaptive layout configuration based on farm state.
 *
 * @param {object} data - Farm data context
 * @param {Array} data.notifications - Notification array from engine
 * @param {object} data.intelligence - Intelligence data with insights array
 * @param {object} data.planner - Planner data with overdue, today, upcoming
 * @param {object} data.weather - Weather data with current, forecast, available
 * @param {object} data.finance - Finance data with records
 * @param {object} data.machinery - Machinery data with machines, maintenancePlans
 * @param {object} data.livestock - Livestock data with animals, healthRecords
 * @param {object} data.crops - Crops data with crops array
 * @returns {object} Adaptive layout configuration
 */
export function getDashboardLayout(data = {}) {
  try {
    const notifications = Array.isArray(data.notifications) ? data.notifications : [];
    const insights = data.intelligence?.insights || [];

    const heroPriority = determineHeroPriority(notifications, insights, data);
    const highlightedSection = determineHighlightedSection(notifications, insights, data);
    const expandedSection = determineExpandedSection(notifications, data);
    const compactSections = determineCompactSections(highlightedSection, expandedSection);
    const themeAccent = determineThemeAccent(heroPriority, highlightedSection, data);

    return {
      heroPriority,
      highlightedSection,
      expandedSection,
      compactSections,
      themeAccent,
    };
  } catch {
    return {
      heroPriority: "good",
      highlightedSection: null,
      expandedSection: null,
      compactSections: [],
      themeAccent: "success",
    };
  }
}

// =====================================================
// Hero Priority
// =====================================================

/**
 * Determines the overall hero banner priority level.
 */
function determineHeroPriority(notifications, insights, data) {
  const hasCriticalNotification = notifications.some((n) => n.priority === "Critical");
  const hasCriticalInsight = insights.some((i) => i.priority === "Critical");
  const overdueCount = data.planner?.overdue?.length || 0;

  if (hasCriticalNotification || hasCriticalInsight || overdueCount >= 5) {
    return "critical";
  }

  const hasHighNotification = notifications.some((n) => n.priority === "High");
  const hasHighInsight = insights.some((i) => i.priority === "High");

  if (hasHighNotification || hasHighInsight || overdueCount >= 2) {
    return "warning";
  }

  return "good";
}

// =====================================================
// Highlighted Section
// =====================================================

/**
 * Determines which single section should be visually highlighted.
 * Returns the module name or null if everything is balanced.
 */
function determineHighlightedSection(notifications, insights, data) {
  // Critical weather takes highest visual priority
  if (hasWeatherEmergency(data.weather, notifications)) {
    return "Weather";
  }

  // Critical livestock health
  const healthCritical = notifications.filter(
    (n) => n.module === "Livestock" && n.priority === "Critical"
  ).length;
  if (healthCritical >= 2) {
    return "Livestock";
  }

  // Heavy planner overload
  const overdueCount = data.planner?.overdue?.length || 0;
  if (overdueCount >= 5) {
    return "Planner";
  }

  // Machinery critical
  const machineryCritical = notifications.filter(
    (n) => n.module === "Machinery" && n.priority === "Critical"
  ).length;
  if (machineryCritical > 0) {
    return "Machinery";
  }

  // Finance critical
  const financeCritical = notifications.filter(
    (n) => n.module === "Finance" && n.priority === "Critical"
  ).length;
  if (financeCritical > 0) {
    return "Finance";
  }

  // Crops critical
  const cropsCritical = notifications.filter(
    (n) => n.module === "Crops" && n.priority === "Critical"
  ).length;
  if (cropsCritical > 0) {
    return "Crops";
  }

  return null;
}

// =====================================================
// Expanded Section
// =====================================================

/**
 * Determines which section should be expanded (showing more detail).
 * Typically triggered by high notification volume in a category.
 */
function determineExpandedSection(notifications, data) {
  const totalNotifications = notifications.length;
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Many unread notifications → expand notification center
  if (unreadCount >= 5) {
    return "NotificationCenter";
  }

  // Heavy planner load → expand planner section
  const overdueCount = data.planner?.overdue?.length || 0;
  const todayCount = data.planner?.today?.length || 0;
  if (overdueCount + todayCount >= 8) {
    return "Planner";
  }

  // Many total notifications → expand notification center
  if (totalNotifications >= 10) {
    return "NotificationCenter";
  }

  return null;
}

// =====================================================
// Compact Sections
// =====================================================

/**
 * Determines which sections can be compacted to save space.
 * Sections not highlighted or expanded can be reduced.
 */
function determineCompactSections(highlightedSection, expandedSection) {
  const allSections = ["Weather", "Planner", "Livestock", "Crops", "Machinery", "Finance"];
  const active = [highlightedSection, expandedSection].filter(Boolean);

  // If nothing is highlighted, nothing needs compacting
  if (active.length === 0) return [];

  // Compact sections that are not currently important
  return allSections.filter((section) => !active.includes(section));
}

// =====================================================
// Theme Accent
// =====================================================

/**
 * Determines the UI theme accent color for the current session.
 */
function determineThemeAccent(heroPriority, highlightedSection, data) {
  if (heroPriority === "critical") return "error";
  if (heroPriority === "warning") return "warning";

  // Module-specific accents when highlighted
  if (highlightedSection === "Weather") return "warning";
  if (highlightedSection === "Livestock") return "error";
  if (highlightedSection === "Finance") return "secondary";

  return "success";
}

// =====================================================
// Helpers
// =====================================================

/**
 * Checks if there is a weather emergency that should dominate the dashboard.
 */
function hasWeatherEmergency(weather, notifications) {
  if (!weather || !weather.available) return false;

  // Frost or severe conditions
  const temp = weather.current?.temperature;
  if (temp !== null && temp !== undefined && temp <= 0) return true;

  // Critical weather notifications
  const weatherCritical = notifications.filter(
    (n) => n.module === "Weather" && n.priority === "Critical"
  ).length;

  return weatherCritical > 0;
}
