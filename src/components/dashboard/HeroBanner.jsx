export default function HeroBanner({
  totalAnimals = 0,
  totalCrops = 0,
  pregnantBreeding = 0,
  healthDue = 0,
}) {
  const now = new Date();

  const hour = now.getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  const today = now.toLocaleDateString("en-ZA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = now.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#2E7D32,#43A047)",
        color: "#FFFFFF",
        borderRadius: 24,
        padding: 32,
        marginBottom: 32,
        boxShadow: "0 15px 35px rgba(15,23,42,.18)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 30,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 16,
              opacity: 0.95,
              marginBottom: 8,
            }}
          >
            {greeting} 👋
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            🚜 FarmHand PRO
          </h1>

          <p
            style={{
              marginTop: 12,
              fontSize: 17,
              opacity: 0.95,
              maxWidth: 650,
            }}
          >
            Welcome back. Here's a live overview of your farm operations.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              marginTop: 28,
            }}
          >
            <Metric emoji="🐄" label="Animals" value={totalAnimals} />
            <Metric emoji="🌱" label="Crops" value={totalCrops} />
            <Metric emoji="🍼" label="Pregnancies" value={pregnantBreeding} />
            <Metric emoji="❤️" label="Health Due" value={healthDue} />
          </div>
        </div>

        <div
          style={{
            minWidth: 240,
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontSize: 14,
              opacity: 0.9,
            }}
          >
            📅 {today}
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            🕘 {currentTime}
          </div>

          <div
            style={{
              marginTop: 22,
              display: "inline-block",
              background: "rgba(255,255,255,.18)",
              padding: "10px 18px",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            🌱 Farm Status: Active
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ emoji, label, value }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.15)",
        borderRadius: 16,
        padding: "14px 18px",
        minWidth: 140,
      }}
    >
      <div
        style={{
          fontSize: 13,
          opacity: 0.9,
        }}
      >
        {emoji} {label}
      </div>

      <div
        style={{
          marginTop: 6,
          fontSize: 30,
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}
