import type { ReactElement } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AdminLayout } from "./layout/AdminLayout";
import { LoginPage } from "./pages/LoginPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";

const TOKEN_KEY = "admin_system_access_token";

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
      onLoggedIn={(token) => {
        localStorage.setItem(TOKEN_KEY, token);
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
        <Route index element={<PlaceholderPage title="系统概览" />} />
        <Route path="users" element={<PlaceholderPage title="用户管理" />} />
        <Route path="roles" element={<PlaceholderPage title="角色权限" />} />
        <Route path="modules" element={<PlaceholderPage title="业务模块" />} />
        <Route path="analytics" element={<PlaceholderPage title="统计分析" />} />
        <Route path="audits" element={<PlaceholderPage title="操作审计" />} />
      </Route>
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}
