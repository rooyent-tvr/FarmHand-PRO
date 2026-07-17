/**
 * Farm Health Score Engine
 *
 * Calculates an overall farm health score from the current
 * planner, livestock health, machinery, crops and finance data.
 *
 * Returns:
 * {
 *   score: Number,
 *   status: String,
 *   breakdown: {
 *     planner,
 *     health,
 *     machinery,
 *     crops,
 *     finance,
 *   }
 * }
 */

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function calculateFarmHealthScore({
  planner = {},
  health = {},
  machinery = {},
  crops = {},
  finance = {},
} = {}) {
  // ----------------------------------
  // Planner (30 points)
  // ----------------------------------

  const overdueTasks = planner.overdue ?? 0;

  const plannerScore = clamp(
    30 - overdueTasks * 2,
    0,
    30
  );

  // ----------------------------------
  // Animal Health (25 points)
  // ----------------------------------

  const healthAlerts = health.attention ?? 0;

  const healthScore = clamp(
    25 - healthAlerts * 2,
    0,
    25
  );

  // ----------------------------------
  // Machinery (20 points)
  // ----------------------------------

  const overdueServices =
    machinery.overdue ?? 0;

  const machineryScore = clamp(
    20 - overdueServices * 4,
    0,
    20
  );

  // ----------------------------------
  // Crops (15 points)
  // ----------------------------------

  const overdueHarvests =
    crops.overdue ?? 0;

  const cropScore = clamp(
    15 - overdueHarvests * 3,
    0,
    15
  );

  // ----------------------------------
  // Finance (10 points)
  // ----------------------------------

  const profit = finance.profit ?? 0;

  const financeScore =
    profit >= 0 ? 10 : 5;

  // ----------------------------------
  // Total
  // ----------------------------------

  const score =
    plannerScore +
    healthScore +
    machineryScore +
    cropScore +
    financeScore;

  let status = "Needs Attention";

  if (score >= 90) {
    status = "Excellent";
  } else if (score >= 75) {
    status = "Good";
  } else if (score >= 60) {
    status = "Fair";
  }

  return {
    score,

    status,

    breakdown: {
      planner: plannerScore,
      health: healthScore,
      machinery: machineryScore,
      crops: cropScore,
      finance: financeScore,
    },
  };
}