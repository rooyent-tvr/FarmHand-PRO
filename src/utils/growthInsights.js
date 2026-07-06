export function getGrowthInsights(analytics) {
  if (!analytics) return [];

  const insights = [];

  // Average Daily Gain
  if (analytics.averageDailyGain >= 0.8) {
    insights.push({
      type: "success",
      title: "Excellent Growth",
      message:
        "Average daily gain is above the expected target.",
    });
  } else if (analytics.averageDailyGain >= 0.3) {
    insights.push({
      type: "info",
      title: "Healthy Growth",
      message:
        "Weight gain is progressing normally.",
    });
  } else {
    insights.push({
      type: "warning",
      title: "Slow Growth",
      message:
        "Average daily gain is below the expected target.",
    });
  }

  // Weight gain
  if (analytics.totalGain <= 0) {
    insights.push({
      type: "danger",
      title: "No Weight Gain",
      message:
        "No overall weight gain has been recorded.",
    });
  }

  // Last weighing
  if (analytics.daysSinceLastWeight > 30) {
    insights.push({
      type: "warning",
      title: "Weighing Reminder",
      message:
        "This animal has not been weighed for more than 30 days.",
    });
  }

  // Too few records
  if (analytics.records < 3) {
    insights.push({
      type: "info",
      title: "More Data Needed",
      message:
        "Record more weights to improve growth analysis.",
    });
  }

  return insights;
}
