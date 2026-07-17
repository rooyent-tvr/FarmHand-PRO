/**
 * AI Insights Engine
 *
 * Generates smart recommendations from live farm data.
 * This is a rules-based engine that can later be enhanced
 * with AI without changing the Dashboard.
 */

export function generateAIInsights({
  planner = {},
  health = {},
  machinery = {},
  crops = {},
  finance = {},
} = {}) {
  const insights = [];

  // -------------------------------
  // Planner
  // -------------------------------

  if ((planner.overdue || 0) > 0) {
    insights.push({
      priority: "high",
      icon: "📋",
      title: "Outstanding Tasks",
      message: `${planner.overdue} planner task${
        planner.overdue === 1 ? "" : "s"
      } require attention.`,
    });
  }

  // -------------------------------
  // Animal Health
  // -------------------------------

  if ((health.attention || 0) > 0) {
    insights.push({
      priority: "high",
      icon: "💉",
      title: "Health Treatments Due",
      message: `${health.attention} treatment${
        health.attention === 1 ? "" : "s"
      } should be completed today.`,
    });
  }

  // -------------------------------
  // Machinery
  // -------------------------------

  if ((machinery.overdue || 0) > 0) {
    insights.push({
      priority: "medium",
      icon: "🚜",
      title: "Machinery Service",
      message: `${machinery.overdue} machine${
        machinery.overdue === 1 ? "" : "s"
      } are approaching a service interval.`,
    });
  }

  // -------------------------------
  // Crops
  // -------------------------------

  if ((crops.harvestSoon || 0) > 0) {
    insights.push({
      priority: "medium",
      icon: "🌾",
      title: "Harvest Planning",
      message: `${crops.harvestSoon} crop${
        crops.harvestSoon === 1 ? "" : "s"
      } should be harvested soon.`,
    });
  }

  // -------------------------------
  // Finance
  // -------------------------------

  if ((finance.profit || 0) < 0) {
    insights.push({
      priority: "high",
      icon: "💰",
      title: "Profit Alert",
      message:
        "Farm expenses currently exceed income.",
    });
  }

  // -------------------------------
  // Positive insight
  // -------------------------------

  if (insights.length === 0) {
    insights.push({
      priority: "success",
      icon: "✅",
      title: "Everything Looks Good",
      message:
        "No urgent issues were detected today. Keep up the excellent work!",
    });
  }

  return insights;
}