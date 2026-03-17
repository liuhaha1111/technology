import { Router } from "express";
import { requireAuth, type RequestWithAuth } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { analyticsService } from "../services/analytics-service";

export const analyticsRouter = Router();

analyticsRouter.get("/overview", requireAuth, requirePermission("analytics.read"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  return res.status(200).json({
    code: "OK",
    message: "Overview metrics",
    data: await analyticsService.getOverview(Boolean(authReq.authUser?.roleHint)),
    requestId: "local"
  });
});

analyticsRouter.get("/trends", requireAuth, requirePermission("analytics.read"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  return res.status(200).json({
    code: "OK",
    message: "Trend metrics",
    data: await analyticsService.getTrends(Boolean(authReq.authUser?.roleHint)),
    requestId: "local"
  });
});

analyticsRouter.get("/funnel", requireAuth, requirePermission("analytics.read"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  return res.status(200).json({
    code: "OK",
    message: "Funnel metrics",
    data: await analyticsService.getFunnel(Boolean(authReq.authUser?.roleHint)),
    requestId: "local"
  });
});
