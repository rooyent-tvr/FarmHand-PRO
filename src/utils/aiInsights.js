/**
 * FarmHand PRO — AI Insights Engine
 *
 * Generates a smart daily briefing from live farm data.
 * Structured as independent providers that can be extended.
 *
 * Each provider returns an array of recommendations:
 * { priority, icon, title, message }
 *
 * The engine merges, deduplicates, sorts by priority,
 * and returns a maximum of 4 recommendations.
 */

const PRIORITY_ORDER = { high: 0, medium: 1, info: 2 };
const MAX_RECOMMENDATIONS = 4;

// =====================================================
// Providers
// =====================================================

function generatePlannerInsights(planner) {
  const overdue = planner.overdue || 0;

  if (overdue > 0) {
    return [{
      priority: "high",
      icon: "📋",
      title: "Complete Overdue Tasks",
      message: "Complete your overdue planner tasks first. This will immediately improve your Farm Health Score.",
    }];
  }

  return [{
    priority: "info",
    icon: "📋",
    title: "Planner Up To Date",
    message: "Great work! No planner tasks are overdue today.",
  }];
}

function generateHealthInsights(health) {
  const attention = health.attention || 0;

  if (attention > 0) {
    return [{
      priority: "high",
      icon: "💉",
      title: "Health Treatments Due",
      message: "Animal treatments are scheduled today. Keeping treatments on schedule improves herd health.",
    }];
  }

  return [{
    priority: "info",
    icon: "💉",
    title: "Livestock Health Clear",
    message: "No livestock treatments are due today.",
  }];
}

function generateMachineryInsights(machinery) {
  const overdue = machinery.overdue || 0;

  if (overdue > 0) {
    return [{
      priority: "medium",
      icon: "🚜",
      title: "Machinery Service",
      message: "A machine is approaching its service interval. Preventive maintenance reduces unexpected downtime.",
    }];
  }

  return [{
    priority: "info",
    icon: "🚜",
    title: "Machinery On Schedule",
    message: "All machinery is operating within its service schedule.",
  }];
}

function generateCropInsights(crops) {
  const harvestSoon = crops.harvestSoon || 0;

  if (harvestSoon > 0) {
    return [{
      priority: "medium",
      icon: "🌾",
      title: "Harvest Planning",
      message: "One or more crops are entering the harvest window. Planning harvest early improves yield quality.",
    }];
  }

  return [{
    priority: "info",
    icon: "🌾",
    title: "Crops On Track",
    message: "No crops require harvesting today.",
  }];
}

function generateFinanceInsights(finance) {
  const profit = finance.profit || 0;

  if (profit < 0) {
    return [{
      priority: "high",
      icon: "💰",
      title: "Profit Alert",
      message: "Expenses currently exceed income. Review spending before additional purchases.",
    }];
  }

  return [{
    priority: "info",
    icon: "💰",
    title: "Finance Healthy",
    message: "Current farm profitability is healthy.",
  }];
}

function generateWeatherInsights(weather) {
  // If weather data is unavailable, skip
  if (!weather || !weather.available) {
    return [];
  }

  const insights = [];
  const current = weather.current || {};
  const forecast = weather.forecast || [];

  const temperature = current.temperature;
  const windSpeed = current.windSpeed;
  const rainfall = current.rainfall;
  const condition = current.condition || "";

  // Check forecast for upcoming rain
  const rainForecast = forecast.some((day) => day.rainfall > 5 || day.condition === "Rain");

  // Heavy rain (current or forecast)
  if (rainfall > 10 || condition === "Rain" || condition === "Thunderstorm" || rainForecast) {
    insights.push({
      priority: "medium",
      icon: "🌧️",
      title: "Rain Expected",
      message: "Heavy rainfall is forecast. Consider delaying spraying or fertilizer application.",
    });
    return insights;
  }

  // Frost (temperature below 3°C)
  if (temperature !== null && temperature <= 3) {
    insights.push({
      priority: "medium",
      icon: "❄️",
      title: "Frost Warning",
      message: "Low temperatures expected. Protect sensitive crops from overnight frost.",
    });
    return insights;
  }

  // High temperatures (above 35°C)
  if (temperature !== null && temperature >= 35) {
    insights.push({
      priority: "medium",
      icon: "🔥",
      title: "Hot Weather",
      message: "High temperatures are expected. Ensure livestock have sufficient water.",
    });
    return insights;
  }

  // Strong wind (above 40 km/h)
  if (windSpeed !== null && windSpeed >= 40) {
    insights.push({
      priority: "medium",
      icon: "💨",
      title: "Wind Advisory",
      message: "Strong winds are forecast. Avoid spraying chemicals today.",
    });
    return insights;
  }

  // Good weather
  insights.push({
    priority: "info",
    icon: "☀️",
    title: "Ideal Conditions",
    message: "Weather conditions are favourable for normal farm operations.",
  });

  return insights;
}

// =====================================================
// Engine
// =====================================================

function sortByPriority(insights) {
  return insights.sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 2) - (PRIORITY_ORDER[b.priority] ?? 2)
  );
}

function deduplicate(insights) {
  const seen = new Set();
  return insights.filter((item) => {
    if (seen.has(item.title)) return false;
    seen.add(item.title);
    return true;
  });
}

// =====================================================
// Public API
// =====================================================

export function generateAIInsights({
  planner = {},
  health = {},
  machinery = {},
  crops = {},
  finance = {},
  weather = null,
} = {}) {
  // Collect from all providers
  const all = [
    ...generatePlannerInsights(planner),
    ...generateHealthInsights(health),
    ...generateMachineryInsights(machinery),
    ...generateCropInsights(crops),
    ...generateFinanceInsights(finance),
    ...generateWeatherInsights(weather),
  ];

  // Deduplicate, sort, trim
  const sorted = sortByPriority(deduplicate(all));

  // Check if there are any high-priority items
  const hasHigh = sorted.some((item) => item.priority === "high");

  // If no high-priority items, ensure a positive daily summary is included
  if (!hasHigh) {
    const hasPositive = sorted.some((item) => item.title === "Farm Running Smoothly");
    if (!hasPositive) {
      sorted.push({
        priority: "info",
        icon: "✅",
        title: "Farm Running Smoothly",
        message: "Farm operations are running smoothly today. Keep following your current schedule.",
      });
    }
  }

  // Return max 4 recommendations, highest priority first
  return sortByPriority(deduplicate(sorted)).slice(0, MAX_RECOMMENDATIONS);
}
