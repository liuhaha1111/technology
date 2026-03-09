import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { usersService } from "../services/users-service";

export const rolesRouter = Router();

rolesRouter.get("/roles", requireAuth, requirePermission("roles.read"), (_req, res) => {
  return res.status(200).json({
    code: "OK",
    message: "Roles list",
    data: {
      items: usersService.listRoles()
    },
    requestId: "local"
  });
});

rolesRouter.get("/permissions", requireAuth, requirePermission("roles.read"), (_req, res) => {
  return res.status(200).json({
    code: "OK",
    message: "Permissions list",
    data: {
      items: usersService.listPermissions()
    },
    requestId: "local"
  });
});
