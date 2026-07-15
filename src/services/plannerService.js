import { supabase } from "./supabase";
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

export async function createManualTask(task) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error("User not logged in.");
  }

  const { error } = await supabase
    .from("planner_tasks")
    .insert([
      {
        user_id: user.id,
        title: task.title,
        description: task.description,
        module: task.module,
        priority: task.priority,
        assigned_to: task.assigned_to,
        due_date: task.due_date || null,
        status: "Pending",
        completed: false,
        source: "Manual",
      },
    ]);

  if (error) {
    throw error;
  }
}

export async function completeManualTask(taskId) {
  const { error } = await supabase
    .from("planner_tasks")
    .update({
      completed: true,
      status: "Completed",
    })
    .eq("id", taskId);

  if (error) {
    throw error;
  }
}

export async function deleteManualTask(taskId) {
  const { error } = await supabase
    .from("planner_tasks")
    .delete()
    .eq("id", taskId);

  if (error) {
    throw error;
  }
}

async function getManualTasks() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("planner_tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function getPlannerTasks() {
  const planner = {
    today: [],
    upcoming: [],
    overdue: [],
    completed: [],
  };

  let manualTasks = [];

  try {
    manualTasks = await getManualTasks();
  } catch (err) {
    console.error("Manual Tasks:", err);
  }

  for (const task of manualTasks) {
    const plannerTask = {
      id: task.id,
      module: task.module || "General",
      title: task.title,
      animalTag: "",
      due: task.due_date
        ? formatDueDate(task.due_date)
        : "No Due Date",
      originalDate: task.due_date,
      priority: task.priority || "Medium",
      status: task.completed === true
        ? "Completed"
        : task.due_date
          ? getTaskStatus(task.due_date)
          : "Upcoming",
      sourceId: task.id,
      record: task,
    };

    addTask(planner, plannerTask);
  }

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

    case "Completed":
      planner.completed.push(task);
      break;

    default:
      planner.upcoming.push(task);
  }
}




