import { clearPortalSession, getPortalAccountType, getPortalToken } from "./session";

const API_BASE_URL = import.meta.env.VITE_PORTAL_API_BASE_URL ?? "http://localhost:3200/api/v1";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

async function requestJson<T = any>(path: string, options?: RequestOptions): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (options?.headers) {
    Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
      headers[key] = value;
    });
  }
  if (options?.auth) {
    const token = getPortalToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const accountType = getPortalAccountType();
    if (accountType) {
      headers["X-Portal-Account-Type"] = accountType;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    if (options?.auth && response.status === 401) {
      clearPortalSession();
      if (typeof window !== "undefined") {
        window.location.replace("/");
      }
      throw new Error("登录已失效，请重新登录");
    }
    const message = payload?.message ?? `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const portalApi = {
  getCaptcha: () => requestJson("/captcha"),
  registerOrganization: (payload: {
    account: { email: string; password: string };
    organization: {
      name: string;
      socialCreditCode?: string;
      contactName: string;
      contactPhone: string;
      provinceCode: string;
      provinceName?: string;
      cityCode: string;
      cityName?: string;
      districtCode: string;
      districtName?: string;
      address?: string;
      departmentName?: string;
    };
    captchaId: string;
    captchaCode: string;
  }) => requestJson("/public/organizations/register", { method: "POST", body: JSON.stringify(payload) }),
  getApprovedOrganizations: () => requestJson("/public/organizations/approved"),
  loginUnit: (payload: { email: string; password: string; captchaId: string; captchaCode: string }) =>
    requestJson("/public/auth/unit/login", { method: "POST", body: JSON.stringify(payload) }),
  loginPrincipal: (payload: { email: string; password: string; captchaId: string; captchaCode: string }) =>
    requestJson("/public/auth/principal/login", { method: "POST", body: JSON.stringify(payload) }),
  registerPrincipal: (payload: {
    email: string;
    password: string;
    organizationId: string;
    fullName: string;
    idType: string;
    idNumber: string;
    phone: string;
    isUnitLeader: boolean;
    isLegalRepresentative: boolean;
    captchaId: string;
    captchaCode: string;
  }) => requestJson("/public/principals/register", { method: "POST", body: JSON.stringify(payload) }),
  getProfile: () => requestJson("/public/profile", { auth: true }),
  saveProfile: (payload: {
    email?: string;
    phone?: string;
    title?: string;
    education?: string;
    degree?: string;
    isAcademician?: boolean;
    idCardFrontUrl?: string;
    idCardBackUrl?: string;
    titleCertUrl?: string;
    educationCertUrl?: string;
  }) => requestJson("/public/profile", { method: "PATCH", auth: true, body: JSON.stringify(payload) }),
  uploadProfileMaterial: (payload: { fileName: string; mimeType: string; fileBase64: string }) =>
    requestJson("/public/profile/materials/upload", { method: "POST", auth: true, body: JSON.stringify(payload) }),
  getRegions: (level: "province" | "city" | "district", parentCode?: string) =>
    requestJson(`/public/regions?level=${level}${parentCode ? `&parentCode=${parentCode}` : ""}`),
  getTemplates: (planCategory?: string) =>
    requestJson(`/public/templates${planCategory ? `?planCategory=${encodeURIComponent(planCategory)}` : ""}`),
  listDeclarations: () => requestJson("/public/declarations", { auth: true }),
  createDeclaration: (payload: { templateId: string; title: string; content?: Record<string, unknown> }) =>
    requestJson("/public/declarations", { method: "POST", auth: true, body: JSON.stringify(payload) }),
  updateDeclaration: (id: string, payload: { title?: string; status?: string; content?: Record<string, unknown> }) =>
    requestJson(`/public/declarations/${id}`, { method: "PUT", auth: true, body: JSON.stringify(payload) }),
  deleteDeclaration: (id: string) => requestJson(`/public/declarations/${id}`, { method: "DELETE", auth: true }),
  downloadDeclaration: (id: string) => requestJson(`/public/declarations/${id}/download`, { auth: true })
};



