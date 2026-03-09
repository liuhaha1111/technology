import { useEffect, useState } from "react";
import { apiClient } from "../lib/api-client";

type RoleItem = { key: string; name: string; description: string };
type PermissionItem = { key: string; module: string; action: string };

export function RolesPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiClient.getRoles(), apiClient.getPermissions()])
      .then(([rolesRes, permissionsRes]) => {
        setRoles((rolesRes.data?.items ?? []) as RoleItem[]);
        setPermissions((permissionsRes.data?.items ?? []) as PermissionItem[]);
      })
      .catch(() => setError("角色权限数据加载失败"));
  }, []);

  return (
    <section className="panel">
      <h2>角色与权限</h2>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="two-col">
        <div>
          <h3>角色</h3>
          <ul>
            {roles.map((role) => (
              <li key={role.key}>
                <strong>{role.name}</strong> ({role.key}) - {role.description}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>权限</h3>
          <ul>
            {permissions.map((permission) => (
              <li key={permission.key}>
                {permission.module}.{permission.action} ({permission.key})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
