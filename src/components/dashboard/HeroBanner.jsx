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

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions (preserved exactly)
// ─────────────────────────────────────────────────────────────────────────────

function getStaticGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 23) return "Good Evening";
  return "Welcome Back";
}

function getModuleIcon(module) {
  switch (module) {
    case "Livestock": return "\u{1F404}";
    case "Crops": return "\u{1F33E}";
    case "Machinery": return "\u{1F69C}";
    case "Planner": return "\u{1F4CB}";
    case "Finance": return "\u{1F4B0}";
    default: return "\u{1F4CA}";
  }
}

function getStatusBorder(status) {
  switch (status) {
    case "critical": return "rgba(244,67,54,.5)";
    case "warning": return "rgba(255,152,0,.5)";
    default: return "rgba(255,255,255,.18)";
  }
}

function getStatusDotColor(status) {
  switch (status) {
    case "critical": return "#F44336";
    case "warning": return "#FF9800";
    default: return "#4CAF50";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal Sub-Components
// ─────────────────────────────────────────────────────────────────────────────

function StatusIcon({ status }) {
  const style = { fontSize: 13, opacity: 0.9 };
  switch (status) {
    case "critical": return <ErrorIcon sx={{ ...style, color: "#F44336" }} />;
    case "warning": return <WarningAmber sx={{ ...style, color: "#FF9800" }} />;
    default: return <CheckCircle sx={{ ...style, color: "#4CAF50" }} />;
  }
}

function TrendIcon({ trend }) {
  if (!trend) return null;
  const style = { fontSize: 12, opacity: 0.75 };
  switch (trend) {
    case "positive": return <TrendingUp sx={{ ...style, color: "#4CAF50" }} />;
    case "negative": return <TrendingDown sx={{ ...style, color: "#F44336" }} />;
    default: return <TrendingFlat sx={{ ...style, color: "#fff" }} />;
  }
}

// ─── HeroHeader ──────────────────────────────────────────────────────────────

function HeroHeader({ greeting, summary }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.28em",
          opacity: 0.7,
          marginBottom: 4,
        }}
      >
        FELDRIX
      </div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          opacity: 0.55,
          marginBottom: 20,
        }}
      >
        SMART FARM OPERATING SYSTEM
      </div>
      <h1
        style={{
          fontSize: 42,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          margin: 0,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {greeting}
      </h1>
      <p
        style={{
          fontSize: 16,
          fontWeight: 400,
          opacity: 0.88,
          marginTop: 14,
          maxWidth: 600,
          lineHeight: 1.65,
          margin: "14px 0 0 0",
        }}
      >
        {summary}
      </p>
    </div>
  );
}

// ─── WeatherPanel ────────────────────────────────────────────────────────────

function WeatherPanel({ weather, weatherText }) {
  return (
    <div
      style={{
        textAlign: "center",
        flexShrink: 0,
        marginLeft: 32,
        background: "rgba(255,255,255,.12)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "28px 32px",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,.18)",
        minWidth: 200,
        boxShadow: "0 8px 32px rgba(0,0,0,.15), inset 0 1px 0 rgba(255,255,255,.1)",
      }}
    >
      {weatherText ? (
        <div>
          <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
            {weather?.current?.temperature ?? ""}&deg;
          </div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8, fontWeight: 500 }}>
            {weatherText}
          </div>
        </div>
      ) : weather?.available ? (
        <div>
          <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
            {weather.current?.temperature}&deg;
          </div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8, fontWeight: 500 }}>
            {weather.current?.condition}
          </div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6, fontWeight: 400 }}>
            Wind {weather.current?.windSpeed} km/h
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 12, opacity: 0.45, fontWeight: 500 }}>
          Weather<br />unavailable
        </div>
      )}
    </div>
  );
}

// ─── RecommendationCard ──────────────────────────────────────────────────────

function RecommendationCard({ recommendation }) {
  if (!recommendation) return null;

  return (
    <div
      style={{
        marginTop: 20,
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        background: "rgba(255,255,255,.1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderLeft: "3px solid #3FAE66",
        borderRadius: 12,
        padding: "14px 18px",
        maxWidth: 480,
        boxShadow: "0 4px 16px rgba(0,0,0,.08)",
      }}
    >
      <Lightbulb sx={{ fontSize: 16, color: "#3FAE66", mt: "2px", flexShrink: 0 }} />
      <div style={{ fontSize: 13, opacity: 0.92, lineHeight: 1.55, fontWeight: 400 }}>
        {recommendation}
      </div>
    </div>
  );
}

// ─── HighlightRow ────────────────────────────────────────────────────────────

function HighlightRow({ highlights }) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
      {highlights.map((h, i) => (
        <div
          key={i}
          style={{
            fontSize: 12,
            fontWeight: 500,
            opacity: 0.92,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,.1)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            padding: "8px 14px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,.12)",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#3FAE66",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          {h}
        </div>
      ))}
    </div>
  );
}

// ─── KPICard ─────────────────────────────────────────────────────────────────

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
        background: accent ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.12)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: 16,
        padding: "20px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        border: `1px solid ${getStatusBorder(status)}`,
        boxShadow: "0 4px 20px rgba(0,0,0,.1), inset 0 1px 0 rgba(255,255,255,.08)",
        transition: "transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s cubic-bezier(.4,0,.2,1)",
        cursor: onClick ? "pointer" : "default",
        outline: "none",
        minHeight: 88,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 16px 40px rgba(15,81,50,.25), inset 0 1px 0 rgba(255,255,255,.12)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.1), inset 0 1px 0 rgba(255,255,255,.08)";
      }}
      onFocus={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 16px 40px rgba(15,81,50,.25), inset 0 1px 0 rgba(255,255,255,.12)";
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.1), inset 0 1px 0 rgba(255,255,255,.08)";
      }}
    >
      <div style={{ fontSize: 32, lineHeight: 1 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: getStatusDotColor(status),
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontSize: 11,
              opacity: 0.75,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            {label}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {value}
          </div>
          <TrendIcon trend={trend} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
          <StatusIcon status={status} />
          <div style={{ fontSize: 11, opacity: 0.72, fontWeight: 400 }}>{sub}</div>
        </div>
      </div>
      {onClick && (
        <ChevronRight
          sx={{
            fontSize: 14,
            opacity: 0.3,
            position: "absolute",
            bottom: 8,
            right: 8,
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

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
  const accentColor =
    priority === "critical"
      ? "rgba(244,67,54,.6)"
      : priority === "warning"
      ? "rgba(255,152,0,.5)"
      : "rgba(63,174,102,.4)";

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        color: "#fff",
        boxShadow: "0 8px 40px rgba(0,0,0,.15), 0 2px 8px rgba(0,0,0,.08)",
        borderLeft: `4px solid ${accentColor}`,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Background — agricultural imagery with soft dark green overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          zIndex: 0,
        }}
      />
      {/* Soft dark green overlay with radial gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(27,94,32,.82) 0%, rgba(15,81,50,.88) 40%, rgba(36,92,60,.9) 100%)",
          zIndex: 1,
        }}
      />
      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.25) 100%)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "48px 48px 40px",
          minHeight: 380,
          animation: "fadeIn 0.6s ease-out",
        }}
      >
        {/* Top Row: Left (Header/Summary/Recommendation/Highlights) + Right (Weather) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 36,
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          {/* Left Column */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <HeroHeader greeting={greeting} summary={summary} />
            <RecommendationCard recommendation={recommendation} />
            <HighlightRow highlights={highlights} />
          </div>

          {/* Right Column — Weather */}
          <WeatherPanel weather={weather} weatherText={weatherText} />
        </div>

        {/* KPI Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 18,
          }}
        >
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
              <KPICard
                icon="\u{1F404}"
                label="Livestock"
                value={totalAnimals}
                sub="Total Animals"
                status="good"
              />
              <KPICard
                icon="\u{1F33E}"
                label="Crops"
                value={totalCrops}
                sub="Active Fields"
                status="good"
              />
              <KPICard
                icon="\u{1F69C}"
                label="Machinery"
                value={machineryCount > 0 ? machineryCount : "\u2713"}
                sub={machineryCount > 0 ? "Service Due" : "Active"}
                status={machineryCount > 0 ? "warning" : "good"}
              />
              <KPICard
                icon="\u{1F4CB}"
                label="Planner"
                value={plannerOverdue + plannerToday}
                sub="Items Today"
                status={plannerOverdue > 0 ? "critical" : "good"}
              />
              <KPICard
                icon="\u{1F4B0}"
                label="Finance"
                value={`R ${farmHealthScore.toLocaleString()}`}
                sub={farmHealthStatus || "Score"}
                status="good"
                accent
              />
            </>
          )}
        </div>
      </div>

      {/* Fade-in keyframe (injected inline for portability) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
