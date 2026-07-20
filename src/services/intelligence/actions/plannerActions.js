/**
 * FarmHand PRO — Intelligence Action Registry
 * Planner Actions Provider
 *
 * Maps planner-related insights to available user actions.
 *
 * Supported sources:
 *   - "Planner"
 *   - "Planner + Weather"
 *
 * @param {object} insight - Insight object from the intelligence engine
 * @returns {Array} Array of action objects
 */
export function getPlannerActions(insight) {
  try {
    const source = insight?.source || "";

    if (source === "Planner" || source === "Planner + Weather") {
      return [
        {
          label: "Open Planner",
          route: "/planner",
        },
        {
          label: "View Tasks",
          route: "/planner",
        },
      ];
    }

    return [];
  } catch {
    return [];
  }
}
