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

  const nextBirths =
    upcoming.length > 0
      ? upcoming
      : pregnancies.slice(0, 3);

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
        🍼 Upcoming Births ({pregnancies.length})
      </h2>

      {nextBirths.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 30,
            color: "#64748B",
          }}
        >
          No pregnancy records found.
        </div>
      ) : (
        <>
          {nextBirths.map((record, index) => (
            <div
              key={record.id}
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 16,
                padding: 18,
                marginBottom:
                  index === nextBirths.length - 1
                    ? 0
                    : 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#0F172A",
                      marginBottom: 10,
                    }}
                  >
                    🐄 {record.female?.tag}
                  </div>

                  <div style={row}>
                    <strong>Male</strong>
                    <span>
                      🐂 {record.male?.tag}
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
                      {record.expected_birth}
                    </span>
                  </div>

                  <div style={row}>
                    <strong>Remaining</strong>
                    <span
                      style={{
                        color:
                          record.daysLeft <= 30
                            ? "#DC2626"
                            : "#16A34A",
                        fontWeight: 700,
                      }}
                    >
                      ⏳ {record.daysLeft} days
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background: "#DCFCE7",
                    color: "#166534",
                    padding: "10px 16px",
                    borderRadius: 999,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  🟢 Healthy Pregnancy
                </div>
              </div>
            </div>
          ))}

          {pregnancies.length > 3 && (
            <div
              style={{
                marginTop: 18,
                textAlign: "center",
                color: "#64748B",
                fontWeight: 600,
              }}
            >
              +{pregnancies.length - 3} more upcoming
              birth
              {pregnancies.length - 3 > 1
                ? "s"
                : ""}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const row = {
  display: "flex",
  gap: 12,
  marginBottom: 6,
  fontSize: 15,
};
