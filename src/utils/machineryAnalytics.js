/**
 * FarmHand PRO — Machinery Analytics Engine
 * Sprint 44.8 — Fleet Operations Intelligence
 *
 * Generates operational analytics and actionable AI recommendations.
 */

export function generateMachineryAnalytics({
  machines = [],
  serviceHistory = [],
  maintenancePlans = [],
  weather = null,
} = {}) {
  if (machines.length === 0) {
    return { available: false, insights: [] };
  }

  // Total maintenance cost
  const totalMaintenanceCost = serviceHistory.reduce(
    (sum, s) => sum + (Number(s.cost) || 0), 0
  );

  // Average service cost
  const averageServiceCost = serviceHistory.length > 0
    ? Math.round(totalMaintenanceCost / serviceHistory.length)
    : 0;

  // Total fleet hours
  const totalHours = machines.reduce(
    (sum, m) => sum + (Number(m.hour_meter) || 0), 0
  );

  // Cost per operating hour
  const costPerHour = totalHours > 0 ? (totalMaintenanceCost / totalHours) : null;

  // Average days between services
  let avgDaysBetweenServices = null;
  if (serviceHistory.length >= 2) {
    const sorted = [...serviceHistory].sort(
      (a, b) => new Date(a.service_date) - new Date(b.service_date)
    );
    let totalDays = 0;
    let intervals = 0;
    for (let i = 1; i < sorted.length; i++) {
      const diff = (new Date(sorted[i].service_date) - new Date(sorted[i - 1].service_date)) / 86400000;
      if (diff > 0) { totalDays += diff; intervals++; }
    }
    if (intervals > 0) avgDaysBetweenServices = Math.round(totalDays / intervals);
  }

  // Utilisation
  const activeMachines = machines.filter((m) => m.status === "Active").length;
  const utilisation = machines.length > 0 ? Math.round((activeMachines / machines.length) * 100) : 0;
  const downtime = 100 - utilisation;

  // Generate recommendations
  const insights = generateRecommendations({ machines, serviceHistory, maintenancePlans, weather, costPerHour, totalMaintenanceCost, averageServiceCost });

  return {
    available: true,
    costPerHour,
    averageServiceCost,
    totalMaintenanceCost,
    avgDaysBetweenServices,
    utilisation,
    downtime,
    insights,
  };
}

function generateRecommendations({ machines, serviceHistory, maintenancePlans, weather, costPerHour, totalMaintenanceCost, averageServiceCost }) {
  const recommendations = [];
  const today = new Date();

  // ─── OVERDUE SERVICE (Critical) ───
  for (const plan of maintenancePlans) {
    const machine = machines.find((m) => m.id === plan.machine_id);
    if (!machine) continue;

    const currentHours = Number(machine.hour_meter || 0);
    const nextDue = Number(plan.next_due_hours || 0);

    if (nextDue > 0 && currentHours >= nextDue) {
      const machineName = machine.name || machine.make || "Machine";
      const overdueBy = currentHours - nextDue;
      recommendations.push({
        id: `overdue-${machine.id}`,
        severity: "high",
        message: `${machineName} is ${overdueBy} hours overdue for its scheduled service.`,
        reason: `Continuing to operate overdue machinery increases the risk of expensive breakdowns and unplanned downtime. Schedule a service immediately to protect your investment.`,
        action: "Schedule Service",
        machineId: machine.id,
        route: `/machinery/${machine.id}`,
        taskData: { title: `Urgent service: ${machineName} (${overdueBy}hrs overdue)`, category: "Machinery", priority: "High" },
      });
    }
  }

  // ─── SERVICE DUE SOON (High) ───
  for (const plan of maintenancePlans) {
    const machine = machines.find((m) => m.id === plan.machine_id);
    if (!machine) continue;

    const currentHours = Number(machine.hour_meter || 0);
    const nextDue = Number(plan.next_due_hours || 0);
    const hoursRemaining = nextDue - currentHours;

    if (nextDue > 0 && hoursRemaining > 0 && hoursRemaining <= 20) {
      // Don't duplicate if already overdue
      if (!recommendations.some((r) => r.id === `overdue-${machine.id}`)) {
        const machineName = machine.name || machine.make || "Machine";
        recommendations.push({
          id: `due-soon-${machine.id}`,
          severity: "medium",
          message: `${machineName} is approaching its next service interval — only ${hoursRemaining} operating hours remaining.`,
          reason: `Booking the service now ensures parts are available and prevents disruption during busy periods. Early scheduling keeps your fleet reliable.`,
          action: "Schedule Service",
          machineId: machine.id,
          route: `/machinery/${machine.id}`,
          taskData: { title: `Plan service: ${machineName} (${hoursRemaining}hrs remaining)`, category: "Machinery", priority: "Medium" },
        });
      }
    }
  }

  // ─── HIGH RUNNING COSTS (Medium) ───
  if (machines.length > 1 && serviceHistory.length > 0) {
    const avgCostPerMachine = totalMaintenanceCost / machines.length;

    for (const machine of machines) {
      const machineCost = serviceHistory
        .filter((s) => s.machine_id === machine.id)
        .reduce((sum, s) => sum + (Number(s.cost) || 0), 0);

      if (machineCost > avgCostPerMachine * 1.5 && machineCost > 0) {
        const machineName = machine.name || machine.make || "Machine";
        const percentage = Math.round(((machineCost - avgCostPerMachine) / avgCostPerMachine) * 100);
        recommendations.push({
          id: `high-cost-${machine.id}`,
          severity: "medium",
          message: `${machineName}'s running costs are ${percentage}% above the fleet average.`,
          reason: `Elevated maintenance spending suggests increased mechanical wear. Inspect the machine before the next operating cycle to identify recurring issues and prevent costly failures.`,
          action: "Review Costs",
          machineId: machine.id,
          route: `/machinery/${machine.id}`,
          taskData: { title: `Inspect high-cost machine: ${machineName}`, category: "Machinery", priority: "Medium" },
        });
        break; // Only report worst offender
      }
    }
  }

  // ─── LOW UTILISATION (Low) ───
  const inactiveMachines = machines.filter((m) => m.status !== "Active" && m.status !== "In Service");
  if (inactiveMachines.length > 0 && machines.length > 1) {
    const example = inactiveMachines[0];
    const exampleName = example.name || example.make || "Machine";
    recommendations.push({
      id: `idle-${example.id}`,
      severity: "low",
      message: `${inactiveMachines.length} machine${inactiveMachines.length > 1 ? "s are" : " is"} currently idle${inactiveMachines.length === 1 ? ` (${exampleName})` : ""}.`,
      reason: `Machines left idle for extended periods may develop seal, battery or fuel system issues. A brief inspection before the next operating season helps identify problems early.`,
      action: "Inspect Machine",
      machineId: example.id,
      route: `/machinery/${example.id}`,
      taskData: { title: `Pre-season inspection: idle machinery`, category: "Machinery", priority: "Low" },
    });
  }

  // ─── HEAVY UTILISATION (Medium) ───
  if (machines.length > 2) {
    const avgHours = totalHoursCalc(machines) / machines.length;
    const heavilyUsed = machines.find((m) => (Number(m.hour_meter) || 0) > avgHours * 1.5);
    if (heavilyUsed && !recommendations.some((r) => r.machineId === heavilyUsed.id)) {
      const machineName = heavilyUsed.name || heavilyUsed.make || "Machine";
      recommendations.push({
        id: `heavy-use-${heavilyUsed.id}`,
        severity: "medium",
        message: `${machineName} is being used significantly more than the rest of the fleet.`,
        reason: `Heavy utilisation accelerates component wear. Planning a preventative inspection now avoids unexpected breakdowns during peak demand.`,
        action: "Schedule Inspection",
        machineId: heavilyUsed.id,
        route: `/machinery/${heavilyUsed.id}`,
        taskData: { title: `Preventative inspection: ${machineName}`, category: "Machinery", priority: "Medium" },
      });
    }
  }

  // ─── WEATHER-AWARE SERVICE (Low) ───
  if (weather && weather.available) {
    const forecast = weather.forecast || [];
    const rainExpected = forecast.some((d) => d.condition === "Rain" || (d.rainfall && d.rainfall > 5));
    if (rainExpected && inactiveMachines.length > 0) {
      recommendations.push({
        id: "weather-service",
        severity: "low",
        message: "Rain is forecast — a good opportunity to service idle machinery.",
        reason: "Scheduling maintenance on wet days when fieldwork is not possible reduces operational downtime and keeps your fleet ready for the next clear window.",
        action: "Schedule Service",
        machineId: null,
        route: null,
        taskData: { title: "Wet-day maintenance: service idle machinery", category: "Machinery", priority: "Low" },
      });
    }
  }

  // ─── MAINTENANCE COST TREND (Medium) ───
  if (serviceHistory.length > 3) {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const thisMonthCost = serviceHistory
      .filter((s) => { const d = new Date(s.service_date); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; })
      .reduce((sum, s) => sum + (Number(s.cost) || 0), 0);

    const lastMonthCost = serviceHistory
      .filter((s) => { const d = new Date(s.service_date); return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear; })
      .reduce((sum, s) => sum + (Number(s.cost) || 0), 0);

    if (thisMonthCost > lastMonthCost * 1.3 && lastMonthCost > 0) {
      recommendations.push({
        id: "cost-trend",
        severity: "medium",
        message: "Fleet maintenance spending has increased compared to last month.",
        reason: "A rising cost trend may indicate recurring repairs on ageing equipment. Review service history to identify machines requiring major overhaul or replacement planning.",
        action: "View Running Costs",
        machineId: null,
        route: null,
        taskData: { title: "Investigate increased maintenance spending", category: "Machinery", priority: "Medium" },
      });
    }
  }

  // Sort by severity and limit to 3
  const order = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => (order[a.severity] ?? 3) - (order[b.severity] ?? 3));

  return recommendations.slice(0, 3);
}

function totalHoursCalc(machines) {
  return machines.reduce((sum, m) => sum + (Number(m.hour_meter) || 0), 0);
}
