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

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        color: "#fff",
        boxShadow: "0 6px 28px rgba(0,0,0,.12)",
      }}
    >
      {/* Background — farm landscape image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          zIndex: 0,
        }}
      />
      {/* 70% dark green overlay — branded feel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(15,45,10,.78) 0%, rgba(25,60,18,.72) 50%, rgba(20,55,15,.68) 100%)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, padding: "22px 26px 18px" }}>

        {/* Top: Branding + Weather */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>
              🚜 FarmHand PRO — Smart Farm Operations
            </div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {greeting} 👋
            </div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 3 }}>
              Your farm is looking great today.
            </div>
          </div>

          {/* Weather compact — top right */}
          {weather?.available ? (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1 }}>
                {weather.current?.temperature}°
              </div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 3 }}>
                {weather.current?.condition}
              </div>
              <div style={{ fontSize: 10, opacity: 0.65, marginTop: 1 }}>
                Wind {weather.current?.windSpeed} km/h
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 11, opacity: 0.5, textAlign: "right" }}>
              Weather<br />unavailable
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          <KPICard icon="🐄" label="Livestock" value={totalAnimals} sub="Total Animals" />
          <KPICard icon="🌾" label="Crops" value={totalCrops} sub="Active Fields" />
          <KPICard icon="🚜" label="Machinery" value={machineryCount > 0 ? machineryCount : "✓"} sub={machineryCount > 0 ? "Service Due" : "Active Machines"} />
          <KPICard icon="📋" label="Planner" value={plannerOverdue + plannerToday} sub="Items Today" />
          <KPICard icon="💰" label="Finance" value={`R ${farmHealthScore.toLocaleString()}`} sub={farmHealthStatus || "Health Score"} accent />
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, label, value, sub, accent }) {
  return (
    <div
      style={{
        background: accent ? "rgba(255,255,255,.24)" : "rgba(255,255,255,.16)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        border: "1px solid rgba(255,255,255,.2)",
        boxShadow: "0 2px 12px rgba(0,0,0,.08)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div style={{ fontSize: 26 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
          {label}
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.1, marginTop: 2 }}>
          {value}
        </div>
        <div style={{ fontSize: 9, opacity: 0.6, marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
}
