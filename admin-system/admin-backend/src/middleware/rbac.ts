import type { NextFunction, Response } from "express";
import type { RequestWithAuth } from "./auth";

const rolePermissions: Record<string, string[]> = {
  super_admin: ["*"],
  admin: ["users.read", "users.write", "roles.read", "roles.write", "modules.read", "modules.review", "analytics.read", "audits.read"],
  analyst: ["modules.read", "modules.review", "analytics.read", "audits.read"],
  viewer: ["modules.read", "analytics.read"]
};

const hasPermission = (role: string, permission: string): boolean => {
  const allowed = rolePermissions[role] ?? [];
  return allowed.includes("*") || allowed.includes(permission);
};

export const requirePermission = (permission: string) => {
  return (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const role = req.authUser?.roleHint ?? "viewer";
    if (!hasPermission(role, permission)) {
      return res.status(403).json({
        code: "FORBIDDEN",
        message: "Permission denied",
        data: null,
        requestId: "local"
      });
    }

    return next();
  };
};
