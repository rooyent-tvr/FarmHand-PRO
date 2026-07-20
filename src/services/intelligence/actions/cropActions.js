/**
 * FarmHand PRO — Intelligence Action Registry
 * Crop Actions Provider
 *
 * Maps crop-related insights to available user actions.
 *
 * Supported sources:
 *   - "Crops"
 *   - "Crop + Weather"
 *
 * @param {object} insight - Insight object from the intelligence engine
 * @returns {Array} Array of action objects
 */
export function getCropActions(insight) {
  try {
    const source = insight?.source || "";

    if (source === "Crops" || source === "Crop + Weather") {
      return [
        {
          label: "Open Crops",
          route: "/crops",
        },
        {
          label: "View Weather",
          route: "/dashboard",
        },
      ];
    }

    return [];
  } catch {
    return [];
  }
}
