import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { analyticsService } from "../services/analytics-service";

export const analyticsRouter = Router();

analyticsRouter.get("/overview", requireAuth, requirePermission("analytics.read"), (_req, res) => {
  return res.status(200).json({
    code: "OK",
    message: "Overview metrics",
    data: analyticsService.getOverview(),
    requestId: "local"
  });
});

analyticsRouter.get("/trends", requireAuth, requirePermission("analytics.read"), (_req, res) => {
  return res.status(200).json({
    code: "OK",
    message: "Trend metrics",
    data: analyticsService.getTrends(),
    requestId: "local"
  });
});

analyticsRouter.get("/funnel", requireAuth, requirePermission("analytics.read"), (_req, res) => {
  return res.status(200).json({
    code: "OK",
    message: "Funnel metrics",
    data: analyticsService.getFunnel(),
    requestId: "local"
  });
});
