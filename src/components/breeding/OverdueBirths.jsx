export default function OverdueBirths({
  records = [],
}) {
  const today = new Date();

  const overdue = records
    .filter(
      (record) =>
        record.expected_birth &&
        record.status === "Pregnant"
    )
    .map((record) => {
      const expected = new Date(
        record.expected_birth
      );

      const overdueDays = Math.ceil(
        (today - expected) /
          (1000 * 60 * 60 * 24)
      );

      return {
        ...record,
        overdueDays,
      };
    })
    .filter((record) => record.overdueDays > 0)
    .sort(
      (a, b) =>
        b.overdueDays - a.overdueDays
    );

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 18,
        padding: 24,
        marginBottom: 24,
        boxShadow:
          "0 8px 20px rgba(15,23,42,.08)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 20,
          color: "#DC2626",
        }}
      >
        🚨 Overdue Births
      </h2>

      {overdue.length === 0 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#166534",
              }}
            >
              ✅ No Overdue Births
            </div>

            <div
              style={{
                marginTop: 6,
                color: "#166534",
              }}
            >
              All pregnancies are progressing within their expected gestation period.
            </div>
          </div>

          <div
            style={{
              fontSize: 48,
            }}
          >
            🍼
          </div>
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#DC2626",
                color: "#FFFFFF",
              }}
            >
              <th style={th}>Female</th>
              <th style={th}>Male</th>
              <th style={th}>Expected Birth</th>
              <th style={th}>Overdue</th>
            </tr>
          </thead>

          <tbody>
            {overdue.map((record) => (
              <tr key={record.id}>
                <td style={td}>
                  🐄 {record.female?.tag}
                </td>

                <td style={td}>
                  🐂 {record.male?.tag}
                </td>

                <td style={td}>
                  {record.expected_birth}
                </td>

                <td
                  style={{
                    ...td,
                    color: "#DC2626",
                    fontWeight: 700,
                  }}
                >
                  {record.overdueDays} days
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  padding: 14,
  textAlign: "left",
};

const td = {
  padding: 14,
  borderBottom: "1px solid #E5E7EB",
};
