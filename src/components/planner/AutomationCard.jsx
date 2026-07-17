import { useState } from "react";
import { FaRobot, FaPlay, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { runAutomationEngine } from "../../services/automationService";

export default function AutomationCard() {
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState(null);

  async function handleRunAutomation() {
    try {
      setRunning(true);

      const result = await runAutomationEngine();

      setSummary(result);
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <FaRobot className="text-blue-600 text-xl" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Smart Automation
            </h2>

            <p className="text-sm text-gray-500">
              Scan your farm and generate automatic reminders.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAutomation}
          disabled={running}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
        >
          <FaPlay />

          {running ? "Running..." : "Run Automation"}
        </button>
      </div>

      {!summary && (
        <div className="text-center py-10 text-gray-500">
          Automation has not been run yet.
        </div>
      )}

      {summary && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase">
                Generated
              </p>

              <h3 className="text-2xl font-bold text-green-600">
                {summary.generated}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase">
                Skipped
              </p>

              <h3 className="text-2xl font-bold text-yellow-600">
                {summary.skipped}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase">
                Errors
              </p>

              <h3 className="text-2xl font-bold text-red-600">
                {summary.errors}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase">
                Duration
              </p>

              <h3 className="text-2xl font-bold text-blue-600">
                {summary.durationMs} ms
              </h3>
            </div>

          </div>

          <div className="mt-6 border-t pt-5">

            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <FaCheckCircle className="text-green-500" />
              Machinery scanned: {summary.modules.machinery.scanned}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <FaCheckCircle className="text-green-500" />
              Crops scanned: {summary.modules.crops.scanned}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaCheckCircle className="text-green-500" />
              Finance records scanned: {summary.modules.finance.scanned}
            </div>

            {summary.errors > 0 && (
              <div className="mt-4 flex items-center gap-2 text-red-600 text-sm">
                <FaExclamationTriangle />
                Some automation modules encountered errors.
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
}