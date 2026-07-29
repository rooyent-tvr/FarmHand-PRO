import {
  hasFeature,
  isPro,
  isStarter,
  isActive,
  getSubscription,
} from "../subscriptionService";

/*
|--------------------------------------------------------------------------
| Core Permission Helpers
|--------------------------------------------------------------------------
*/

export async function getPermissionState() {
  const subscription = await getSubscription();

  return {
    subscription,
    isPro: await isPro(),
    isStarter: await isStarter(),
    isActive: await isActive(),
  };
}

/*
|--------------------------------------------------------------------------
| Generic Permission Check
|--------------------------------------------------------------------------
*/

export async function canUse(feature) {
  return await hasFeature(feature);
}

/*
|--------------------------------------------------------------------------
| AI Permissions
|--------------------------------------------------------------------------
*/

export async function canUseAI() {
  return await hasFeature("ai");
}

export async function canUseFarmIntelligence() {
  return await hasFeature("farm_intelligence");
}

export async function canUsePredictiveAnalytics() {
  return await hasFeature("predictive_analytics");
}

/*
|--------------------------------------------------------------------------
| Automation Permissions
|--------------------------------------------------------------------------
*/

export async function canUseAutomation() {
  return await hasFeature("automation");
}

/*
|--------------------------------------------------------------------------
| Reports Permissions
|--------------------------------------------------------------------------
*/

export async function canUseAdvancedReports() {
  return await hasFeature("advanced_reports");
}

/*
|--------------------------------------------------------------------------
| Dashboard Permissions
|--------------------------------------------------------------------------
*/

export async function canUseWeather() {
  return await hasFeature("weather");
}

export async function canUseDashboard() {
  return await hasFeature("dashboard");
}

/*
|--------------------------------------------------------------------------
| Planner Permissions
|--------------------------------------------------------------------------
*/

export async function canUsePlanner() {
  return await hasFeature("planner");
}

/*
|--------------------------------------------------------------------------
| Livestock Permissions
|--------------------------------------------------------------------------
*/

export async function canUseLivestock() {
  return await hasFeature("livestock");
}

/*
|--------------------------------------------------------------------------
| Crops Permissions
|--------------------------------------------------------------------------
*/

export async function canUseCrops() {
  return await hasFeature("crops");
}

/*
|--------------------------------------------------------------------------
| Machinery Permissions
|--------------------------------------------------------------------------
*/

export async function canUseMachinery() {
  return await hasFeature("machinery");
}

/*
|--------------------------------------------------------------------------
| Finance Permissions
|--------------------------------------------------------------------------
*/

export async function canUseFinance() {
  return await hasFeature("finance");
}

/*
|--------------------------------------------------------------------------
| Premium Services
|--------------------------------------------------------------------------
*/

export async function canUseWeeklySummary() {
  return await hasFeature("weekly_summary");
}

export async function canUsePrioritySupport() {
  return await hasFeature("priority_support");
}

/*
|--------------------------------------------------------------------------
| Permission Groups
|--------------------------------------------------------------------------
*/

export async function getPermissionSummary() {
  return {
    dashboard: await canUseDashboard(),
    livestock: await canUseLivestock(),
    crops: await canUseCrops(),
    machinery: await canUseMachinery(),
    planner: await canUsePlanner(),
    finance: await canUseFinance(),
    reports: await canUseAdvancedReports(),
    weather: await canUseWeather(),

    ai: await canUseAI(),
    farmIntelligence: await canUseFarmIntelligence(),
    predictiveAnalytics: await canUsePredictiveAnalytics(),
    automation: await canUseAutomation(),
    weeklySummary: await canUseWeeklySummary(),
    prioritySupport: await canUsePrioritySupport(),
  };
}