/**
 * FarmHand PRO — Intelligence Engine
 * Shared Priority Definitions
 *
 * Provides a consistent priority ordering across all
 * intelligence providers and the central engine.
 */

/**
 * Priority levels in descending order of urgency.
 * @type {Record<string, number>}
 */
export const priorityOrder = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

/**
 * Sorts an array of insight objects by priority.
 * Critical items appear first, Low items appear last.
 *
 * @param {Array<{priority: string}>} insights - Array of insight objects
 * @returns {Array} Sorted array (mutates in place and returns)
 */
export function sortInsights(insights) {
  return insights.sort(
    (a, b) =>
      (priorityOrder[a.priority] ?? 999) -
      (priorityOrder[b.priority] ?? 999)
  );
}
