/**
 * FarmHand PRO — Cross-Module Intelligence
 * Planner + Weather Provider
 *
 * Combines planner task schedules with weather forecasts to recommend
 * rescheduling weather-sensitive outdoor tasks.
 *
 * Expected data shape:
 * {
 *   planner: {
 *     today: [],     // Tasks due today
 *     upcoming: []   // Upcoming tasks
 *   },
 *   weather: {
 *     available: true,
 *     current: { temperature, windSpeed, rainfall, condition },
 *     forecast: [{ temperature, temperatureMin, temperatureMax, windSpeed, rainfall, condition }]
 *   }
 * }
 *
 * @param {object} data - Farm data context
 * @returns {Array} Array of insight objects
 */
export function generatePlannerWeatherInsights(data = {}) {
  try {
    const planner = data.planner || {};
    const weather = data.weather || null;

    if (!weather || !weather.available) return [];

    const today = Array.isArray(planner.today) ? planner.today : [];
    const upcoming = Array.isArray(planner.upcoming) ? planner.upcoming : [];
    const allTasks = [...today, ...upcoming];

    if (allTasks.length === 0) return [];

    const current = weather.current || {};
    const forecast = Array.isArray(weather.forecast) ? weather.forecast : [];

    const insights = [];

    // High wind + spray/wind-sensitive tasks — High
    if (isHighWindExpected(current, forecast)) {
      const affected = filterByKeywords(allTasks, WIND_SENSITIVE_KEYWORDS);
      if (affected.length > 0) {
        insights.push(buildWindTaskInsight(affected));
      }
    }

    // Heavy rain + weather-sensitive field tasks — High
    if (isHeavyRainExpected(current, forecast)) {
      const affected = filterByKeywords(allTasks, RAIN_SENSITIVE_KEYWORDS);
      if (affected.length > 0) {
        insights.push(buildRainTaskInsight(affected));
      }
    }

    // Extreme heat + strenuous outdoor tasks — Medium
    if (isExtremeHeatExpected(current, forecast)) {
      const affected = filterByKeywords(allTasks, HEAT_SENSITIVE_KEYWORDS);
      if (affected.length > 0) {
        insights.push(buildHeatTaskInsight(affected));
      }
    }

    // Frost + early morning crop tasks — Medium
    if (isFrostExpected(current, forecast)) {
      const affected = filterByKeywords(allTasks, FROST_SENSITIVE_KEYWORDS);
      if (affected.length > 0) {
        insights.push(buildFrostTaskInsight(affected));
      }
    }

    return insights;
  } catch {
    return [];
  }
}

// =====================================================
// Keyword Definitions
// =====================================================

const WIND_SENSITIVE_KEYWORDS = [
  "spray", "spraying", "chemical", "herbicide", "pesticide",
  "fungicide", "aerial", "application",
];

const RAIN_SENSITIVE_KEYWORDS = [
  "fertilize", "fertilizer", "fertilising", "irrigation", "irrigate",
  "harvest", "harvesting", "planting", "plant", "seeding",
  "sowing", "baling", "hay",
];

const HEAT_SENSITIVE_KEYWORDS = [
  "fencing", "fence", "digging", "earthworks", "construction",
  "welding", "clearing", "manual", "labour", "building",
  "planting", "plant", "harvest", "harvesting",
];

const FROST_SENSITIVE_KEYWORDS = [
  "planting", "plant", "seedling", "transplant", "irrigation",
  "irrigate", "crop", "spray", "spraying",
];

// =====================================================
// Task Filtering
// =====================================================

/**
 * Filters tasks whose title matches any of the given keywords (case-insensitive).
 */
function filterByKeywords(tasks, keywords) {
  return tasks.filter((task) => {
    const title = (task.title || "").toLowerCase();
    return keywords.some((keyword) => title.includes(keyword));
  });
}

/**
 * Formats up to 3 task titles for display.
 */
function formatTaskNames(tasks, max = 3) {
  const names = tasks.slice(0, max).map((t) => t.title || "Unnamed");
  const suffix = tasks.length > max ? ` and ${tasks.length - max} more` : "";
  return names.join(", ") + suffix;
}

// =====================================================
// Weather Detection
// =====================================================

function isHighWindExpected(current, forecast) {
  if (current.windSpeed && current.windSpeed > 40) return true;
  return forecast.some((day) => day.windSpeed && day.windSpeed > 40);
}

function isHeavyRainExpected(current, forecast) {
  if (current.rainfall && current.rainfall > 20) return true;
  return forecast.some((day) => day.rainfall && day.rainfall > 20);
}

function isExtremeHeatExpected(current, forecast) {
  if (current.temperature !== null && current.temperature !== undefined && current.temperature > 35) {
    return true;
  }
  return forecast.some((day) => {
    const maxTemp = day.temperatureMax ?? day.temperature ?? null;
    return maxTemp !== null && maxTemp > 35;
  });
}

function isFrostExpected(current, forecast) {
  if (current.temperature !== null && current.temperature !== undefined && current.temperature <= 2) {
    return true;
  }
  const next48h = forecast.slice(0, 2);
  return next48h.some((day) => {
    const minTemp = day.temperatureMin ?? day.temperature ?? null;
    return minTemp !== null && minTemp <= 2;
  });
}

// =====================================================
// Insight Builders
// =====================================================

function buildWindTaskInsight(affected) {
  return {
    id: "cross-planner-wind",
    priority: "High",
    category: "Planner",
    title: "Reschedule Spraying — High Winds",
    description: `Strong winds (>40 km/h) are forecast while "${formatTaskNames(affected)}" ${affected.length === 1 ? "is" : "are"} scheduled. Postpone to avoid chemical drift and waste.`,
    action: "Open planner",
    route: "/planner",
    source: "Planner + Weather",
  };
}

function buildRainTaskInsight(affected) {
  return {
    id: "cross-planner-rain",
    priority: "High",
    category: "Planner",
    title: "Reschedule Field Work — Heavy Rain",
    description: `Heavy rainfall (>20 mm) is forecast while "${formatTaskNames(affected)}" ${affected.length === 1 ? "is" : "are"} planned. Delay field activities to prevent soil damage and ensure effectiveness.`,
    action: "Open planner",
    route: "/planner",
    source: "Planner + Weather",
  };
}

function buildHeatTaskInsight(affected) {
  return {
    id: "cross-planner-heat",
    priority: "Medium",
    category: "Planner",
    title: "Move Tasks to Cooler Hours",
    description: `Extreme heat (>35°C) is forecast while "${formatTaskNames(affected)}" ${affected.length === 1 ? "is" : "are"} scheduled. Move strenuous work to early morning or late afternoon.`,
    action: "Open planner",
    route: "/planner",
    source: "Planner + Weather",
  };
}

function buildFrostTaskInsight(affected) {
  return {
    id: "cross-planner-frost",
    priority: "Medium",
    category: "Planner",
    title: "Frost Risk for Scheduled Tasks",
    description: `Frost is forecast within 48 hours while "${formatTaskNames(affected)}" ${affected.length === 1 ? "is" : "are"} planned. Delay early-morning crop work until temperatures rise.`,
    action: "Open planner",
    route: "/planner",
    source: "Planner + Weather",
  };
}
