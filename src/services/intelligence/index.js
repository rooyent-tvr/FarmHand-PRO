/**
 * FarmHand PRO — Farm Intelligence Engine
 * Sprint 32 / 33
 *
 * Central orchestrator that combines insights from all providers
 * and cross-module intelligence into a single prioritised array.
 *
 * Architecture:
 *   1. Each provider returns an array of insight objects.
 *   2. Cross-module providers combine multi-domain data for richer insights.
 *   3. The engine merges, deduplicates, filters, sorts, and returns the result.
 *   A failing provider is logged and skipped — it never breaks the engine.
 *
 * Diagnostics:
 *   In development mode (import.meta.env.DEV), the engine logs a performance
 *   and coverage report to the console after each run.
 */

import { sortInsights } from "./priorities";
import { generatePlannerInsights } from "./plannerInsights";
import { generateLivestockInsights } from "./livestockInsights";
import { generateCropInsights } from "./cropInsights";
import { generateFinanceInsights } from "./financeInsights";
import { generateMachineryInsights } from "./machineryInsights";
import { generateWeatherInsights } from "./weatherInsights";
import { getCrossModuleInsights } from "./crossModule";

/**
 * Registered intelligence providers.
 */
const providers = [
  { name: "Planner", fn: generatePlannerInsights },
  { name: "Livestock", fn: generateLivestockInsights },
  { name: "Crops", fn: generateCropInsights },
  { name: "Finance", fn: generateFinanceInsights },
  { name: "Machinery", fn: generateMachineryInsights },
  { name: "Weather", fn: generateWeatherInsights },
];

/**
 * Removes duplicate insights by id, keeping the first occurrence.
 * Returns { deduplicated, duplicatesRemoved }.
 */
function deduplicateById(insights) {
  const seen = new Set();
  let duplicatesRemoved = 0;

  const deduplicated = insights.filter((item) => {
    if (!item.id) return true;
    if (seen.has(item.id)) {
      duplicatesRemoved++;
      return false;
    }
    seen.add(item.id);
    return true;
  });

  return { deduplicated, duplicatesRemoved };
}

/**
 * Generates a complete set of farm insights by querying all registered providers
 * and the cross-module intelligence layer.
 *
 * @param {object} data - Farm data context passed to every provider
 * @returns {Promise<Array>} Sorted, deduplicated array of insight objects
 */
export async function getFarmInsights(data = {}) {
  const startTime = performance.now();
  const diagnostics = [];
  const combined = [];

  // Phase 1: Run all primary providers
  for (const provider of providers) {
    try {
      const results = await provider.fn(data);
      const count = Array.isArray(results) ? results.length : 0;

      if (Array.isArray(results)) {
        for (const item of results) {
          if (item && typeof item === "object" && item.title) {
            combined.push(item);
          }
        }
      }

      diagnostics.push({ name: provider.name, type: "primary", count });
    } catch (err) {
      console.warn(
        `[Intelligence] ${provider.name} provider failed:`,
        err.message || err
      );
      diagnostics.push({ name: provider.name, type: "primary", count: 0, error: true });
    }
  }

  // Phase 2: Run cross-module intelligence
  let crossModuleCount = 0;
  try {
    const crossModuleResults = getCrossModuleInsights(data);

    if (Array.isArray(crossModuleResults)) {
      for (const item of crossModuleResults) {
        if (item && typeof item === "object" && item.title) {
          combined.push(item);
          crossModuleCount++;
        }
      }
    }

    diagnostics.push({ name: "CrossModule", type: "cross", count: crossModuleCount });
  } catch (err) {
    console.warn(
      "[Intelligence] Cross-module engine failed:",
      err.message || err
    );
    diagnostics.push({ name: "CrossModule", type: "cross", count: 0, error: true });
  }

  // Phase 3: Deduplicate, sort, return
  const totalBeforeDedup = combined.length;
  const { deduplicated, duplicatesRemoved } = deduplicateById(combined);
  const sorted = sortInsights(deduplicated);

  // Diagnostics (development only)
  if (import.meta.env.DEV) {
    const duration = (performance.now() - startTime).toFixed(1);

    console.groupCollapsed(
      `%c[Intelligence] Engine completed in ${duration}ms — ${sorted.length} insights`,
      "color: #2e7d32; font-weight: bold"
    );

    console.table(
      diagnostics.map((d) => ({
        Provider: d.name,
        Type: d.type,
        Insights: d.count,
        Status: d.error ? "❌ Failed" : "✅ OK",
      }))
    );

    console.log(`Total before dedup: ${totalBeforeDedup}`);
    console.log(`Duplicates removed: ${duplicatesRemoved}`);
    console.log(`Total after dedup:  ${sorted.length}`);
    console.log(`Execution time:     ${duration}ms`);

    console.groupEnd();
  }

  return sorted;
}
