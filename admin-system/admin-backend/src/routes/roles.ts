import { Router } from "express";
import { requireAuth, type RequestWithAuth } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { usersService } from "../services/users-service";

export const rolesRouter = Router();

rolesRouter.get("/roles", requireAuth, requirePermission("roles.read"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const items = await usersService.listRoles(Boolean(authReq.authUser?.roleHint));
  return res.status(200).json({
    code: "OK",
    message: "Roles list",
    data: {
      items
    },
    requestId: "local"
  });
});

rolesRouter.get("/permissions", requireAuth, requirePermission("roles.read"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const items = await usersService.listPermissions(Boolean(authReq.authUser?.roleHint));
  return res.status(200).json({
    code: "OK",
    message: "Permissions list",
    data: {
      items
    },
    requestId: "local"
  });
});
