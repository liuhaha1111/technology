import type { ReactElement } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AdminLayout } from "./layout/AdminLayout";
import { clearSession, ROLE_KEY, setSession, TOKEN_KEY, type RoleKey } from "./lib/session";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { AuditsPage } from "./pages/AuditsPage";
import { BusinessModulesPage } from "./pages/BusinessModulesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RolesPage } from "./pages/RolesPage";
import { UsersPage } from "./pages/UsersPage";

function RequireAuth({ children }: { children: ReactElement }) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function LoginRoute() {
  const navigate = useNavigate();
  return (
    <LoginPage
      onLoggedIn={(token, role) => {
        const currentRole = role ?? ((localStorage.getItem(ROLE_KEY) as RoleKey) ?? "viewer");
        setSession(token, currentRole);
        navigate("/app", { replace: true });
      }}
    />
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route
        path="/app"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="modules" element={<BusinessModulesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="audits" element={<AuditsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}
