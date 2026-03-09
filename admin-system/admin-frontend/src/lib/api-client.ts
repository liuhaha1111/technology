const API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL ?? "http://localhost:3200/api/v1";
const TOKEN_KEY = "admin_system_access_token";

type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("登录失败");
  }

  return response.json();
}

async function requestJson(path: string, init?: RequestInit) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers ?? {})
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  getUsers: () => requestJson("/users?page=1&size=20"),
  getRoles: () => requestJson("/roles"),
  getPermissions: () => requestJson("/permissions"),
  getModuleRecords: (moduleKey: string) => requestJson(`/modules/${moduleKey}/records?page=1&size=20`),
  reviewProject: (projectId: string, decision: string, comments?: string) =>
    requestJson(`/projects/${projectId}/review`, {
      method: "POST",
      body: JSON.stringify({ decision, comments })
    }),
  getOverview: () => requestJson("/analytics/overview"),
  getTrends: () => requestJson("/analytics/trends"),
  getFunnel: () => requestJson("/analytics/funnel"),
  getAudits: () => requestJson("/audits?page=1&size=20")
};
