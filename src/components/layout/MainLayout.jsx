import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { NotificationProvider } from "../../context/NotificationContext";

export default function MainLayout() {
  return (
    <NotificationProvider>
      <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fa" }}>
        <Sidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <TopBar />

          <main style={{ padding: "30px" }}>
            <Outlet />
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}
