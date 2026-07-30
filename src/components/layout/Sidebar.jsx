import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

const menu = [
  { name: "🏠 Dashboard", path: "/dashboard" },
  { name: "🐄 Livestock", path: "/livestock" },
  { name: "❤️ Animal Health", path: "/health" },
  { name: "🐂 Breeding", path: "/breeding" },
  { name: "💳 Finance", path: "/finance" },
  { name: "🌾 Crops", path: "/crops" },
  { name: "🚜 Machinery", path: "/machinery" },
  { name: "📋 Planner Dashboard", path: "/tasks" },
  { name: "🧠 Planner Workspace", path: "/planner" },
  { name: "📊 Reports", path: "/reports" },
  { name: "⚙️ Account", path: "/account" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <aside
      style={{
        width: 280,
        background: "#0D2F1F",
        color: "#fff",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        padding: "24px 18px",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {/* Logo */}

      <div
        style={{
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        <img
          src="/branding/feldrix-logo-white.png"
          alt="Feldrix"
          style={{
            width: "200px",
            maxWidth: "100%",
            height: "auto",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>

      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,.12)",
          marginBottom: 18,
        }}
      />

      <div style={{ flex: 1 }}>
        {menu.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              style={{
                display: "block",
                padding: "12px 14px",
                marginBottom: 6,
                borderRadius: 10,
                color: "#fff",
                textDecoration: "none",
                fontWeight: active ? 700 : 500,
                background: active
                  ? "rgba(255,255,255,.10)"
                  : "transparent",
                transition: ".2s",
              }}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          padding: "12px",
          border: "none",
          borderRadius: 10,
          background: "#B91C1C",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 16,
          fontSize: 15,
        }}
      >
        🚪 Logout
      </button>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,.12)",
          paddingTop: 16,
          textAlign: "center",
          fontSize: 12,
          color: "rgba(255,255,255,.65)",
        }}
      >
        © {new Date().getFullYear()} Feldrix
      </div>
    </aside>
  );
}
