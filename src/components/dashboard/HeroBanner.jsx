import QuickActions from "./QuickActions";

export default function HeroBanner({
  totalAnimals = 0,
  totalCrops = 0,
  pregnantBreeding = 0,
  healthDue = 0,
  weather = null,
  machineryCount = 0,
  plannerOverdue = 0,
  plannerToday = 0,
  farmHealthScore = 0,
  farmHealthStatus = "",
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
        background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)",
        color: "#fff",
        borderRadius: 20,
        padding: "28px 32px",
        boxShadow: "0 8px 32px rgba(27,94,32,.2)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle overlay pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,.06) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Top: Greeting + Date */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
          position: "relative",
        }}
      >
        <div>
          <div style={{ fontSize: 14, opacity: 0.85, letterSpacing: "0.02em" }}>
            {greeting} 👋
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px" }}>
            🚜 FarmHand PRO
          </h1>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            {today}
          </div>
          <div style={{ marginTop: 4, fontSize: 16, fontWeight: 700 }}>
            {currentTime}
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: 10,
          marginBottom: 20,
          position: "relative",
        }}
      >
        <KPICard
          emoji="🐄"
          label="Livestock"
          value={totalAnimals}
          sub={healthDue > 0 ? `${healthDue} health due` : `${pregnantBreeding} pregnant`}
        />
        <KPICard
          emoji="🌾"
          label="Crops"
          value={totalCrops}
          sub="Active"
        />
        <KPICard
          emoji="🚜"
          label="Machinery"
          value={machineryCount > 0 ? `${machineryCount}` : "✓"}
          sub={machineryCount > 0 ? "Service due" : "On schedule"}
        />
        <KPICard
          emoji="📋"
          label="Planner"
          value={plannerOverdue + plannerToday}
          sub={plannerOverdue > 0 ? `${plannerOverdue} overdue` : "Today"}
        />
        <KPICard
          emoji="❤️"
          label="Health"
          value={farmHealthScore}
          sub={farmHealthStatus || "/100"}
        />
      </div>

      {/* Bottom: Weather + Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          position: "relative",
        }}
      >
        {/* Weather */}
        <div
          style={{
            background: "rgba(255,255,255,.1)",
            backdropFilter: "blur(4px)",
            borderRadius: 14,
            padding: "14px 16px",
            border: "1px solid rgba(255,255,255,.12)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
            {weather?.available ? (weather.current?.icon || "☀️") : "☀️"} Weather
          </div>

          {weather?.available ? (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>
                {weather.current?.temperature}°C — {weather.current?.condition}
              </div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>
                Wind: {weather.current?.windSpeed} km/h · Humidity: {weather.current?.humidity}%
              </div>
              {weather.forecast?.length > 0 && (
                <div style={{ marginTop: 6, fontSize: 11, opacity: 0.75 }}>
                  Tomorrow: {weather.forecast[0]?.icon} {weather.forecast[0]?.temperature}°C — {weather.forecast[0]?.condition}
                </div>
              )}
            </div>
          ) : (
            <div style={{ opacity: 0.7, fontSize: 12 }}>
              Weather unavailable. Configure API key.
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: "rgba(255,255,255,.1)",
            backdropFilter: "blur(4px)",
            borderRadius: 14,
            padding: "14px 16px",
            border: "1px solid rgba(255,255,255,.12)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
            ⚡ Quick Actions
          </div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}

function KPICard({ emoji, label, value, sub }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.12)",
        borderRadius: 12,
        padding: "12px 10px",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,.08)",
        transition: "background .2s ease",
      }}
    >
      <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 3, fontWeight: 500 }}>
        {emoji} {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 10, opacity: 0.7, marginTop: 3 }}>
          {sub}
        </div>
      )}
    </div>
  );
}
