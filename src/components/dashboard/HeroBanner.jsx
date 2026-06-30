import QuickActions from "./QuickActions";

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
        background: "linear-gradient(135deg,#2E7D32,#43A047)",
        color: "#fff",
        borderRadius: 24,
        padding: 32,
        marginBottom: 32,
        boxShadow: "0 15px 35px rgba(15,23,42,.18)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* LEFT */}

        <div>
          <div
            style={{
              fontSize: 15,
              opacity: 0.9,
            }}
          >
            {greeting} 👋
          </div>

          <h1
            style={{
              margin: "10px 0",
              fontSize: 42,
              fontWeight: 800,
            }}
          >
            🚜 FarmHand PRO
          </h1>

          <p
            style={{
              fontSize: 17,
              opacity: 0.95,
              maxWidth: 650,
              marginBottom: 28,
            }}
          >
            Welcome back. Here's a live overview of your farm operations.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,minmax(120px,1fr))",
              gap: 14,
            }}
          >
            <Metric emoji="🐄" label="Animals" value={totalAnimals} />
            <Metric emoji="🌾" label="Crops" value={totalCrops} />
            <Metric
              emoji="🍼"
              label="Pregnancies"
              value={pregnantBreeding}
            />
            <Metric emoji="❤️" label="Health Due" value={healthDue} />
          </div>
        </div>

        {/* RIGHT */}

        <div>
          <div
            style={{
              textAlign: "right",
              marginBottom: 18,
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
                marginTop: 8,
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              🕘 {currentTime}
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,.12)",
              borderRadius: 18,
              padding: 18,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              🌱 Farm Status
            </div>

            <div
              style={{
                fontSize: 15,
                opacity: 0.95,
              }}
            >
              Active & operating normally
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,.12)",
              borderRadius: 18,
              padding: 18,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              ☀ Weather
            </div>

            <div
              style={{
                opacity: 0.9,
              }}
            >
              Weather integration coming soon.
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,.12)",
              borderRadius: 18,
              padding: 18,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              ⚡ Quick Actions
            </div>

            <QuickActions />

            <div
              style={{
                marginTop: 16,
                fontSize: 13,
                opacity: 0.85,
                textAlign: "center",
              }}
            >
              Last Updated • {currentTime}
            </div>
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
        borderRadius: 14,
        padding: 16,
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
          marginTop: 8,
          fontSize: 30,
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}
