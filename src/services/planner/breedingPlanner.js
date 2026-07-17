import { getBreedingRecords } from "../breedingService";
import {
  formatDueDate,
  getTaskPriority,
  getTaskStatus,
} from "../../utils/plannerHelpers";

/**
 * Breeding Planner Provider
 *
 * Generates dynamic planner tasks from breeding records.
 * These tasks are virtual and are never stored in planner_tasks.
 */
export async function getBreedingPlannerTasks() {
  const tasks = [];

  const breedingRecords = await getBreedingRecords();

  for (const record of breedingRecords) {
    if (
      record.status !== "Pregnant" ||
      !record.expected_birth
    ) {
      continue;
    }

    // Expected Birth
    tasks.push({
      id: `birth-${record.id}`,
      module: "Breeding",

      title: "Expected Birth",

      animalTag: record.female?.tag || "",

      due: formatDueDate(record.expected_birth),

      originalDate: record.expected_birth,

      priority: getTaskPriority(record.expected_birth),

      status: getTaskStatus(record.expected_birth),

      sourceId: record.id,

      record,
    });

    // Prepare Birth Pen (14 days before expected birth)
    const prepDate = new Date(record.expected_birth);
    prepDate.setDate(prepDate.getDate() - 14);

    tasks.push({
      id: `prep-${record.id}`,
      module: "Breeding",

      title: "Prepare Birth Pen",

      animalTag: record.female?.tag || "",

      due: formatDueDate(prepDate),

      originalDate: prepDate,

      priority: getTaskPriority(prepDate),

      status: getTaskStatus(prepDate),

      sourceId: record.id,

      record,
    });
  }

  return tasks;
}