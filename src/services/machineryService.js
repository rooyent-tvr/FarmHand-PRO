import { supabase } from "./supabase";

const TABLE = "machinery";

/*
========================================================

Get All Machines

========================================================
*/

export async function getMachines() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
}

/*
========================================================

Get One Machine

========================================================
*/

export async function getMachine(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

/*
========================================================

Add Machine

========================================================
*/

export async function addMachine(machine) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const payload = {
    ...machine,
    user_id: user?.id,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/*
========================================================

Update Machine

========================================================
*/

export async function updateMachine(id, machine) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(machine)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/*
========================================================

Delete Machine

========================================================
*/

export async function deleteMachine(id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}


const SERVICES_TABLE = "machinery_services";

/*
========================================================

Get Machine Services

========================================================
*/

export async function getMachineServices(machineId) {
  const { data, error } = await supabase
    .from(SERVICES_TABLE)
    .select("*")
    .eq("machine_id", machineId)
    .order("service_date", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
}

/*
========================================================

Add Machine Service

========================================================
*/

export async function addMachineService(service) {
  const payload = {
    machine_id: service.machine_id,
    service_type: service.service_type,
    service_date: service.service_date,
    hour_meter: service.hour_meter,
    cost: service.cost,
    workshop: service.workshop || null,
    invoice_number: service.invoice_number || null,
    notes: service.notes,
  };

  const { data, error } = await supabase
    .from(SERVICES_TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/*
========================================================

Update Machine Service

========================================================
*/

export async function updateMachineService(id, service) {
  const { data, error } = await supabase
    .from(SERVICES_TABLE)
    .update(service)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/*
========================================================

Delete Machine Service

========================================================
*/

export async function deleteMachineService(id) {
  const { error } = await supabase
    .from(SERVICES_TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}


const MAINTENANCE_TABLE = "maintenance_plans";

/*
========================================================

Get Maintenance Plans

========================================================
*/

export async function getMaintenancePlans(machineId) {
  const { data, error } = await supabase
    .from(MAINTENANCE_TABLE)
    .select("*")
    .eq("machine_id", machineId)
    .order("service_type", {
      ascending: true,
    });

  if (error) throw error;

  return data || [];
}

/*
========================================================

Add Maintenance Plan

========================================================
*/

export async function addMaintenancePlan(plan) {
  const { data, error } = await supabase
    .from(MAINTENANCE_TABLE)
    .insert(plan)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/*
========================================================

Update Maintenance Plan

========================================================
*/

export async function updateMaintenancePlan(id, plan) {
  const { data, error } = await supabase
    .from(MAINTENANCE_TABLE)
    .update(plan)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/*
========================================================

Delete Maintenance Plan

========================================================
*/

export async function deleteMaintenancePlan(id) {
  const { error } = await supabase
    .from(MAINTENANCE_TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}
