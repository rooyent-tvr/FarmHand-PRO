import UpgradeRequired from "./UpgradeRequired";
import usePermissions from "../../hooks/usePermissions";

/*
|--------------------------------------------------------------------------
| ProFeature
|--------------------------------------------------------------------------
|
| Wrap any premium component with this.
|
| Example:
|
| <ProFeature feature="ai">
|     <FarmIntelligenceCenter />
| </ProFeature>
|
*/

const FEATURE_MAP = {
  ai: "ai",
  farm_intelligence: "farmIntelligence",
  predictive_analytics: "predictiveAnalytics",
  automation: "automation",
  advanced_reports: "reports",
  weather: "weather",
  dashboard: "dashboard",
  livestock: "livestock",
  crops: "crops",
  machinery: "machinery",
  planner: "planner",
  finance: "finance",
  weekly_summary: "weeklySummary",
  priority_support: "prioritySupport",
};

export default function ProFeature({
  feature,
  children,
  fallback = null,
}) {
  const permissions = usePermissions();

  if (permissions.loading) {
    return null;
  }

  const permissionKey = FEATURE_MAP[feature];

  const allowed = permissionKey
    ? permissions[permissionKey]
    : false;

  if (allowed) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  return <UpgradeRequired feature={feature} />;
}
