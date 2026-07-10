import {
  Doughnut,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function LivestockChart({
  animals = [],
}) {
  const speciesTotals = {};

  animals.forEach((animal) => {
    const species =
      animal.species ||
      animal.animal_type ||
      animal.type ||
      animal.category ||
      "Unknown";

    speciesTotals[species] =
      (speciesTotals[species] || 0) + 1;
  });

  const labels = Object.keys(speciesTotals);

  const values = Object.values(speciesTotals);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#16A34A",
          "#2563EB",
          "#F59E0B",
          "#DC2626",
          "#8B5CF6",
          "#14B8A6",
          "#EC4899",
          "#F97316",
        ],
        borderColor: "#FFFFFF",
        borderWidth: 3,
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
          },
        },
      },

      tooltip: {
        callbacks: {
          label(context) {
            return `${context.label}: ${context.raw} animal(s)`;
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        marginTop: 30,
        boxShadow:
          "0 8px 20px rgba(15,23,42,.08)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 20,
        }}
      >
        🐄 Livestock by Species
      </h2>

      {labels.length === 0 ? (
        <div
          style={{
            height: 350,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#64748B",
            fontSize: 18,
          }}
        >
          No livestock data available.
        </div>
      ) : (
        <div
          style={{
            height: 350,
          }}
        >
          <Doughnut
            data={data}
            options={options}
          />
        </div>
      )}
    </div>
  );
}
