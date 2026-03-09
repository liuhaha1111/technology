import { Link, Outlet } from "react-router-dom";

const menus = [
  { to: "/app", label: "概览" },
  { to: "/app/users", label: "用户管理" },
  { to: "/app/roles", label: "角色权限" },
  { to: "/app/modules", label: "业务模块" },
  { to: "/app/analytics", label: "统计分析" },
  { to: "/app/audits", label: "操作审计" }
];

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <strong>吉林省科技计划后台管理系统</strong>
      </header>
      <div className="admin-main">
        <aside className="admin-sidebar">
          {menus.map((menu) => (
            <Link key={menu.to} to={menu.to}>
              {menu.label}
            </Link>
          ))}
        </aside>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
