import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { resolveOrgScope } from "../middleware/org-scope";
import { requirePermission } from "../middleware/rbac";

export const usersRouter = Router();

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  size: z.coerce.number().min(1).max(100).default(20),
  orgUnitId: z.string().uuid().optional()
});

usersRouter.get("/", requireAuth, requirePermission("users.read"), (req, res) => {
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

  return res.status(200).json({
    code: "OK",
    message: "Users list",
    data: {
      page: query.data.page,
      size: query.data.size,
      orgUnitId: scopedOrg,
      items: []
    },
    requestId: "local"
  });
});
