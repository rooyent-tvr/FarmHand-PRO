import { runMachineryAutomation } from "./automation/machineryAutomation";

/**
 * ============================================================
 * FarmHand PRO
 * Smart Automation Engine
 * ============================================================
 *
 * This service orchestrates all automation modules.
 *
 * Each module returns:
 * {
 *   module,
 *   scanned,
 *   generated,
 *   skipped,
 *   errors
 * }
 *
 * Future Modules
 * --------------
 * ✓ Machinery
 * • Crops
 * • Finance
 * • Animal Health
 * • Weather
 * • AI Assistant
 */

export async function runAutomationEngine() {
  const started = Date.now();

  const modules = [];

  // =====================================================
  // Machinery
  // =====================================================

  modules.push(await runMachineryAutomation());

  // =====================================================
  // Future Modules
  // =====================================================

  // modules.push(await runCropAutomation());
  // modules.push(await runFinanceAutomation());
  // modules.push(await runHealthAutomation());

  const summary = {
    startedAt: new Date().toISOString(),
    durationMs: Date.now() - started,

    scanned: modules.reduce(
      (total, module) => total + (module.scanned || 0),
      0
    ),

    generated: modules.reduce(
      (total, module) => total + (module.generated || 0),
      0
    ),

    skipped: modules.reduce(
      (total, module) => total + (module.skipped || 0),
      0
    ),

    errors: modules.reduce(
      (total, module) => total + (module.errors || 0),
      0
    ),

    modules,
  };

  return summary;
}
