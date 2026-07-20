/**
 * FarmHand PRO — Intelligence Action Registry
 *
 * Maps intelligence insights to available user actions based on source.
 * Each module provider returns context-specific actions for a given insight.
 *
 * Adding a new action provider:
 *   1. Create a new file (e.g. weatherActions.js)
 *   2. Export a function that accepts (insight) and returns an array of actions
 *   3. Import it here and register in the sourceMap
 */

import { getPlannerActions } from "./plannerActions";
import { getCropActions } from "./cropActions";
import { getMachineryActions } from "./machineryActions";
import { getLivestockActions } from "./livestockActions";
import { getFinanceActions } from "./financeActions";

/**
 * Source-to-provider mapping.
 * Keys match the `source` field on insight objects.
 */
const sourceMap = {
  Planner: getPlannerActions,
  Crops: getCropActions,
  Machinery: getMachineryActions,
  Livestock: getLivestockActions,
  Finance: getFinanceActions,
  "Planner + Weather": getPlannerActions,
  "Crop + Weather": getCropActions,
  "Machinery + Planner": getMachineryActions,
  "Livestock + Health": getLivestockActions,
  "Finance + Livestock": getFinanceActions,
};

/**
 * Returns available actions for a given insight.
 *
 * @param {object} insight - Insight object from the intelligence engine
 * @returns {Array} Array of action objects (empty if no actions available)
 */
export function getInsightActions(insight) {
  try {
    if (!insight || !insight.source) return [];

    const provider = sourceMap[insight.source];
    if (!provider) return [];

    const actions = provider(insight);
    return Array.isArray(actions) ? actions : [];
  } catch {
    return [];
  }
}
