/**
 * FarmHand PRO — Intelligence Engine
 * Planner Insights Provider
 *
 * Generates actionable insights from planner task data.
 * Covers overdue tasks, workload forecasting, and scheduling recommendations.
 *
 * Expected data shape:
 * {
 *   planner: {
 *     overdue: [],   // Array of overdue task objects
 *     today: [],     // Array of tasks due today
 *     upcoming: [],  // Array of upcoming task objects
 *     completed: []  // Array of completed task objects
 *   }
 * }
 *
 * @param {object} data - Farm data context
 * @returns {Array} Array of insight objects
 */
export function generatePlannerInsights(data = {}) {
  try {
    const planner = data.planner || {};
    const overdue = Array.isArray(planner.overdue) ? planner.overdue : [];
    const today = Array.isArray(planner.today) ? planner.today : [];
    const upcoming = Array.isArray(planner.upcoming) ? planner.upcoming : [];

    const insights = [];

    // Overdue tasks — Critical
    if (overdue.length > 0) {
      insights.push(buildOverdueInsight(overdue));
    }

    // Tasks due today — High
    if (today.length > 0) {
      insights.push(buildTodayInsight(today));
    }

    // Heavy workload — Medium
    const workloadInsight = evaluateWorkload(upcoming);
    if (workloadInsight) {
      insights.push(workloadInsight);
    }

    // No upcoming work — Low (informational)
    if (overdue.length === 0 && today.length === 0 && upcoming.length === 0) {
      insights.push(buildIdleInsight());
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
 * Builds the overdue tasks insight.
 */
function buildOverdueInsight(overdue) {
  const count = overdue.length;

  return {
    id: "planner-overdue",
    priority: "Critical",
    category: "Planner",
    title: `${count} Overdue Task${count === 1 ? "" : "s"}`,
    description: `You have ${count} planner task${count === 1 ? "" : "s"} past ${count === 1 ? "its" : "their"} due date. Completing overdue tasks will improve your Farm Health Score.`,
    action: "Review overdue tasks",
    route: "/planner",
    source: "Planner",
  };
}

/**
 * Builds the tasks-due-today insight.
 */
function buildTodayInsight(today) {
  const count = today.length;

  return {
    id: "planner-today",
    priority: "High",
    category: "Planner",
    title: `${count} Task${count === 1 ? "" : "s"} Due Today`,
    description: `${count} task${count === 1 ? " is" : "s are"} scheduled for today. Stay on track by completing them before end of day.`,
    action: "View today's tasks",
    route: "/planner",
    source: "Planner",
  };
}

/**
 * Evaluates upcoming workload and returns an insight if the load is notable.
 */
function evaluateWorkload(upcoming) {
  const count = upcoming.length;

  // Filter to next 7 days only
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const weekFromNow = new Date(now);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const thisWeek = upcoming.filter((task) => {
    if (!task.originalDate && !task.due_date) return false;
    const dueDate = new Date(task.originalDate || task.due_date);
    return dueDate >= now && dueDate <= weekFromNow;
  });

  const weekCount = thisWeek.length;

  if (weekCount >= 10) {
    return {
      id: "planner-heavy-workload",
      priority: "Medium",
      category: "Planner",
      title: "Heavy Workload This Week",
      description: `${weekCount} tasks are scheduled for the next 7 days. Consider delegating or spreading work across the week.`,
      action: "Review weekly schedule",
      route: "/planner",
      source: "Planner",
    };
  }

  if (weekCount >= 5) {
    return {
      id: "planner-moderate-workload",
      priority: "Medium",
      category: "Planner",
      title: "Moderate Workload Ahead",
      description: `${weekCount} tasks are coming up this week. Plan your time to stay on schedule.`,
      action: "View upcoming tasks",
      route: "/planner",
      source: "Planner",
    };
  }

  return null;
}

/**
 * Builds an informational insight when the planner is empty.
 */
function buildIdleInsight() {
  return {
    id: "planner-clear",
    priority: "Low",
    category: "Planner",
    title: "No Scheduled Tasks",
    description: "No tasks are scheduled for the next 7 days. Consider planning ahead or reviewing recurring task schedules.",
    action: "Open planner",
    route: "/planner",
    source: "Planner",
  };
}
