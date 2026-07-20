/**
 * FarmHand PRO — Intelligence Action Registry
 * Machinery Actions Provider
 *
 * Maps machinery-related insights to available user actions.
 * Returns context-aware actions based on the insight source and priority.
 *
 * Supported sources:
 *   - "Machinery"
 *   - "Machinery + Planner"
 *
 * @param {object} insight - Insight object from the intelligence engine
 * @returns {Array} Array of action objects
 */
export function getMachineryActions(insight) {
  try {
    const source = insight?.source || "";

    if (source === "Machinery" || source === "Machinery + Planner") {
      return [
        {
          label: "Open Machinery",
          route: "/machinery",
        },
        {
          label: "Create Service Task",
          route: "/planner",
          payload: {
            source: "Machinery",
            priority: insight.priority,
            insightId: insight.id,
          },
        },
      ];
    }

    return [];
  } catch {
    return [];
  }
}
