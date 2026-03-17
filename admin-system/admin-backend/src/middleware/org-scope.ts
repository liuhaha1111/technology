import type { RequestWithAuth } from "./auth";

export const isSuperAdmin = (req: RequestWithAuth): boolean => req.authUser?.roleHint === "super_admin";

export const resolveOrgScope = (req: RequestWithAuth, requestedOrgUnitId?: string): string | null => {
  if (isSuperAdmin(req)) {
    return requestedOrgUnitId ?? null;
  }

  if (!req.authUser?.orgUnitId) {
    return null;
  }

  if (requestedOrgUnitId && requestedOrgUnitId !== req.authUser.orgUnitId) {
    return "__forbidden__";
  }

  return req.authUser.orgUnitId;
};
