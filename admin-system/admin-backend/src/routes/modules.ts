import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { resolveOrgScope } from "../middleware/org-scope";
import { requirePermission } from "../middleware/rbac";
import { modulesService } from "../services/modules-service";

export const modulesRouter = Router();

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  size: z.coerce.number().min(1).max(100).default(20),
  status: z.string().optional(),
  orgUnitId: z.string().uuid().optional()
});

modulesRouter.get("/:moduleKey/records", requireAuth, requirePermission("modules.read"), (req, res) => {
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

  const moduleKeyParam = req.params.moduleKey;
  const moduleKey = Array.isArray(moduleKeyParam) ? moduleKeyParam[0] : moduleKeyParam;
  if (!moduleKey) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid module key",
      data: null,
      requestId: "local"
    });
  }
  const result = modulesService.listRecords(moduleKey, query.data.page, query.data.size, scopedOrg, query.data.status);

  return res.status(200).json({
    code: "OK",
    message: "Module records",
    data: {
      moduleKey,
      page: query.data.page,
      size: query.data.size,
      ...result
    },
    requestId: "local"
  });
});
