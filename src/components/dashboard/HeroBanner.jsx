import {
  CheckCircle,
  Error as ErrorIcon,
  WarningAmber,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  ChevronRight,
  Lightbulb,
} from "@mui/icons-material";

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
  smartCards = [],
  onCardClick,
  dailyBriefing = null,
}) {
  // Use briefing data if available, fallback to static
  const greeting = dailyBriefing?.greeting || getStaticGreeting();
  const summary = dailyBriefing?.summary || "Your farm is looking great today.";
  const recommendation = dailyBriefing?.recommendation || null;
  const highlights = dailyBriefing?.highlights?.slice(0, 3) || [];
  const weatherText = dailyBriefing?.weatherSummary || null;
  const priority = dailyBriefing?.priority || "good";

  // Priority accent for left border
  const accentColor = priority === "critical" ? "rgba(244,67,54,.6)" : priority === "warning" ? "rgba(255,152,0,.5)" : "rgba(76,175,80,.4)";

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        color: "#fff",
        boxShadow: "0 6px 28px rgba(0,0,0,.12)",
        borderLeft: `4px solid ${accentColor}`,
      }}
    >
      {/* Background */}
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(15,45,10,.78) 0%, rgba(25,60,18,.72) 50%, rgba(20,55,15,.68) 100%)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, padding: "20px 26px 16px" }}>

        {/* Top: Greeting + Summary + Weather */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>
              🚜 FarmHand PRO
            </div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {greeting}
            </div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 3 }}>
              {summary}
            </div>

            {/* Recommendation callout */}
            {recommendation && (
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 6,
                  background: "rgba(255,255,255,.08)",
                  borderRadius: 8,
                  padding: "6px 10px",
                  maxWidth: 420,
                }}
              >
                <Lightbulb sx={{ fontSize: 14, color: "#ffd54f", mt: "1px" }} />
                <div style={{ fontSize: 11, opacity: 0.9, lineHeight: 1.4 }}>
                  {recommendation}
                </div>
              </div>
            )}

            {/* Highlights */}
            {highlights.length > 0 && (
              <div style={{ marginTop: 8, display: "flex", gap: 12, flexWrap: "wrap" }}>
                {highlights.map((h, i) => (
                  <div key={i} style={{ fontSize: 10, opacity: 0.75, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,.6)", display: "inline-block" }} />
                    {h}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weather — top right */}
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
            {weatherText ? (
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
                  {weather?.current?.temperature ?? ""}°
                </div>
                <div style={{ fontSize: 11, opacity: 0.85, marginTop: 3 }}>
                  {weatherText}
                </div>
              </div>
            ) : weather?.available ? (
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
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
              <div style={{ fontSize: 10, opacity: 0.5 }}>
                Weather<br />unavailable
              </div>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {smartCards.length > 0 ? (
            smartCards.map((card) => (
              <KPICard
                key={card.id}
                icon={getModuleIcon(card.module)}
                label={card.title}
                value={card.value}
                sub={card.subtitle}
                status={card.status}
                trend={card.trend}
                onClick={() => onCardClick?.(card.route)}
              />
            ))
          ) : (
            <>
              <KPICard icon="🐄" label="Livestock" value={totalAnimals} sub="Total Animals" status="good" />
              <KPICard icon="🌾" label="Crops" value={totalCrops} sub="Active Fields" status="good" />
              <KPICard icon="🚜" label="Machinery" value={machineryCount > 0 ? machineryCount : "✓"} sub={machineryCount > 0 ? "Service Due" : "Active"} status={machineryCount > 0 ? "warning" : "good"} />
              <KPICard icon="📋" label="Planner" value={plannerOverdue + plannerToday} sub="Items Today" status={plannerOverdue > 0 ? "critical" : "good"} />
              <KPICard icon="💰" label="Finance" value={`R ${farmHealthScore.toLocaleString()}`} sub={farmHealthStatus || "Score"} status="good" accent />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function getStaticGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning 👋";
  if (hour >= 12 && hour < 17) return "Good Afternoon ☀️";
  if (hour >= 17 && hour < 23) return "Good Evening 🌙";
  return "Welcome Back 🌾";
}

function getModuleIcon(module) {
  switch (module) {
    case "Livestock": return "🐄";
    case "Crops": return "🌾";
    case "Machinery": return "🚜";
    case "Planner": return "📋";
    case "Finance": return "💰";
    default: return "📊";
  }
}

function getStatusBorder(status) {
  switch (status) {
    case "critical": return "rgba(244,67,54,.5)";
    case "warning": return "rgba(255,152,0,.5)";
    default: return "rgba(255,255,255,.2)";
  }
}

function getStatusDotColor(status) {
  switch (status) {
    case "critical": return "#f44336";
    case "warning": return "#ff9800";
    default: return "#4caf50";
  }
}

function StatusIcon({ status }) {
  const style = { fontSize: 12, opacity: 0.9 };
  switch (status) {
    case "critical": return <ErrorIcon sx={{ ...style, color: "#f44336" }} />;
    case "warning": return <WarningAmber sx={{ ...style, color: "#ff9800" }} />;
    default: return <CheckCircle sx={{ ...style, color: "#4caf50" }} />;
  }
}

function TrendIcon({ trend }) {
  if (!trend) return null;
  const style = { fontSize: 11, opacity: 0.7 };
  switch (trend) {
    case "positive": return <TrendingUp sx={{ ...style, color: "#4caf50" }} />;
    case "negative": return <TrendingDown sx={{ ...style, color: "#f44336" }} />;
    default: return <TrendingFlat sx={{ ...style, color: "#fff" }} />;
  }
}

function KPICard({ icon, label, value, sub, accent, status, trend, onClick }) {
  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  }

  return (
    <div
      role="button"
      tabIndex={onClick ? 0 : -1}
      aria-label={`${label}: ${value}. ${sub}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      style={{
        position: "relative",
        background: accent ? "rgba(255,255,255,.24)" : "rgba(255,255,255,.16)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 12,
        padding: "10px 12px 10px 10px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        border: `1px solid ${getStatusBorder(status)}`,
        boxShadow: "0 2px 12px rgba(0,0,0,.08)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: onClick ? "pointer" : "default",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.15)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.08)";
      }}
      onFocus={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.15)";
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.08)";
      }}
    >
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: getStatusDotColor(status), flexShrink: 0 }} />
          <div style={{ fontSize: 8, opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{label}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
          <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
          <TrendIcon trend={trend} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
          <StatusIcon status={status} />
          <div style={{ fontSize: 8, opacity: 0.6 }}>{sub}</div>
        </div>
      </div>
      {onClick && (
        <ChevronRight sx={{ fontSize: 12, opacity: 0.35, position: "absolute", bottom: 4, right: 4 }} />
      )}
    </div>
  );
}
