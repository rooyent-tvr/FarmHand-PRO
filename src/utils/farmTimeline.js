/**
 * FarmHand PRO — Farm Timeline Engine
 *
 * Generates historical farm events from live data.
 * Structured as independent providers that can be extended.
 *
 * Each provider returns an array of timeline events:
 * { time, category, title, description, icon, colour }
 *
 * The engine merges all events, sorts newest first,
 * and returns a maximum of 8 events.
 */

const MAX_EVENTS = 8;

// =====================================================
// Category Colours
// =====================================================

const COLOURS = {
  planner: "#ed6c02",
  health: "#d32f2f",
  machinery: "#1976d2",
  crops: "#2e7d32",
  finance: "#7b1fa2",
};

// =====================================================
// Providers
// =====================================================

function generatePlannerEvents(planner) {
  const events = [];
  const overdue = planner.overdue || 0;

  if (overdue > 0) {
    events.push({
      time: new Date().toISOString(),
      category: "planner",
      title: "Overdue Tasks Detected",
      description: `${overdue} planner task${overdue === 1 ? "" : "s"} require attention.`,
      icon: "📋",
      colour: COLOURS.planner,
    });
  } else {
    events.push({
      time: new Date().toISOString(),
      category: "planner",
      title: "Planner Reviewed",
      description: "All planner tasks are up to date.",
      icon: "📋",
      colour: COLOURS.planner,
    });
  }

  return events;
}

function generateHealthEvents(health) {
  const events = [];
  const attention = health.attention || 0;

  if (attention > 0) {
    events.push({
      time: new Date().toISOString(),
      category: "health",
      title: "Treatments Scheduled",
      description: `${attention} animal treatment${attention === 1 ? "" : "s"} due today.`,
      icon: "💉",
      colour: COLOURS.health,
    });
  } else {
    events.push({
      time: new Date().toISOString(),
      category: "health",
      title: "Herd Health Clear",
      description: "No treatments due today.",
      icon: "💉",
      colour: COLOURS.health,
    });
  }

  return events;
}

function generateMachineryEvents(machinery) {
  const events = [];
  const overdue = machinery.overdue || 0;

  if (overdue > 0) {
    events.push({
      time: new Date().toISOString(),
      category: "machinery",
      title: "Service Approaching",
      description: `${overdue} machine${overdue === 1 ? "" : "s"} approaching service interval.`,
      icon: "🚜",
      colour: COLOURS.machinery,
    });
  } else {
    events.push({
      time: new Date().toISOString(),
      category: "machinery",
      title: "Fleet Operational",
      description: "All machinery within service schedule.",
      icon: "🚜",
      colour: COLOURS.machinery,
    });
  }

  return events;
}

function generateCropEvents(crops) {
  const events = [];
  const harvestSoon = crops.harvestSoon || 0;

  if (harvestSoon > 0) {
    events.push({
      time: new Date().toISOString(),
      category: "crops",
      title: "Harvest Window Open",
      description: `${harvestSoon} crop${harvestSoon === 1 ? "" : "s"} entering harvest window.`,
      icon: "🌾",
      colour: COLOURS.crops,
    });
  } else {
    events.push({
      time: new Date().toISOString(),
      category: "crops",
      title: "Crops On Track",
      description: "No crops require harvesting today.",
      icon: "🌾",
      colour: COLOURS.crops,
    });
  }

  return events;
}

function generateFinanceEvents(finance) {
  const events = [];
  const profit = finance.profit || 0;

  if (profit < 0) {
    events.push({
      time: new Date().toISOString(),
      category: "finance",
      title: "Expense Alert",
      description: "Farm expenses currently exceed income.",
      icon: "💰",
      colour: COLOURS.finance,
    });
  } else {
    events.push({
      time: new Date().toISOString(),
      category: "finance",
      title: "Finance Healthy",
      description: "Current profitability is on track.",
      icon: "💰",
      colour: COLOURS.finance,
    });
  }

  return events;
}

// =====================================================
// Public API
// =====================================================

export function generateFarmTimeline({
  planner = {},
  health = {},
  machinery = {},
  crops = {},
  finance = {},
} = {}) {
  // Collect from all providers
  const all = [
    ...generatePlannerEvents(planner),
    ...generateHealthEvents(health),
    ...generateMachineryEvents(machinery),
    ...generateCropEvents(crops),
    ...generateFinanceEvents(finance),
  ];

  // Sort newest first
  all.sort((a, b) => new Date(b.time) - new Date(a.time));

  // Limit to max events
  return all.slice(0, MAX_EVENTS);
}
