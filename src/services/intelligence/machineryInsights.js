/**
 * FarmHand PRO — Intelligence Engine
 * Machinery Insights Provider
 *
 * Generates actionable insights from machinery and maintenance data.
 * Covers overdue services, upcoming services, cost anomalies, and fleet status.
 *
 * Expected data shape:
 * {
 *   machinery: {
 *     machines: [],          // Array of machine objects with hour_meter, name, status
 *     maintenancePlans: [],  // Array of active plans with machine_id, next_due_hours
 *     serviceHistory: []     // Array of service records with machine_id, cost
 *   }
 * }
 *
 * @param {object} data - Farm data context
 * @returns {Array} Array of insight objects
 */
export function generateMachineryInsights(data = {}) {
  try {
    const machinery = data.machinery || {};
    const machines = Array.isArray(machinery.machines) ? machinery.machines : [];
    const plans = Array.isArray(machinery.maintenancePlans) ? machinery.maintenancePlans : [];
    const serviceHistory = Array.isArray(machinery.serviceHistory) ? machinery.serviceHistory : [];

    const insights = [];

    if (machines.length === 0) {
      insights.push(buildNoMachineryInsight());
      return insights;
    }

    const overdue = getOverdueServices(machines, plans);
    const dueSoon = getServicesDueSoon(machines, plans);

    // Overdue services — Critical
    if (overdue.length > 0) {
      insights.push(buildOverdueServiceInsight(overdue));
    }

    // Services due within 30 days — High
    if (dueSoon.length > 0) {
      insights.push(buildServiceDueSoonInsight(dueSoon));
    }

    // High maintenance cost machines — Medium
    const costInsight = evaluateMaintenanceCosts(machines, serviceHistory);
    if (costInsight) {
      insights.push(costInsight);
    }

    return insights;
  } catch {
    return [];
  }
}

// =====================================================
// Helpers
// =====================================================

/**
 * Returns machines whose hour meter has exceeded their next_due_hours.
 */
function getOverdueServices(machines, plans) {
  const results = [];

  for (const plan of plans) {
    const machine = machines.find((m) => m.id === plan.machine_id);
    if (!machine) continue;

    const currentHours = Number(machine.hour_meter || 0);
    const nextDue = Number(plan.next_due_hours || 0);

    if (currentHours >= nextDue) {
      results.push(machine);
    }
  }

  return results;
}

/**
 * Returns machines approaching service (within estimated 30 days).
 * Uses a simple heuristic: remaining hours <= 50 (approx 30 days at moderate usage).
 */
function getServicesDueSoon(machines, plans) {
  const results = [];

  for (const plan of plans) {
    const machine = machines.find((m) => m.id === plan.machine_id);
    if (!machine) continue;

    const currentHours = Number(machine.hour_meter || 0);
    const nextDue = Number(plan.next_due_hours || 0);
    const remaining = nextDue - currentHours;

    if (remaining > 0 && remaining <= 50) {
      results.push(machine);
    }
  }

  return results;
}

/**
 * Evaluates maintenance costs across the fleet.
 * Returns an insight if any machine has costs significantly above average.
 */
function evaluateMaintenanceCosts(machines, serviceHistory) {
  if (serviceHistory.length < 3) return null;

  // Calculate total cost per machine
  const costByMachine = {};
  for (const service of serviceHistory) {
    if (!service.machine_id) continue;
    const cost = Number(service.cost || 0);
    costByMachine[service.machine_id] = (costByMachine[service.machine_id] || 0) + cost;
  }

  const machineIds = Object.keys(costByMachine);
  if (machineIds.length < 2) return null;

  const totalCost = machineIds.reduce((sum, id) => sum + costByMachine[id], 0);
  const averageCost = totalCost / machineIds.length;

  // Find machines with cost > 1.5x the average
  const expensive = machineIds
    .filter((id) => costByMachine[id] > averageCost * 1.5)
    .map((id) => {
      const machine = machines.find((m) => m.id === id);
      return machine ? machine.name || "Unknown" : null;
    })
    .filter(Boolean);

  if (expensive.length === 0) return null;

  const names = expensive.slice(0, 3).join(", ");

  return {
    id: "machinery-high-cost",
    priority: "Medium",
    category: "Machinery",
    title: "High Maintenance Costs Detected",
    description: `${names}${expensive.length > 3 ? ` and ${expensive.length - 3} more` : ""} ha${expensive.length === 1 ? "s" : "ve"} maintenance costs significantly above fleet average. Review service history for efficiency.`,
    action: "Review machinery costs",
    route: "/machinery",
    source: "Machinery",
  };
}

/**
 * Builds the overdue service insight.
 */
function buildOverdueServiceInsight(overdue) {
  const count = overdue.length;
  const names = overdue
    .slice(0, 3)
    .map((m) => m.name || "Unknown")
    .join(", ");

  return {
    id: "machinery-overdue-service",
    priority: "Critical",
    category: "Machinery",
    title: `${count} Machine${count === 1 ? "" : "s"} Overdue for Service`,
    description: `${names}${count > 3 ? ` and ${count - 3} more` : ""} ha${count === 1 ? "s" : "ve"} exceeded the scheduled service interval. Delayed servicing increases breakdown risk.`,
    action: "Record service",
    route: "/machinery",
    source: "Machinery",
  };
}

/**
 * Builds the service-due-soon insight.
 */
function buildServiceDueSoonInsight(dueSoon) {
  const count = dueSoon.length;
  const names = dueSoon
    .slice(0, 3)
    .map((m) => m.name || "Unknown")
    .join(", ");

  return {
    id: "machinery-service-soon",
    priority: "High",
    category: "Machinery",
    title: `${count} Machine${count === 1 ? "" : "s"} Approaching Service`,
    description: `${names}${count > 3 ? ` and ${count - 3} more` : ""} will require servicing soon. Schedule maintenance to avoid unplanned downtime.`,
    action: "Plan service",
    route: "/machinery",
    source: "Machinery",
  };
}

/**
 * Builds the informational insight when no machinery exists.
 */
function buildNoMachineryInsight() {
  return {
    id: "machinery-none",
    priority: "Low",
    category: "Machinery",
    title: "No Machinery Registered",
    description: "No farm machinery has been added yet. Register your equipment to enable service tracking and maintenance intelligence.",
    action: "Add machine",
    route: "/machinery",
    source: "Machinery",
  };
}
