import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function StatusChart({ animals }) {
  const healthy = animals.filter((a) => a.status === "Healthy").length;
  const pregnant = animals.filter((a) => a.status === "Pregnant").length;
  const sick = animals.filter((a) => a.status === "Sick").length;
  const sold = animals.filter((a) => a.status === "Sold").length;

  const data = [
    { name: "Healthy", value: healthy },
    { name: "Pregnant", value: pregnant },
    { name: "Sick", value: sick },
    { name: "Sold", value: sold },
  ];

  const COLORS = [
    "#4CAF50",
    "#FFC107",
    "#F44336",
    "#9E9E9E",
  ];

  return (
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 4px 15px rgba(0,0,0,.08)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Livestock Status</h3>

      <div
        style={{
          width: "100%",
          height: 350,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
