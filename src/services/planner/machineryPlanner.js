import {
  getMachines,
  getAllMaintenancePlans,
} from "../machineryService";

/**
 * Machinery Planner Provider
 *
 * Generates dynamic planner tasks for machinery maintenance.
 * These tasks are virtual and are never stored in planner_tasks.
 */

import {
  formatDueDate,
  getTaskPriority,
  getTaskStatus,
} from "../../utils/plannerHelpers";

const WARNING_HOURS = 20;

export async function getMachineryPlannerTasks() {
  const tasks = [];

  const [machines, maintenancePlans] = await Promise.all([
    getMachines(),
    getAllMaintenancePlans(),
  ]);

  const machineMap = new Map(
    machines.map((machine) => [machine.id, machine])
  );

  for (const plan of maintenancePlans) {
    const machine = machineMap.get(plan.machine_id);

    if (!machine) continue;

    const currentHours = Number(machine.hour_meter || 0);
    const dueHours = Number(plan.next_due_hours || 0);

    const hoursRemaining = dueHours - currentHours;

    // Ignore services that are still far away
    if (hoursRemaining > WARNING_HOURS) continue;

    const status =
      hoursRemaining < 0
        ? "Overdue"
        : hoursRemaining === 0
          ? "Today"
          : "Upcoming";

    tasks.push({
      id: `machinery-${plan.id}`,

      module: "Machinery",

      title: `${plan.service_type} Service`,

      animalTag: machine.name,

      due:
        hoursRemaining <= 0
          ? `${Math.abs(hoursRemaining)} hours overdue`
          : `${hoursRemaining} hours remaining`,

      originalDate: null,

      priority:
        hoursRemaining <= 0
          ? "High"
          : "Medium",

      status,

      sourceId: plan.id,

      record: {
        ...plan,
        machine,
      },
    });
  }

  return tasks;
}