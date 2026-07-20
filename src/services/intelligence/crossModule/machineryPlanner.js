/**
 * FarmHand PRO — Cross-Module Intelligence
 * Machinery + Planner Provider
 *
 * Combines machinery service status with planner task schedules
 * to detect operational risks when required machines are unserviced.
 *
 * Expected data shape:
 * {
 *   machinery: {
 *     machines: [],          // Array of machine objects with id, name, category, hour_meter, status
 *     maintenancePlans: []   // Array of plans with machine_id, next_due_hours
 *   },
 *   planner: {
 *     today: [],     // Tasks due today
 *     upcoming: []   // Upcoming tasks
 *   }
 * }
 *
 * @param {object} data - Farm data context
 * @returns {Array} Array of insight objects
 */
export function generateMachineryPlannerInsights(data = {}) {
  try {
    const machinery = data.machinery || {};
    const planner = data.planner || {};

    const machines = Array.isArray(machinery.machines) ? machinery.machines : [];
    const plans = Array.isArray(machinery.maintenancePlans) ? machinery.maintenancePlans : [];
    const today = Array.isArray(planner.today) ? planner.today : [];
    const upcoming = Array.isArray(planner.upcoming) ? planner.upcoming : [];

    if (machines.length === 0 || (today.length === 0 && upcoming.length === 0)) return [];

    const allTasks = [...today, ...getTasksWithin7Days(upcoming)];
    if (allTasks.length === 0) return [];

    const overdueMachines = getOverdueMachines(machines, plans);
    const dueSoonMachines = getDueSoonMachines(machines, plans);
    const insights = [];

    // Critical: Overdue machine needed for upcoming task
    if (overdueMachines.length > 0) {
      const conflicts = findMachineTaskConflicts(overdueMachines, allTasks);
      if (conflicts.length > 0) {
        insights.push(buildOverdueConflictInsight(conflicts));
      }
    }

    // High: Machine due soon needed for upcoming task
    if (dueSoonMachines.length > 0) {
      const conflicts = findMachineTaskConflicts(dueSoonMachines, allTasks);
      if (conflicts.length > 0) {
        insights.push(buildDueSoonConflictInsight(conflicts));
      }
    }

    // Medium: Operational bottleneck (many machinery tasks, few available machines)
    const bottleneck = detectBottleneck(machines, plans, allTasks);
    if (bottleneck) {
      insights.push(bottleneck);
    }

    return insights;
  } catch {
    return [];
  }
}

// =====================================================
// Machinery-to-Task Keyword Mappings
// =====================================================

const MACHINE_TASK_KEYWORDS = {
  Tractor: ["cultivate", "plough", "plow", "harvest", "disc", "till", "tow", "pull", "drag"],
  Sprayer: ["spray", "spraying", "herbicide", "pesticide", "fungicide", "chemical"],
  Harvester: ["harvest", "harvesting", "combine", "reap"],
  Planter: ["plant", "planting", "seed", "sowing", "sow"],
  Trailer: ["transport", "haul", "move", "deliver", "load"],
  Vehicle: ["transport", "deliver", "collect", "pickup", "drive"],
  Implement: ["cultivate", "plough", "disc", "harrow", "till"],
  Pump: ["irrigate", "irrigation", "water", "pump"],
  Generator: ["power", "electric", "generator"],
};

// =====================================================
// Helpers
// =====================================================

/**
 * Filters upcoming tasks to those within the next 7 days.
 */
function getTasksWithin7Days(upcoming) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const sevenDays = new Date(now);
  sevenDays.setDate(sevenDays.getDate() + 7);

  return upcoming.filter((task) => {
    const dateStr = task.originalDate || task.due_date;
    if (!dateStr) return false;
    const dueDate = new Date(dateStr);
    return dueDate >= now && dueDate <= sevenDays;
  });
}

/**
 * Returns machines whose hours have exceeded their maintenance plan.
 */
function getOverdueMachines(machines, plans) {
  return machines.filter((machine) => {
    const plan = plans.find((p) => p.machine_id === machine.id);
    if (!plan) return false;
    const currentHours = Number(machine.hour_meter || 0);
    const nextDue = Number(plan.next_due_hours || 0);
    return currentHours >= nextDue;
  });
}

/**
 * Returns machines within 50 hours of their next service.
 */
function getDueSoonMachines(machines, plans) {
  return machines.filter((machine) => {
    const plan = plans.find((p) => p.machine_id === machine.id);
    if (!plan) return false;
    const currentHours = Number(machine.hour_meter || 0);
    const nextDue = Number(plan.next_due_hours || 0);
    const remaining = nextDue - currentHours;
    return remaining > 0 && remaining <= 50;
  });
}

/**
 * Finds tasks that likely require one of the given machines based on keyword matching.
 * Returns array of { machine, task } pairs.
 */
function findMachineTaskConflicts(machines, tasks) {
  const conflicts = [];

  for (const machine of machines) {
    const category = machine.category || "";
    const keywords = MACHINE_TASK_KEYWORDS[category] || [];
    const machineName = (machine.name || "").toLowerCase();

    for (const task of tasks) {
      const title = (task.title || "").toLowerCase();

      const matchesKeyword = keywords.some((kw) => title.includes(kw));
      const matchesMachineName = machineName && title.includes(machineName);

      if (matchesKeyword || matchesMachineName) {
        conflicts.push({ machine, task });
        break;
      }
    }
  }

  return conflicts;
}

/**
 * Detects operational bottleneck: many machinery tasks but few available machines.
 */
function detectBottleneck(machines, plans, tasks) {
  // Count tasks that require machinery
  const allKeywords = Object.values(MACHINE_TASK_KEYWORDS).flat();
  const machineryTasks = tasks.filter((task) => {
    const title = (task.title || "").toLowerCase();
    return allKeywords.some((kw) => title.includes(kw));
  });

  if (machineryTasks.length < 3) return null;

  // Count available machines (active + not overdue)
  const available = machines.filter((machine) => {
    if (machine.status !== "Active") return false;
    const plan = plans.find((p) => p.machine_id === machine.id);
    if (!plan) return true;
    const remaining = Number(plan.next_due_hours || 0) - Number(machine.hour_meter || 0);
    return remaining > 0;
  });

  if (available.length >= machineryTasks.length) return null;

  const taskNames = machineryTasks.slice(0, 3).map((t) => t.title || "Unnamed").join(", ");

  return {
    id: "cross-machinery-bottleneck",
    priority: "Medium",
    category: "Machinery",
    title: "Operational Bottleneck Risk",
    description: `${machineryTasks.length} machinery-dependent tasks (${taskNames}) are scheduled this week but only ${available.length} machine${available.length === 1 ? " is" : "s are"} fully available. Prioritise servicing or reschedule.`,
    action: "View machinery",
    route: "/machinery",
    source: "Machinery + Planner",
  };
}

// =====================================================
// Insight Builders
// =====================================================

function formatConflictNames(conflicts, max = 3) {
  const names = conflicts
    .slice(0, max)
    .map((c) => `${c.machine.name || "Machine"} (${c.task.title || "task"})`);
  const suffix = conflicts.length > max ? ` and ${conflicts.length - max} more` : "";
  return names.join(", ") + suffix;
}

function buildOverdueConflictInsight(conflicts) {
  return {
    id: "cross-machinery-overdue-task",
    priority: "Critical",
    category: "Machinery",
    title: "Overdue Machine Needed for Scheduled Work",
    description: `${formatConflictNames(conflicts)} — a machine overdue for service is likely required for upcoming tasks. Service immediately to avoid operational delays.`,
    action: "Record service",
    route: "/machinery",
    source: "Machinery + Planner",
  };
}

function buildDueSoonConflictInsight(conflicts) {
  return {
    id: "cross-machinery-duesoon-task",
    priority: "High",
    category: "Machinery",
    title: "Service Machine Before Scheduled Work",
    description: `${formatConflictNames(conflicts)} — a machine approaching service is needed for upcoming tasks. Schedule maintenance now to avoid unplanned downtime.`,
    action: "Plan service",
    route: "/machinery",
    source: "Machinery + Planner",
  };
}
