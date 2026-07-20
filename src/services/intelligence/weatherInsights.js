/**
 * FarmHand PRO — Intelligence Engine
 * Weather Insights Provider
 *
 * Generates actionable insights from weather data.
 * Covers frost warnings, heavy rain, high winds, extreme heat,
 * and weather data availability.
 *
 * Expected data shape:
 * {
 *   weather: {
 *     available: true,
 *     current: {
 *       temperature,
 *       condition,
 *       windSpeed,
 *       humidity,
 *       rainfall
 *     },
 *     forecast: [
 *       { temperature, temperatureMin, condition, windSpeed, rainfall }
 *     ]
 *   }
 * }
 *
 * @param {object} data - Farm data context
 * @returns {Array} Array of insight objects
 */
export function generateWeatherInsights(data = {}) {
  try {
    const weather = data.weather || null;

    if (!weather || !weather.available) {
      return [buildUnavailableInsight()];
    }

    const insights = [];
    const current = weather.current || {};
    const forecast = Array.isArray(weather.forecast) ? weather.forecast : [];

    // Frost — Critical
    if (isFrostExpected(current, forecast)) {
      insights.push(buildFrostInsight());
    }

    // Heavy rainfall — High
    if (isHeavyRainExpected(current, forecast)) {
      insights.push(buildHeavyRainInsight());
    }

    // High winds — Medium
    if (isHighWindExpected(current, forecast)) {
      insights.push(buildHighWindInsight());
    }

    // Extreme heat — Medium
    if (isExtremeHeatExpected(current, forecast)) {
      insights.push(buildExtremeHeatInsight());
    }

    return insights;
  } catch {
    return [];
  }
}

// =====================================================
// Detection Helpers
// =====================================================

/**
 * Checks if frost is expected (temperature <= 2°C) in current or next 48h forecast.
 */
function isFrostExpected(current, forecast) {
  if (current.temperature !== null && current.temperature !== undefined && current.temperature <= 2) {
    return true;
  }

  // Check first 2 forecast entries (roughly 48 hours if daily forecasts)
  const next48h = forecast.slice(0, 2);
  return next48h.some((day) => {
    const minTemp = day.temperatureMin ?? day.temperature ?? null;
    return minTemp !== null && minTemp <= 2;
  });
}

/**
 * Checks if heavy rainfall (>20mm) is expected.
 */
function isHeavyRainExpected(current, forecast) {
  if (current.rainfall && current.rainfall > 20) {
    return true;
  }

  return forecast.some((day) => day.rainfall && day.rainfall > 20);
}

/**
 * Checks if high winds (>40 km/h) are expected.
 */
function isHighWindExpected(current, forecast) {
  if (current.windSpeed && current.windSpeed > 40) {
    return true;
  }

  return forecast.some((day) => day.windSpeed && day.windSpeed > 40);
}

/**
 * Checks if extreme heat (>35°C) is expected.
 */
function isExtremeHeatExpected(current, forecast) {
  if (current.temperature !== null && current.temperature !== undefined && current.temperature > 35) {
    return true;
  }

  return forecast.some((day) => {
    const maxTemp = day.temperatureMax ?? day.temperature ?? null;
    return maxTemp !== null && maxTemp > 35;
  });
}

// =====================================================
// Insight Builders
// =====================================================

function buildFrostInsight() {
  return {
    id: "weather-frost",
    priority: "Critical",
    category: "Weather",
    title: "Frost Warning",
    description: "Frost is forecast within the next 48 hours. Protect sensitive crops, check water troughs, and shelter vulnerable livestock.",
    action: "View crops",
    route: "/crops",
    source: "Weather",
  };
}

function buildHeavyRainInsight() {
  return {
    id: "weather-heavy-rain",
    priority: "High",
    category: "Weather",
    title: "Heavy Rainfall Expected",
    description: "More than 20 mm of rain is forecast. Delay spraying, secure loose equipment, and check drainage on crop fields.",
    action: "View planner",
    route: "/planner",
    source: "Weather",
  };
}

function buildHighWindInsight() {
  return {
    id: "weather-high-wind",
    priority: "Medium",
    category: "Weather",
    title: "High Wind Advisory",
    description: "Winds exceeding 40 km/h are expected. Avoid aerial or ground spraying and secure lightweight structures.",
    action: "View planner",
    route: "/planner",
    source: "Weather",
  };
}

function buildExtremeHeatInsight() {
  return {
    id: "weather-extreme-heat",
    priority: "Medium",
    category: "Weather",
    title: "Extreme Heat Warning",
    description: "Temperatures above 35°C are forecast. Ensure livestock have adequate shade and water. Avoid heavy fieldwork during peak hours.",
    action: "View livestock",
    route: "/livestock",
    source: "Weather",
  };
}

function buildUnavailableInsight() {
  return {
    id: "weather-unavailable",
    priority: "Low",
    category: "Weather",
    title: "Weather Data Unavailable",
    description: "Live weather data is not available. Configure an API key to enable weather-based farm intelligence.",
    action: "Open settings",
    route: "/account",
    source: "Weather",
  };
}
