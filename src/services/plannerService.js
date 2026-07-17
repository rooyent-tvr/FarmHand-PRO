import { supabase } from "./supabase";
import { getHealthPlannerTasks } from "./planner/healthPlanner";
import { getBreedingPlannerTasks } from "./planner/breedingPlanner";
import { getMachineryPlannerTasks } from "./planner/machineryPlanner";
import { getCropPlannerTasks } from "./planner/cropPlanner";

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

// =====================================================
// Recurring Schedule Generator (Sprint 18.1)
// =====================================================

/**
 * Generates all future occurrences for a recurring task.
 * Called once at creation time. Never called on complete.
 *
 * @param {string} parentTaskId - The root task id for the series
 * @param {object} taskData - Fields to copy into each occurrence
 * @param {string} taskData.user_id
 * @param {string} taskData.title
 * @param {string} taskData.description
 * @param {string} taskData.module
 * @param {string} taskData.priority
 * @param {string} taskData.assigned_to
 * @param {string} taskData.source
 * @param {string} taskData.repeat_type - Daily | Weekly | Monthly | Yearly
 * @param {string|null} taskData.repeat_until
 * @param {string} startDate - ISO date string of the first occurrence (already created)
 */
async function generateRecurringSchedule(parentTaskId, taskData, startDate) {
  const { repeat_type, repeat_until } = taskData;

  // Determine end boundary
  let endDate;
  if (repeat_until) {
    endDate = new Date(repeat_until);
  } else {
    // Default planning horizons
    endDate = new Date(startDate);
    switch (repeat_type) {
      case "Daily":
        endDate.setDate(endDate.getDate() + 365);
        break;
      case "Weekly":
        endDate.setDate(endDate.getDate() + 52 * 7);
        break;
      case "Monthly":
        endDate.setMonth(endDate.getMonth() + 12);
        break;
      case "Yearly":
        endDate.setFullYear(endDate.getFullYear() + 10);
        break;
    }
  }

  // Generate all future dates (starting AFTER the first occurrence)
  const dates = [];
  let current = new Date(startDate);

  while (true) {
    switch (repeat_type) {
      case "Daily":
        current = new Date(current);
        current.setDate(current.getDate() + 1);
        break;
      case "Weekly":
        current = new Date(current);
        current.setDate(current.getDate() + 7);
        break;
      case "Monthly":
        current = new Date(current);
        current.setMonth(current.getMonth() + 1);
        break;
      case "Yearly":
        current = new Date(current);
        current.setFullYear(current.getFullYear() + 1);
        break;
    }

    if (current > endDate) break;

    dates.push(current.toISOString().split("T")[0]);
  }

  if (dates.length === 0) return;

  // Duplicate protection: check which dates already exist for this series
  const { data: existing } = await supabase
    .from("planner_tasks")
    .select("due_date")
    .eq("parent_task_id", parentTaskId);

  const existingDates = new Set(
    (existing || []).map((t) => t.due_date)
  );

  // Filter out duplicates
  const newDates = dates.filter((d) => !existingDates.has(d));

  if (newDates.length === 0) return;

  // Batch insert (Supabase supports array inserts)
  const records = newDates.map((dueDate) => ({
    user_id: taskData.user_id,
    title: taskData.title,
    description: taskData.description,
    module: taskData.module,
    priority: taskData.priority,
    assigned_to: taskData.assigned_to,
    source: taskData.source,
    repeat_type: taskData.repeat_type,
    repeat_until: taskData.repeat_until,
    parent_task_id: parentTaskId,
    due_date: dueDate,
    completed: false,
    status: "Pending",
    last_generated: new Date().toISOString().split("T")[0],
  }));

  const { error } = await supabase
    .from("planner_tasks")
    .insert(records);

  if (error) throw error;
}

// =====================================================
// Create Manual Task
// =====================================================

export async function createManualTask(task) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error("User not logged in.");
  }

  const repeatType = task.repeat_type || "None";

  // Insert the first occurrence
  const { data: inserted, error } = await supabase
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
        repeat_type: repeatType,
        repeat_until: task.repeat_until || null,
        parent_task_id: task.parent_task_id || null,
        last_generated: null,
      },
    ])
    .select("id");

  if (error) throw error;

  // If recurring, generate the full schedule immediately
  if (repeatType !== "None" && task.due_date) {
    const firstTaskId = inserted?.[0]?.id;

    if (firstTaskId) {
      // Set parent_task_id on the first task to itself (series root)
      await supabase
        .from("planner_tasks")
        .update({ parent_task_id: firstTaskId })
        .eq("id", firstTaskId);

      await generateRecurringSchedule(
        firstTaskId,
        {
          user_id: user.id,
          title: task.title,
          description: task.description,
          module: task.module,
          priority: task.priority,
          assigned_to: task.assigned_to,
          source: "Manual",
          repeat_type: repeatType,
          repeat_until: task.repeat_until || null,
        },
        task.due_date
      );
    }
  }
}

// =====================================================
// Complete Manual Task (Sprint 18.1 - simplified)
// =====================================================

export async function completeManualTask(taskId) {
  const { error } = await supabase
    .from("planner_tasks")
    .update({
      completed: true,
      status: "Completed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId);

  if (error) throw error;
}

// =====================================================
// Delete Manual Task
// =====================================================

export async function deleteManualTask(taskId) {
  const { error } = await supabase
    .from("planner_tasks")
    .delete()
    .eq("id", taskId);

  if (error) {
    throw error;
  }
}

// =====================================================
// Update Manual Task
// =====================================================

export async function updateManualTask(taskId, updates) {
  const repeatType = updates.repeat_type || "None";

  const { error } = await supabase
    .from("planner_tasks")
    .update({
      title: updates.title,
      description: updates.description,
      module: updates.module,
      priority: updates.priority,
      assigned_to: updates.assigned_to,
      due_date: updates.due_date || null,
      repeat_type: repeatType,
      repeat_until: updates.repeat_until || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId);

  if (error) throw error;

  // If recurring, generate the schedule (duplicate protection is built-in)
  if (repeatType !== "None" && updates.due_date) {
    // Fetch the task to get user_id and determine parent_task_id
    const { data: task, error: fetchError } = await supabase
      .from("planner_tasks")
      .select("id, user_id, parent_task_id")
      .eq("id", taskId)
      .single();

    if (fetchError || !task) return;

    const parentId = task.parent_task_id || task.id;

    // Ensure parent_task_id is set on this task
    if (!task.parent_task_id) {
      await supabase
        .from("planner_tasks")
        .update({ parent_task_id: parentId })
        .eq("id", taskId);
    }

    await generateRecurringSchedule(
      parentId,
      {
        user_id: task.user_id,
        title: updates.title,
        description: updates.description,
        module: updates.module,
        priority: updates.priority,
        assigned_to: updates.assigned_to,
        source: "Manual",
        repeat_type: repeatType,
        repeat_until: updates.repeat_until || null,
      },
      updates.due_date
    );
  }
}

// =====================================================
// Get Manual Tasks (internal)
// =====================================================

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

// =====================================================
// Get Planner Tasks (public)
// =====================================================

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
      repeatType: task.repeat_type || "None",
      repeatUntil: task.repeat_until,
      parentTaskId: task.parent_task_id,
    };

    addTask(planner, plannerTask);
  }

  // =====================================================
  // Animal Health
  // =====================================================

  try {
    const healthTasks = await getHealthPlannerTasks();

    for (const task of healthTasks) {
      addTask(planner, task);
    }
  } catch (err) {
    // Health planner failed silently
  }

  // =====================================================
  // Breeding
  // =====================================================

  try {
    const breedingTasks = await getBreedingPlannerTasks();

    for (const task of breedingTasks) {
      addTask(planner, task);
    }
  } catch (err) {
    // Breeding planner failed silently
  }

  // =====================================================
  // Machinery
  // =====================================================

  try {
    const machineryTasks = await getMachineryPlannerTasks();

    for (const task of machineryTasks) {
      addTask(planner, task);
    }
  } catch (err) {
    // Machinery planner failed silently
  }

  // =====================================================
  // Crops
  // =====================================================

  try {
    const cropTasks = await getCropPlannerTasks();

    for (const task of cropTasks) {
      addTask(planner, task);
    }
  } catch (err) {
    // Crop planner failed silently
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
