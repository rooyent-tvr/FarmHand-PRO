import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Livestock from "./pages/Livestock";
import Crops from "./pages/Crops";
import Health from "./pages/Health";
import Breeding from "./pages/Breeding";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import Finance from "./pages/Finance";
import Account from "./pages/Account";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/livestock" element={<Livestock />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/health" element={<Health />} />
        <Route path="/breeding" element={<Breeding />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/account" element={<Account />} />
      </Route>
    </Routes>
  );
}
