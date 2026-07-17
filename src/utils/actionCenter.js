/**
 * FarmHand PRO — Smart Action Centre Engine
 * Sprint 28
 *
 * Generates prioritised farm actions from all available data sources.
 * Returns up to 5 actions sorted by priority.
 *
 * Each action:
 * { priority, icon, title, description, source, daysRemaining, id }
 */

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2, info: 3 };
const MAX_ACTIONS = 5;

export function generateActionCenter({
  planner = {},
  health = {},
  machinery = {},
  breeding = {},
  crops = {},
  finance = {},
  weather = null,
  predictions = [],
  aiInsights = [],
} = {}) {
  const actions = [];

  // =====================================================
  // Planner
  // =====================================================

  const overdueCount = Number(planner.overdue || 0);
  const todayCount = Number(planner.today || 0);

  if (overdueCount > 0) {
    actions.push({
      id: "planner-overdue",
      priority: "high",
      icon: "📋",
      title: "Complete Overdue Tasks",
      description: `${overdueCount} planner task${overdueCount === 1 ? "" : "s"} are overdue.`,
      source: "Planner",
      daysRemaining: 0,
    });
  }

  if (todayCount > 0) {
    actions.push({
      id: "planner-today",
      priority: "medium",
      icon: "📋",
      title: "Today's Tasks",
      description: `${todayCount} task${todayCount === 1 ? "" : "s"} scheduled for today.`,
      source: "Planner",
      daysRemaining: 0,
    });
  }

  // =====================================================
  // Animal Health
  // =====================================================

  const healthDue = Number(health.attention || 0);

  if (healthDue > 0) {
    actions.push({
      id: "health-due",
      priority: "high",
      icon: "💉",
      title: "Animal Treatments Due",
      description: `${healthDue} treatment${healthDue === 1 ? "" : "s"} scheduled today.`,
      source: "Health",
      daysRemaining: 0,
    });
  }

  // =====================================================
  // Machinery
  // =====================================================

  const machineryOverdue = Number(machinery.overdue || 0);

  if (machineryOverdue > 0) {
    actions.push({
      id: "machinery-service",
      priority: "medium",
      icon: "🚜",
      title: "Machinery Service Due",
      description: `${machineryOverdue} machine${machineryOverdue === 1 ? "" : "s"} approaching service interval.`,
      source: "Machinery",
    });
  }

  // =====================================================
  // Breeding
  // =====================================================

  const birthsDue = Number(breeding.birthsDue || 0);

  if (birthsDue > 0) {
    actions.push({
      id: "breeding-births",
      priority: "medium",
      icon: "🍼",
      title: "Births Expected",
      description: `${birthsDue} expected birth${birthsDue === 1 ? "" : "s"} this week.`,
      source: "Breeding",
      daysRemaining: 7,
    });
  }

  // =====================================================
  // Crops
  // =====================================================

  const harvestSoon = Number(crops.harvestSoon || 0);

  if (harvestSoon > 0) {
    actions.push({
      id: "crops-harvest",
      priority: "medium",
      icon: "🌾",
      title: "Harvest Window",
      description: `${harvestSoon} crop${harvestSoon === 1 ? "" : "s"} entering harvest window.`,
      source: "Crops",
    });
  }

  // =====================================================
  // Finance
  // =====================================================

  const profit = Number(finance.profit || 0);

  if (profit < 0) {
    actions.push({
      id: "finance-alert",
      priority: "high",
      icon: "💰",
      title: "Expense Alert",
      description: "Farm expenses currently exceed income.",
      source: "Finance",
    });
  }

  // =====================================================
  // Weather
  // =====================================================

  if (weather?.available && weather.current) {
    const { condition, temperature } = weather.current;

    if (condition === "Rain" || condition === "Thunderstorm") {
      actions.push({
        id: "weather-rain",
        priority: "medium",
        icon: "🌧️",
        title: "Rain Expected",
        description: "Delay outdoor spraying or fertilizer application.",
        source: "Weather",
        daysRemaining: 0,
      });
    }

    if (temperature !== null && temperature >= 35) {
      actions.push({
        id: "weather-heat",
        priority: "medium",
        icon: "🔥",
        title: "Heat Warning",
        description: "Ensure livestock have sufficient water today.",
        source: "Weather",
        daysRemaining: 0,
      });
    }
  }

  // =====================================================
  // Sort by priority and return top 5
  // =====================================================

  actions.sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3)
  );

  return actions.slice(0, MAX_ACTIONS);
}
