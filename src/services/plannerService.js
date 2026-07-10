import { getHealthRecords } from "./healthService";
import { getBreedingRecords } from "./breedingService";

import {
  formatDueDate,
  getTaskPriority,
  getTaskStatus,
  sortPlannerTasks,
} from "../utils/plannerHelpers";

/**
 * Smart Farm Planner Service
 *
 * Current Modules
 * --------------------
 * ✅ Animal Health
 * ✅ Breeding
 *
 * Coming Soon
 * --------------------
 * Crops
 * Finance
 * Livestock
 */

export async function getPlannerTasks() {
  const planner = {
    today: [],
    upcoming: [],
    overdue: [],
    completed: [],
  };

  // =====================================================
  // Animal Health
  // =====================================================

  const healthRecords = await getHealthRecords();

  for (const record of healthRecords) {
    if (!record.next_due) continue;

    const task = {
      id: `health-${record.id}`,

      module: "Animal Health",

      title:
        record.treatment_type ||
        record.treatment ||
        "Health Treatment",

      animalTag:
        record.livestock?.tag || "",

      due: formatDueDate(record.next_due),

      originalDate: record.next_due,

      priority: getTaskPriority(record.next_due),

      status: getTaskStatus(record.next_due),

      sourceId: record.id,

      record,
    };

    addTask(planner, task);
  }

  // =====================================================
  // Breeding
  // =====================================================

  const breedingRecords = await getBreedingRecords();

  for (const record of breedingRecords) {
    if (
      record.status !== "Pregnant" ||
      !record.expected_birth
    ) {
      continue;
    }

    // ---------------------------------------
    // Expected Birth
    // ---------------------------------------

    const birthTask = {
      id: `birth-${record.id}`,

      module: "Breeding",

      title: "Expected Birth",

      animalTag:
        record.female?.tag || "",

      due: formatDueDate(
        record.expected_birth
      ),

      originalDate:
        record.expected_birth,

      priority: getTaskPriority(
        record.expected_birth
      ),

      status: getTaskStatus(
        record.expected_birth
      ),

      sourceId: record.id,

      record,
    };

    addTask(planner, birthTask);

    // ---------------------------------------
    // Prepare Birth Pen
    // (14 days before birth)
    // ---------------------------------------

    const prepDate = new Date(
      record.expected_birth
    );

    prepDate.setDate(
      prepDate.getDate() - 14
    );

    const prepTask = {
      id: `prep-${record.id}`,

      module: "Breeding",

      title: "Prepare Birth Pen",

      animalTag:
        record.female?.tag || "",

      due: formatDueDate(prepDate),

      originalDate: prepDate,

      priority: getTaskPriority(
        prepDate
      ),

      status: getTaskStatus(
        prepDate
      ),

      sourceId: record.id,

      record,
    };

    addTask(planner, prepTask);
  }

  // =====================================================
  // Sort
  // =====================================================

  sortPlannerTasks(planner.today);
  sortPlannerTasks(planner.upcoming);
  sortPlannerTasks(planner.overdue);

  return planner;
}

/**
 * Helper
 * Adds task to the correct planner section.
 */
function addTask(planner, task) {
  switch (task.status) {
    case "Today":
      planner.today.push(task);
      break;

    case "Overdue":
      planner.overdue.push(task);
      break;

    default:
      planner.upcoming.push(task);
  }
}
