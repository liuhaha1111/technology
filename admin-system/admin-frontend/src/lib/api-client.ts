const API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL ?? "http://localhost:3200/api/v1";

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
