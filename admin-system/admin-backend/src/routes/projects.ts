import { Router } from "express";
import { z } from "zod";
import { requireAuth, type RequestWithAuth } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { modulesService } from "../services/modules-service";

export const projectsRouter = Router();

const reviewSchema = z.object({
  decision: z.enum(["approved", "rejected", "needs_changes"]),
  comments: z.string().optional()
});

projectsRouter.post("/:id/review", requireAuth, requirePermission("modules.review"), (req, res) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid review payload",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  const result = modulesService.reviewProject(
    req.params.id,
    (req as RequestWithAuth).authUser?.authUserId ?? "unknown",
    parsed.data.decision,
    parsed.data.comments
  );

  if (!result) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "Project not found",
      data: null,
      requestId: "local"
    });
  }

  return res.status(200).json({
    code: "OK",
    message: "Review applied",
    data: result,
    requestId: "local"
  });
});
