/**
 * FarmHand PRO — Crop Analytics Engine
 * Sprint 43.0
 *
 * Generates crop health score and analytics from crop data.
 */

/**
 * Calculates crop health score and analytics.
 *
 * @param {object} params
 * @param {Array} params.crops - Crop records from Supabase
 * @param {object} params.weather - Optional weather data
 * @returns {object} Analytics object
 */
export function generateCropAnalytics({ crops = [], weather = null } = {}) {
  if (crops.length === 0) {
    return {
      available: false,
      score: 0,
      status: "No Crops",
      activeCrops: 0,
      harvestReady: 0,
      needsIrrigation: 0,
      totalArea: 0,
      upcomingHarvests: 0,
      insights: [],
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const twoWeeksFromNow = new Date(today);
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

  // Basic counts
  const activeCrops = crops.filter(
    (c) => c.status === "Growing" || c.status === "Planted"
  );

  const harvestReady = activeCrops.filter((c) => {
    if (!c.harvest_date) return false;
    const hd = new Date(c.harvest_date);
    hd.setHours(0, 0, 0, 0);
    return hd <= weekFromNow;
  });

  const overdue = activeCrops.filter((c) => {
    if (!c.harvest_date) return false;
    const hd = new Date(c.harvest_date);
    hd.setHours(0, 0, 0, 0);
    return hd < today;
  });

  const upcomingHarvests = activeCrops.filter((c) => {
    if (!c.harvest_date) return false;
    const hd = new Date(c.harvest_date);
    hd.setHours(0, 0, 0, 0);
    return hd >= today && hd <= twoWeeksFromNow;
  });

  // Irrigation check — crops with irrigation_status or last_irrigated
  const needsIrrigation = activeCrops.filter((c) => {
    if (c.irrigation_status === "Overdue" || c.irrigation_status === "Needed") return true;
    if (c.last_irrigated) {
      const lastIrr = new Date(c.last_irrigated);
      const daysSince = Math.floor((today - lastIrr) / (1000 * 60 * 60 * 24));
      return daysSince > 7;
    }
    return false;
  });

  const totalArea = crops.reduce(
    (sum, c) => sum + Number(c.area || 0), 0
  );

  const harvested = crops.filter((c) => c.status === "Harvested");

  // Calculate health score
  const score = calculateCropHealthScore({
    total: crops.length,
    active: activeCrops.length,
    harvestReady: harvestReady.length,
    overdue: overdue.length,
    needsIrrigation: needsIrrigation.length,
    weather,
  });

  // Generate insights
  const insights = generateInsights({
    activeCrops,
    harvestReady,
    overdue,
    needsIrrigation,
    weather,
    upcomingHarvests,
  });

  return {
    available: true,
    score,
    status: getStatus(score),
    activeCrops: activeCrops.length,
    harvestReady: harvestReady.length,
    needsIrrigation: needsIrrigation.length,
    totalArea,
    upcomingHarvests: upcomingHarvests.length,
    overdue: overdue.length,
    harvested: harvested.length,
    insights,
  };
}

function calculateCropHealthScore({ total, active, harvestReady, overdue, needsIrrigation, weather }) {
  if (total === 0) return 0;

  let score = 60;

  // Active crops being managed (+20)
  if (active > 0) score += 15;
  if (active >= 3) score += 5;

  // Harvest ready is positive (+5)
  if (harvestReady > 0) score += 5;

  // Overdue is negative (-10 per overdue, capped)
  score -= Math.min(overdue * 10, 25);

  // Irrigation issues (-8 per crop)
  score -= Math.min(needsIrrigation * 8, 20);

  // Weather risk
  if (weather && weather.available) {
    const forecast = weather.forecast || [];
    const hasStorm = forecast.some(
      (d) => d.condition === "Thunderstorm" || (d.rainfall && d.rainfall > 20)
    );
    if (hasStorm) score -= 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getStatus(score) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

function generateInsights({ activeCrops, harvestReady, overdue, needsIrrigation, weather, upcomingHarvests }) {
  const insights = [];

  if (overdue.length > 0) {
    const names = overdue.slice(0, 2).map((c) => c.name || c.crop_name || "Unnamed").join(", ");
    insights.push({
      message: `${overdue.length} crop${overdue.length === 1 ? "" : "s"} past harvest date: ${names}. Harvest immediately to avoid quality loss.`,
      severity: "high",
      type: "harvest_overdue",
    });
  }

  if (harvestReady.length > 0 && overdue.length === 0) {
    insights.push({
      message: `${harvestReady.length} crop${harvestReady.length === 1 ? "" : "s"} ready for harvest this week.`,
      severity: "medium",
      type: "harvest_ready",
    });
  }

  if (needsIrrigation.length > 0) {
    insights.push({
      message: `${needsIrrigation.length} crop${needsIrrigation.length === 1 ? "" : "s"} may need irrigation.`,
      severity: "medium",
      type: "irrigation_needed",
    });
  }

  if (weather && weather.available) {
    const forecast = weather.forecast || [];
    const rainDay = forecast.find(
      (d) => d.condition === "Rain" || (d.rainfall && d.rainfall > 5)
    );
    if (rainDay && needsIrrigation.length > 0) {
      insights.push({
        message: "Rain is expected soon — consider skipping irrigation to avoid waterlogging.",
        severity: "low",
        type: "weather_rain",
      });
    }

    const stormDay = forecast.find(
      (d) => d.condition === "Thunderstorm" || (d.rainfall && d.rainfall > 20)
    );
    if (stormDay && harvestReady.length > 0) {
      insights.push({
        message: "Heavy weather forecast while crops are harvest-ready. Consider early harvesting.",
        severity: "high",
        type: "weather_storm",
      });
    }
  }

  if (upcomingHarvests.length > 0 && overdue.length === 0 && harvestReady.length === 0) {
    insights.push({
      message: `${upcomingHarvests.length} harvest${upcomingHarvests.length === 1 ? "" : "s"} approaching in the next 2 weeks.`,
      severity: "low",
      type: "upcoming_harvest",
    });
  }

  if (activeCrops.length > 0 && insights.length === 0) {
    insights.push({
      message: "All crops are on track. No issues detected.",
      severity: "low",
      type: "all_good",
    });
  }

  return insights;
}
