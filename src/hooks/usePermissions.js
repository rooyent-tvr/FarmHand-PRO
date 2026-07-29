import { useEffect, useState } from "react";

import {
  getPermissionState,
  getPermissionSummary,
} from "../services/permissions/permissionService";

export default function usePermissions() {
  const [loading, setLoading] = useState(true);

  const [permissions, setPermissions] = useState({
    subscription: null,

    isPro: false,
    isStarter: true,
    isActive: false,

    dashboard: false,
    livestock: false,
    crops: false,
    machinery: false,
    planner: false,
    finance: false,
    reports: false,
    weather: false,

    ai: false,
    farmIntelligence: false,
    predictiveAnalytics: false,
    automation: false,
    weeklySummary: false,
    prioritySupport: false,
  });

  async function loadPermissions() {
    try {
      setLoading(true);

      const state = await getPermissionState();
      const summary = await getPermissionSummary();

      setPermissions({
        ...state,
        ...summary,
      });
    } catch (error) {
      console.error("Permission loading failed", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPermissions();
  }, []);

  return {
    loading,

    ...permissions,

    refreshPermissions: loadPermissions,
  };
}
