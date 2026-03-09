export type RoleItem = {
  key: string;
  name: string;
  description: string;
};

export type PermissionItem = {
  key: string;
  module: string;
  action: string;
  description: string;
};

export type UserItem = {
  id: string;
  email: string;
  displayName: string;
  orgUnitId: string;
  status: "active" | "disabled";
  roles: string[];
};

const roles: RoleItem[] = [
  { key: "super_admin", name: "Super Admin", description: "Global full access" },
  { key: "admin", name: "Admin", description: "Org full management" },
  { key: "analyst", name: "Analyst", description: "Org analysis and review" },
  { key: "viewer", name: "Viewer", description: "Org read only" }
];

const permissions: PermissionItem[] = [
  { key: "users.read", module: "users", action: "read", description: "Read users" },
  { key: "users.write", module: "users", action: "write", description: "Write users" },
  { key: "roles.read", module: "roles", action: "read", description: "Read roles" },
  { key: "roles.write", module: "roles", action: "write", description: "Write roles" },
  { key: "modules.read", module: "modules", action: "read", description: "Read module records" },
  { key: "modules.review", module: "modules", action: "review", description: "Review module records" },
  { key: "analytics.read", module: "analytics", action: "read", description: "Read analytics" },
  { key: "audits.read", module: "audits", action: "read", description: "Read audit logs" }
];

const usersStore: UserItem[] = [
  {
    id: "u-100",
    email: "admin@example.com",
    displayName: "Admin User",
    orgUnitId: "00000000-0000-0000-0000-000000000001",
    status: "active",
    roles: ["admin"]
  }
];

export const usersService = {
  listUsers: (page: number, size: number, orgUnitId?: string | null) => {
    const filtered = orgUnitId ? usersStore.filter((item) => item.orgUnitId === orgUnitId) : usersStore;
    const start = (page - 1) * size;
    const items = filtered.slice(start, start + size);
    return {
      total: filtered.length,
      items
    };
  },

  createUser: (payload: Omit<UserItem, "id">) => {
    const created: UserItem = {
      id: `u-${usersStore.length + 101}`,
      ...payload
    };
    usersStore.push(created);
    return created;
  },

  assignRoles: (userId: string, roleKeys: string[]) => {
    const target = usersStore.find((item) => item.id === userId);
    if (!target) {
      return null;
    }
    target.roles = roleKeys;
    return target;
  },

  listRoles: () => roles,
  listPermissions: () => permissions
};
