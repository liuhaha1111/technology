import { Link, Outlet } from "react-router-dom";
import { getRole, type RoleKey } from "../lib/session";

const menus = [
  { to: "/app", label: "概览", roles: ["super_admin", "admin", "analyst", "viewer"] as RoleKey[] },
  { to: "/app/users", label: "用户管理", roles: ["super_admin", "admin"] as RoleKey[] },
  { to: "/app/roles", label: "角色权限", roles: ["super_admin", "admin"] as RoleKey[] },
  { to: "/app/modules", label: "业务模块", roles: ["super_admin", "admin", "analyst", "viewer"] as RoleKey[] },
  { to: "/app/analytics", label: "统计分析", roles: ["super_admin", "admin", "analyst", "viewer"] as RoleKey[] },
  { to: "/app/audits", label: "操作审计", roles: ["super_admin", "admin", "analyst"] as RoleKey[] }
];

export function AdminLayout() {
  const role = getRole();
  const visibleMenus = menus.filter((menu) => menu.roles.includes(role));

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <strong>吉林省科技计划后台管理系统</strong>
      </header>
      <div className="admin-main">
        <aside className="admin-sidebar">
          {visibleMenus.map((menu) => (
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
