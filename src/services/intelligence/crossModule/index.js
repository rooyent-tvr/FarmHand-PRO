/**
 * FarmHand PRO — Cross-Module Intelligence Engine
 *
 * Orchestrates cross-module providers that combine data from
 * multiple domains to generate richer operational recommendations.
 *
 * This layer runs after the main intelligence providers.
 * It does not replace them — it supplements with higher-value
 * insights that require multi-domain reasoning.
 *
 * Adding a new cross-module provider:
 *   1. Create a new file (e.g. cropFinance.js)
 *   2. Export a function that accepts (data) and returns an array
 *   3. Import it here and add to the providers array
 */

import { generateCropWeatherInsights } from "./cropWeather";
import { generatePlannerWeatherInsights } from "./plannerWeather";
import { generateLivestockHealthInsights } from "./livestockHealth";
import { generateFinanceLivestockInsights } from "./financeLivestock";
import { generateMachineryPlannerInsights } from "./machineryPlanner";

/**
 * Registered cross-module providers.
 */
const providers = [
  { name: "CropWeather", fn: generateCropWeatherInsights },
  { name: "PlannerWeather", fn: generatePlannerWeatherInsights },
  { name: "LivestockHealth", fn: generateLivestockHealthInsights },
  { name: "FinanceLivestock", fn: generateFinanceLivestockInsights },
  { name: "MachineryPlanner", fn: generateMachineryPlannerInsights },
];

/**
 * Generates cross-module insights by querying all registered providers.
 *
 * @param {object} data - Farm data context (same object passed to main providers)
 * @returns {Array} Combined array of cross-module insight objects
 */
export function getCrossModuleInsights(data = {}) {
  const combined = [];

  for (const provider of providers) {
    try {
      const results = provider.fn(data);

      if (Array.isArray(results)) {
        for (const item of results) {
          if (item && typeof item === "object" && item.title) {
            combined.push(item);
          }
        }
      }
    } catch (err) {
      console.warn(
        `[CrossModule] ${provider.name} provider failed:`,
        err.message || err
      );
    }
  }

  return combined;
}
