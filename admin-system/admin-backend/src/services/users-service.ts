import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "../lib/supabase";

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

const rolesMock: RoleItem[] = [
  { key: "super_admin", name: "Super Admin", description: "Global full access" },
  { key: "admin", name: "Admin", description: "Org full management" },
  { key: "analyst", name: "Analyst", description: "Org analysis and review" },
  { key: "viewer", name: "Viewer", description: "Org read only" }
];

const permissionsMock: PermissionItem[] = [
  { key: "users.read", module: "users", action: "read", description: "Read users" },
  { key: "users.write", module: "users", action: "write", description: "Write users" },
  { key: "roles.read", module: "roles", action: "read", description: "Read roles" },
  { key: "roles.write", module: "roles", action: "write", description: "Write roles" },
  { key: "modules.read", module: "modules", action: "read", description: "Read module records" },
  { key: "modules.review", module: "modules", action: "review", description: "Review module records" },
  { key: "analytics.read", module: "analytics", action: "read", description: "Read analytics" },
  { key: "audits.read", module: "audits", action: "read", description: "Read audit logs" },
  { key: "organizations.review", module: "organizations", action: "review", description: "Review organization registration" },
  { key: "templates.manage", module: "templates", action: "manage", description: "Manage declaration templates" }
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

type ListUsersParams = {
  page: number;
  size: number;
  orgUnitId?: string | null;
  useMock: boolean;
};

type CreateUserParams = Omit<UserItem, "id"> & {
  useMock: boolean;
};

const listUsersMock = (page: number, size: number, orgUnitId?: string | null) => {
  const filtered = orgUnitId ? usersStore.filter((item) => item.orgUnitId === orgUnitId) : usersStore;
  const start = (page - 1) * size;
  return {
    total: filtered.length,
    items: filtered.slice(start, start + size)
  };
};

const listUsersSupabase = async (page: number, size: number, orgUnitId?: string | null) => {
  let query = supabaseAdmin
    .from("admin_users")
    .select("id,email,display_name,status,org_unit_id,user_roles(role_id,roles(key))", { count: "exact" });

  if (orgUnitId) {
    query = query.eq("org_unit_id", orgUnitId);
  }

  const from = (page - 1) * size;
  const to = from + size - 1;
  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw error;
  }

  const items: UserItem[] = (data ?? []).map((row: any) => ({
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    orgUnitId: row.org_unit_id,
    status: row.status,
    roles: (row.user_roles ?? []).map((ur: any) => ur.roles?.key).filter(Boolean)
  }));

  return {
    total: count ?? items.length,
    items
  };
};

const createUserSupabase = async (payload: Omit<UserItem, "id">) => {
  const authUserId = randomUUID();

  const { data: createdUser, error: createError } = await supabaseAdmin
    .from("admin_users")
    .insert({
      auth_user_id: authUserId,
      org_unit_id: payload.orgUnitId,
      email: payload.email,
      display_name: payload.displayName,
      status: payload.status
    })
    .select("id,email,display_name,status,org_unit_id")
    .single();

  if (createError || !createdUser) {
    throw createError ?? new Error("Failed to create user");
  }

  const { data: roleRows, error: roleError } = await supabaseAdmin.from("roles").select("id,key").in("key", payload.roles);
  if (roleError) {
    throw roleError;
  }

  if (roleRows?.length) {
    const inserts = roleRows.map((role) => ({ user_id: createdUser.id, role_id: role.id }));
    const { error: linkError } = await supabaseAdmin.from("user_roles").insert(inserts);
    if (linkError) {
      throw linkError;
    }
  }

  return {
    id: createdUser.id,
    email: createdUser.email,
    displayName: createdUser.display_name,
    orgUnitId: createdUser.org_unit_id,
    status: createdUser.status,
    roles: payload.roles
  } as UserItem;
};

const assignRolesSupabase = async (userId: string, roleKeys: string[]) => {
  const { data: userRow, error: userError } = await supabaseAdmin
    .from("admin_users")
    .select("id,email,display_name,status,org_unit_id")
    .eq("id", userId)
    .single();
  if (userError || !userRow) {
    return null;
  }

  const { data: rolesRows, error: rolesError } = await supabaseAdmin.from("roles").select("id,key").in("key", roleKeys);
  if (rolesError) {
    throw rolesError;
  }

  const { error: deleteError } = await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);
  if (deleteError) {
    throw deleteError;
  }

  if (rolesRows?.length) {
    const { error: insertError } = await supabaseAdmin
      .from("user_roles")
      .insert(rolesRows.map((role) => ({ user_id: userId, role_id: role.id })));
    if (insertError) {
      throw insertError;
    }
  }

  return {
    id: userRow.id,
    email: userRow.email,
    displayName: userRow.display_name,
    orgUnitId: userRow.org_unit_id,
    status: userRow.status,
    roles: rolesRows?.map((row) => row.key) ?? []
  } as UserItem;
};

const listRolesSupabase = async () => {
  const { data, error } = await supabaseAdmin.from("roles").select("key,name,description").order("key");
  if (error) {
    throw error;
  }
  return (data ?? []) as RoleItem[];
};

const listPermissionsSupabase = async () => {
  const { data, error } = await supabaseAdmin.from("permissions").select("key,module,action,description").order("key");
  if (error) {
    throw error;
  }
  return (data ?? []) as PermissionItem[];
};

export const usersService = {
  listUsers: async ({ page, size, orgUnitId, useMock }: ListUsersParams) =>
    useMock ? listUsersMock(page, size, orgUnitId) : listUsersSupabase(page, size, orgUnitId),

  createUser: async ({ useMock, ...payload }: CreateUserParams) => {
    if (useMock) {
      const created: UserItem = {
        id: `u-${usersStore.length + 101}`,
        ...payload
      };
      usersStore.push(created);
      return created;
    }

    return createUserSupabase(payload);
  },

  assignRoles: async (userId: string, roleKeys: string[], useMock: boolean) => {
    if (useMock) {
      const target = usersStore.find((item) => item.id === userId);
      if (!target) {
        return null;
      }
      target.roles = roleKeys;
      return target;
    }

    return assignRolesSupabase(userId, roleKeys);
  },

  listRoles: async (useMock: boolean) => (useMock ? rolesMock : listRolesSupabase()),

  listPermissions: async (useMock: boolean) => (useMock ? permissionsMock : listPermissionsSupabase())
};
