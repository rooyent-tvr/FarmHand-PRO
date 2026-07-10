/**
 * Smart Farm Planner Helpers
 *
 * Shared helper functions used by plannerService.js.
 * As more modules (Breeding, Crops, Finance, Livestock)
 * are added, they should all use these functions.
 */

/**
 * Remove time from a Date object.
 */
export function normalizeDate(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Calculate the number of days between today and a due date.
 */
export function getDaysUntil(dueDate) {
  const today = normalizeDate(new Date());
  const due = normalizeDate(dueDate);

  return Math.floor(
    (due - today) / (1000 * 60 * 60 * 24)
  );
}

/**
 * Convert a due date into friendly text.
 */
export function formatDueDate(dueDate) {
  const days = getDaysUntil(dueDate);

  if (days < 0) {
    if (days === -1) return "Yesterday";
    return `${Math.abs(days)} days overdue`;
  }

  if (days === 0) return "Today";

  if (days === 1) return "Tomorrow";

  if (days <= 7) {
    return `In ${days} days`;
  }

  return new Date(dueDate).toLocaleDateString();
}

/**
 * Determine planner status.
 */
export function getTaskStatus(dueDate) {
  const days = getDaysUntil(dueDate);

  if (days < 0) return "Overdue";

  if (days === 0) return "Today";

  return "Upcoming";
}

/**
 * Determine planner priority.
 */
export function getTaskPriority(dueDate) {
  const days = getDaysUntil(dueDate);

  if (days < 0) return "Critical";

  if (days <= 1) return "High";

  if (days <= 7) return "Medium";

  return "Low";
}

/**
 * Sort tasks by original due date.
 */
export function sortPlannerTasks(tasks) {
  return tasks.sort(
    (a, b) =>
      new Date(a.originalDate) -
      new Date(b.originalDate)
  );
}
