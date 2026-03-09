import { Router } from "express";
import { z } from "zod";
import { requireAuth, type RequestWithAuth } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { analyticsService } from "../services/analytics-service";

export const auditsRouter = Router();

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  size: z.coerce.number().min(1).max(100).default(20)
});

auditsRouter.get("/", requireAuth, requirePermission("audits.read"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid query",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  const list = await analyticsService.listAudits(parsed.data.page, parsed.data.size, Boolean(authReq.authUser?.roleHint));

  return res.status(200).json({
    code: "OK",
    message: "Audit list",
    data: {
      page: parsed.data.page,
      size: parsed.data.size,
      ...list
    },
    requestId: "local"
  });
});
