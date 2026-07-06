export function getPregnancyInsight(pregnancy) {
  if (!pregnancy) return null;

  const {
    pregnantDays,
    daysRemaining,
    overdue,
  } = pregnancy;

  if (overdue) {
    return {
      title: "Birth Overdue",
      color: "#DC2626",
      background: "#FEE2E2",
      icon: "🚨",
      stage: "Overdue",
      advice:
        "Birth is overdue. Monitor the animal closely and consider veterinary assistance.",
    };
  }

  if (daysRemaining <= 30) {
    return {
      title: "Due Soon",
      color: "#D97706",
      background: "#FEF3C7",
      icon: "🍼",
      stage: "Final Month",
      advice:
        "Prepare the maternity area and monitor the animal daily.",
    };
  }

  if (pregnantDays <= 30) {
    return {
      title: "Healthy Pregnancy",
      color: "#16A34A",
      background: "#DCFCE7",
      icon: "🌱",
      stage: "Early Pregnancy",
      advice:
        "Maintain good nutrition and minimize stress during early pregnancy.",
    };
  }

  if (pregnantDays <= 90) {
    return {
      title: "Healthy Pregnancy",
      color: "#16A34A",
      background: "#DCFCE7",
      icon: "🌿",
      stage: "Developing",
      advice:
        "Continue routine health checks and maintain a balanced feeding program.",
    };
  }

  if (pregnantDays <= 180) {
    return {
      title: "Healthy Pregnancy",
      color: "#16A34A",
      background: "#DCFCE7",
      icon: "🐄",
      stage: "Mid Pregnancy",
      advice:
        "Monitor body condition and keep vaccinations and parasite control up to date.",
    };
  }

  return {
    title: "Healthy Pregnancy",
    color: "#16A34A",
    background: "#DCFCE7",
    icon: "🐄",
    stage: "Late Pregnancy",
    advice:
      "Increase monitoring and prepare for the expected birth.",
  };
}

