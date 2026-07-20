/**
 * FarmHand PRO — Intelligence Action Registry
 * Livestock Actions Provider
 *
 * Maps livestock-related insights to available user actions.
 *
 * Supported sources:
 *   - "Livestock"
 *   - "Livestock + Health"
 *
 * @param {object} insight - Insight object from the intelligence engine
 * @returns {Array} Array of action objects
 */
export function getLivestockActions(insight) {
  try {
    const source = insight?.source || "";

    if (source === "Livestock" || source === "Livestock + Health") {
      return [
        {
          label: "Open Livestock",
          route: "/livestock",
        },
        {
          label: "Schedule Health Check",
          route: "/planner",
          payload: {
            source: "Livestock",
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
