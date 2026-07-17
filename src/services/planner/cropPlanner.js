import { getCrops } from "../cropService";
import {
  formatDueDate,
  getTaskPriority,
  getTaskStatus,
} from "../../utils/plannerHelpers";

/**
 * Crop Planner Provider
 *
 * Generates dynamic planner tasks from crop records.
 * These tasks are virtual and are never stored in planner_tasks.
 */

const HARVEST_WARNING_DAYS = 14;

export async function getCropPlannerTasks() {
  const tasks = [];

  const crops = await getCrops();

  const today = new Date();

  for (const crop of crops) {
    // Ignore completed/harvested crops
    if (
      crop.status?.toLowerCase() === "harvested" ||
      !crop.expected_harvest
    ) {
      continue;
    }

    const harvestDate = new Date(crop.expected_harvest);

    const daysRemaining = Math.ceil(
      (harvestDate - today) / (1000 * 60 * 60 * 24)
    );

    // Ignore crops that are not close to harvest
    if (daysRemaining > HARVEST_WARNING_DAYS) {
      continue;
    }

    tasks.push({
      id: `crop-${crop.id}`,

      module: "Crops",

      title: `Harvest ${crop.crop_name}`,

      animalTag: crop.field_name || "",

      due: formatDueDate(crop.expected_harvest),

      originalDate: crop.expected_harvest,

      priority: getTaskPriority(crop.expected_harvest),

      status: getTaskStatus(crop.expected_harvest),

      sourceId: crop.id,

      record: crop,
    });
  }

  return tasks;
}