import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function StatusChart({ animals = [] }) {
  const healthy = animals.filter(
    (a) => a.status === "Healthy"
  ).length;

  const pregnant = animals.filter(
    (a) => a.status === "Pregnant"
  ).length;

  const sick = animals.filter(
    (a) => a.status === "Sick"
  ).length;

  const sold = animals.filter(
    (a) => a.status === "Sold"
  ).length;

  const total = animals.length;

  const data = [
    { name: "Healthy", value: healthy },
    { name: "Pregnant", value: pregnant },
    { name: "Sick", value: sick },
    { name: "Sold", value: sold },
  ];

  const COLORS = [
    "#43A047",
    "#FB8C00",
    "#E53935",
    "#757575",
  ];

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 10px 30px rgba(15,23,42,.08)",
        height: "100%",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E5E7EB",
          paddingBottom: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            🐄 Livestock Status
          </h2>

          <p
            style={{
              marginTop: 6,
              color: "#64748B",
              fontSize: 14,
            }}
          >
            Distribution of livestock by current health status.
          </p>
        </div>

        <div
          style={{
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#64748B",
            }}
          >
            Total Animals
          </div>

          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#16A34A",
            }}
          >
            {total}
          </div>
        </div>
      </div>

      {/* Chart */}

      <div
        style={{
          width: "100%",
          height: 360,
        }}
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={135}
              paddingAngle={4}
              label={({ name, value }) =>
                value > 0 ? `${name}: ${value}` : ""
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                paddingTop: 20,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
