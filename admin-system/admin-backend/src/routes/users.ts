import { Router } from "express";
import { z } from "zod";
import { requireAuth, type RequestWithAuth } from "../middleware/auth";
import { resolveOrgScope } from "../middleware/org-scope";
import { requirePermission } from "../middleware/rbac";
import { usersService } from "../services/users-service";

export const usersRouter = Router();

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  size: z.coerce.number().min(1).max(100).default(20),
  orgUnitId: z.string().uuid().optional()
});

const createUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1),
  orgUnitId: z.string().uuid(),
  status: z.enum(["active", "disabled"]).default("active"),
  roles: z.array(z.string()).min(1)
});

const updateRolesSchema = z.object({
  roleKeys: z.array(z.string()).min(1)
});

usersRouter.get("/", requireAuth, requirePermission("users.read"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const query = querySchema.safeParse(req.query);
  if (!query.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid query",
      data: query.error.flatten(),
      requestId: "local"
    });
  }

  const scopedOrg = resolveOrgScope(req, query.data.orgUnitId);
  if (scopedOrg === "__forbidden__") {
    return res.status(403).json({
      code: "FORBIDDEN",
      message: "Cross-organization access denied",
      data: null,
      requestId: "local"
    });
  }

  const useMock = Boolean(authReq.authUser?.roleHint);
  const usersData = await usersService.listUsers({
    page: query.data.page,
    size: query.data.size,
    orgUnitId: scopedOrg,
    useMock
  });

  return res.status(200).json({
    code: "OK",
    message: "Users list",
    data: {
      page: query.data.page,
      size: query.data.size,
      orgUnitId: scopedOrg,
      ...usersData
    },
    requestId: "local"
  });
});

usersRouter.post("/", requireAuth, requirePermission("users.write"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid body",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  const scopedOrg = resolveOrgScope(req, parsed.data.orgUnitId);
  if (scopedOrg === "__forbidden__") {
    return res.status(403).json({
      code: "FORBIDDEN",
      message: "Cross-organization access denied",
      data: null,
      requestId: "local"
    });
  }

  const user = await usersService.createUser({
    email: parsed.data.email,
    displayName: parsed.data.displayName,
    orgUnitId: parsed.data.orgUnitId,
    status: parsed.data.status,
    roles: parsed.data.roles,
    useMock: Boolean(authReq.authUser?.roleHint)
  });

  return res.status(201).json({
    code: "OK",
    message: "User created",
    data: user,
    requestId: "local"
  });
});

usersRouter.put("/:id/roles", requireAuth, requirePermission("roles.write"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const parsed = updateRolesSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid body",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  const userIdParam = req.params.id;
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
  if (!userId) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid user id",
      data: null,
      requestId: "local"
    });
  }

  const updated = await usersService.assignRoles(userId, parsed.data.roleKeys, Boolean(authReq.authUser?.roleHint));
  if (!updated) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "User not found",
      data: null,
      requestId: "local"
    });
  }

  return res.status(200).json({
    code: "OK",
    message: "Roles updated",
    data: updated,
    requestId: "local"
  });
});
