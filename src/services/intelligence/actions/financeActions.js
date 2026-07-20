/**
 * FarmHand PRO — Intelligence Action Registry
 * Finance Actions Provider
 *
 * Maps finance-related insights to available user actions.
 *
 * Supported sources:
 *   - "Finance"
 *   - "Finance + Livestock"
 *
 * @param {object} insight - Insight object from the intelligence engine
 * @returns {Array} Array of action objects
 */
export function getFinanceActions(insight) {
  try {
    const source = insight?.source || "";

    if (source === "Finance" || source === "Finance + Livestock") {
      return [
        {
          label: "Open Finance",
          route: "/finance",
        },
        {
          label: "View Reports",
          route: "/reports",
        },
      ];
    }

    return [];
  } catch {
    return [];
  }
}
