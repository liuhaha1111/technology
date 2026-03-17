export const PORTAL_TOKEN_KEY = "portal_access_token";
export const PORTAL_ACCOUNT_TYPE_KEY = "portal_account_type";

export type PortalAccountType = "unit" | "principal";

export function setPortalSession(token: string, accountType: PortalAccountType) {
  localStorage.setItem(PORTAL_TOKEN_KEY, token);
  localStorage.setItem(PORTAL_ACCOUNT_TYPE_KEY, accountType);
}

export function getPortalToken() {
  return localStorage.getItem(PORTAL_TOKEN_KEY);
}

export function getPortalAccountType(): PortalAccountType | null {
  const accountType = localStorage.getItem(PORTAL_ACCOUNT_TYPE_KEY);
  if (accountType === "unit" || accountType === "principal") {
    return accountType;
  }
  return null;
}

export function clearPortalSession() {
  localStorage.removeItem(PORTAL_TOKEN_KEY);
  localStorage.removeItem(PORTAL_ACCOUNT_TYPE_KEY);
}
