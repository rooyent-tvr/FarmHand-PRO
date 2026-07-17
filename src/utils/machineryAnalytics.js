/**
 * FarmHand PRO — Machinery Analytics Engine
 * Sprint 29
 *
 * Generates operational analytics from machinery data.
 * Returns metrics, utilisation, and insights.
 *
 * @param {object} params
 * @param {Array} params.machines - Machine records
 * @param {Array} params.serviceHistory - All service records across machines
 * @param {Array} params.maintenancePlans - Active maintenance plans
 *
 * @returns {object} Analytics object for MachineryInsights component
 */

export function generateMachineryAnalytics({
  machines = [],
  serviceHistory = [],
  maintenancePlans = [],
} = {}) {
  // Need at least 1 machine and 1 service record
  if (machines.length === 0 || serviceHistory.length === 0) {
    return { available: false };
  }

  // Total maintenance cost
  const totalMaintenanceCost = serviceHistory.reduce(
    (sum, s) => sum + (Number(s.cost) || 0),
    0
  );

  // Average service cost
  const averageServiceCost = Math.round(totalMaintenanceCost / serviceHistory.length);

  // Total fleet hours
  const totalHours = machines.reduce(
    (sum, m) => sum + (Number(m.hour_meter) || 0),
    0
  );

  // Cost per operating hour
  const costPerHour = totalHours > 0
    ? (totalMaintenanceCost / totalHours)
    : null;

  // Average days between services
  let avgDaysBetweenServices = null;
  if (serviceHistory.length >= 2) {
    const sorted = [...serviceHistory].sort(
      (a, b) => new Date(a.service_date) - new Date(b.service_date)
    );

    let totalDays = 0;
    let intervals = 0;

    for (let i = 1; i < sorted.length; i++) {
      const diff = (new Date(sorted[i].service_date) - new Date(sorted[i - 1].service_date)) / (1000 * 60 * 60 * 24);
      if (diff > 0) {
        totalDays += diff;
        intervals++;
      }
    }

    if (intervals > 0) {
      avgDaysBetweenServices = Math.round(totalDays / intervals);
    }
  }

  // Utilisation (active machines as percentage)
  const activeMachines = machines.filter((m) => m.status === "Active").length;
  const utilisation = machines.length > 0
    ? Math.round((activeMachines / machines.length) * 100)
    : 0;

  // Downtime (non-active machines as percentage)
  const downtime = 100 - utilisation;

  // Insights
  const insights = [];

  if (costPerHour !== null && costPerHour > 200) {
    insights.push({
      message: "Cost per operating hour is above R200. Review maintenance efficiency.",
      severity: "medium",
    });
  }

  if (avgDaysBetweenServices !== null && avgDaysBetweenServices < 30) {
    insights.push({
      message: "Average service interval is decreasing. Machines may need attention.",
      severity: "medium",
    });
  }

  if (utilisation >= 90) {
    insights.push({
      message: "Machine utilisation is above target. Excellent fleet management.",
      severity: "low",
    });
  }

  if (utilisation < 50 && machines.length > 1) {
    insights.push({
      message: "Low utilisation detected. Consider reviewing idle equipment.",
      severity: "medium",
    });
  }

  if (downtime > 20) {
    insights.push({
      message: "High downtime detected. Multiple machines are inactive.",
      severity: "high",
    });
  }

  return {
    available: true,
    costPerHour,
    averageServiceCost,
    totalMaintenanceCost,
    avgDaysBetweenServices,
    utilisation,
    downtime,
    insights,
  };
}
