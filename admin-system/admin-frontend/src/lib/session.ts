export const TOKEN_KEY = "admin_system_access_token";
export const ROLE_KEY = "admin_system_role";

export type RoleKey = "super_admin" | "admin" | "analyst" | "viewer";

export function getRole(): RoleKey {
  const role = localStorage.getItem(ROLE_KEY);
  if (role === "super_admin" || role === "admin" || role === "analyst" || role === "viewer") {
    return role;
  }
  return "viewer";
}

export function setSession(token: string, role: RoleKey) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}
