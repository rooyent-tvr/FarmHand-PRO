export default function StatCard({ title, value, icon }) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        minHeight: "170px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h3
          style={{
            margin: 0,
            color: "#555",
            fontSize: "18px",
          }}
        >
          {title}
        </h3>

        <h1
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            fontSize: "42px",
          }}
        >
          {value}
        </h1>
      </div>

      <div
        style={{
          fontSize: "42px",
          textAlign: "right",
        }}
      >
        {icon}
      </div>
    </div>
  );
}
