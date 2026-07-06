export default function UpcomingBirths({
  records = [],
}) {
  const today = new Date();

  const pregnancies = records
    .filter(
      (r) =>
        r.expected_birth &&
        r.status === "Pregnant"
    )
    .map((record) => {
      const expected = new Date(record.expected_birth);

      const daysLeft = Math.ceil(
        (expected - today) /
          (1000 * 60 * 60 * 24)
      );

      return {
        ...record,
        daysLeft,
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const upcoming = pregnancies.filter(
    (p) => p.daysLeft >= 0 && p.daysLeft <= 30
  );

  const nextBirth =
    pregnancies.length > 0 ? pregnancies[0] : null;

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 18,
        padding: 24,
        marginBottom: 24,
        boxShadow: "0 8px 20px rgba(15,23,42,.08)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 20,
          color: "#0F172A",
        }}
      >
        🍼 Upcoming Births
      </h2>

      {upcoming.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#F59E0B",
                color: "#FFFFFF",
              }}
            >
              <th style={th}>Female</th>
              <th style={th}>Male</th>
              <th style={th}>Expected Birth</th>
              <th style={th}>Days Left</th>
            </tr>
          </thead>

          <tbody>
            {upcoming.map((record) => (
              <tr key={record.id}>
                <td style={td}>
                  {record.female?.tag}
                </td>

                <td style={td}>
                  {record.male?.tag}
                </td>

                <td style={td}>
                  {record.expected_birth}
                </td>

                <td
                  style={{
                    ...td,
                    fontWeight: 700,
                    color:
                      record.daysLeft <= 7
                        ? "#DC2626"
                        : "#16A34A",
                  }}
                >
                  🟢 {record.daysLeft} days
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : nextBirth ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 30,
            padding: 20,
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#FEF3C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              🍼
            </div>

            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#0F172A",
                  marginBottom: 12,
                }}
              >
                Next Expected Birth
              </div>

              <div style={row}>
                <strong>Female</strong>

                <span>
                  🐄 {nextBirth.female?.tag}
                </span>
              </div>

              <div style={row}>
                <strong>Expected Birth</strong>

                <span
                  style={{
                    color: "#2563EB",
                    fontWeight: 700,
                  }}
                >
                  {nextBirth.expected_birth}
                </span>
              </div>

              <div style={row}>
                <strong>Remaining</strong>

                <span
                  style={{
                    color: "#16A34A",
                    fontWeight: 700,
                  }}
                >
                  ⏳ {nextBirth.daysLeft} days
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#DCFCE7",
              color: "#166534",
              padding: "10px 18px",
              borderRadius: 999,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            🟢 Pregnancy progressing normally
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: 30,
            color: "#64748B",
          }}
        >
          No pregnancy records found.
        </div>
      )}
    </div>
  );
}

const row = {
  display: "flex",
  gap: 16,
  marginBottom: 8,
  fontSize: 15,
};

const th = {
  padding: 14,
  textAlign: "left",
};

const td = {
  padding: 14,
  borderBottom: "1px solid #E5E7EB",
};
