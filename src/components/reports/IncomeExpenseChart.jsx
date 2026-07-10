import {
  Bar
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function IncomeExpenseChart({
  income = 0,
  expenses = 0,
}) {
  const data = {
    labels: [
      "Income",
      "Expenses",
    ],
    datasets: [
      {
        label: "Amount (R)",
        data: [
          income,
          expenses,
        ],
        backgroundColor: [
          "#16A34A",
          "#DC2626",
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
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
        📈 Income vs Expenses
      </h2>

      <div
        style={{
          height: 350,
        }}
      >
        <Bar
          data={data}
          options={options}
        />
      </div>
    </div>
  );
}
