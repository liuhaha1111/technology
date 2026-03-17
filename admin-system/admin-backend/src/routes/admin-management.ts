import { Router } from "express";
import { z } from "zod";
import { requireAuth, type RequestWithAuth } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { ServiceError, managementService } from "../services/management-service";

export const adminManagementRouter = Router();

const reviewSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  comment: z.string().optional()
});

const createTemplateSchema = z.object({
  planCategory: z.string().min(1),
  projectCategory: z.string().min(1),
  title: z.string().min(1),
  sourceName: z.string().optional(),
  guideUnit: z.string().optional(),
  contactPhone: z.string().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  fileUrl: z.string().url().optional()
});

const updateTemplateSchema = createTemplateSchema.partial().extend({
  status: z.enum(["draft", "published", "archived"]).optional()
});

const uploadTemplateFileSchema = z.object({
  fileName: z.string().min(1).max(200),
  mimeType: z.string().min(1).max(120),
  fileBase64: z.string().min(1)
});

const listOrgQuerySchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional()
});

const listTemplateQuerySchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  planCategory: z.string().optional()
});

const listPrincipalQuerySchema = z.object({
  roleType: z.enum(["all", "leader", "staff"]).optional(),
  status: z.enum(["active", "disabled"]).optional()
});

const updatePrincipalStatusSchema = z.object({
  status: z.enum(["active", "disabled"])
});

const wrapServiceError = (error: unknown, fallbackMessage: string, res: any) => {
  if (error instanceof ServiceError) {
    return res.status(error.status).json({
      code: error.code,
      message: error.message,
      data: null,
      requestId: "local"
    });
  }
  return res.status(500).json({
    code: "INTERNAL_ERROR",
    message: fallbackMessage,
    data: null,
    requestId: "local"
  });
};

adminManagementRouter.get("/organizations", requireAuth, requirePermission("organizations.review"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const parsed = listOrgQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid query",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  try {
    const items = await managementService.listOrganizations(parsed.data.status, Boolean(authReq.authUser?.isMockToken));
    return res.status(200).json({
      code: "OK",
      message: "Organizations",
      data: {
        items
      },
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Load organizations failed", res);
  }
});

adminManagementRouter.post(
  "/organizations/:id/review",
  requireAuth,
  requirePermission("organizations.review"),
  async (req, res) => {
    const authReq = req as RequestWithAuth;
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({
        code: "VALIDATION_ERROR",
        message: "Invalid review payload",
        data: parsed.error.flatten(),
        requestId: "local"
      });
    }

    const organizationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!organizationId) {
      return res.status(422).json({
        code: "VALIDATION_ERROR",
        message: "Invalid organization id",
        data: null,
        requestId: "local"
      });
    }

    try {
      const data = await managementService.reviewOrganization(
        organizationId,
        parsed.data.decision,
        parsed.data.comment,
        authReq.authUser?.authUserId ?? "unknown",
        Boolean(authReq.authUser?.isMockToken)
      );
      return res.status(200).json({
        code: "OK",
        message: "Organization reviewed",
        data,
        requestId: "local"
      });
    } catch (error) {
      return wrapServiceError(error, "Review organization failed", res);
    }
  }
);

adminManagementRouter.get("/templates", requireAuth, requirePermission("templates.manage"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const parsed = listTemplateQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid query",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  try {
    const items = await managementService.listTemplates(
      {
        status: parsed.data.status,
        planCategory: parsed.data.planCategory
      },
      Boolean(authReq.authUser?.isMockToken)
    );
    return res.status(200).json({
      code: "OK",
      message: "Templates",
      data: {
        items
      },
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Load templates failed", res);
  }
});

adminManagementRouter.post("/templates/upload", requireAuth, requirePermission("templates.manage"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const parsed = uploadTemplateFileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid upload payload",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  try {
    const data = await managementService.uploadTemplateFile(parsed.data, Boolean(authReq.authUser?.isMockToken));
    return res.status(201).json({
      code: "OK",
      message: "Template file uploaded",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Upload template file failed", res);
  }
});

adminManagementRouter.post("/templates", requireAuth, requirePermission("templates.manage"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const parsed = createTemplateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid template payload",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  try {
    const data = await managementService.createTemplate(
      parsed.data,
      authReq.authUser?.authUserId ?? "unknown",
      Boolean(authReq.authUser?.isMockToken)
    );
    return res.status(201).json({
      code: "OK",
      message: "Template created",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Create template failed", res);
  }
});

adminManagementRouter.put("/templates/:id", requireAuth, requirePermission("templates.manage"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const parsed = updateTemplateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid template payload",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  const templateId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!templateId) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid template id",
      data: null,
      requestId: "local"
    });
  }

  try {
    const data = await managementService.updateTemplate(templateId, parsed.data, Boolean(authReq.authUser?.isMockToken));
    return res.status(200).json({
      code: "OK",
      message: "Template updated",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Update template failed", res);
  }
});

adminManagementRouter.post("/templates/:id/publish", requireAuth, requirePermission("templates.manage"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const templateId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!templateId) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid template id",
      data: null,
      requestId: "local"
    });
  }

  try {
    const data = await managementService.publishTemplate(templateId, Boolean(authReq.authUser?.isMockToken));
    return res.status(200).json({
      code: "OK",
      message: "Template published",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Publish template failed", res);
  }
});

adminManagementRouter.delete("/templates/:id", requireAuth, requirePermission("templates.manage"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const templateId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!templateId) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid template id",
      data: null,
      requestId: "local"
    });
  }

  try {
    await managementService.deleteTemplate(templateId, Boolean(authReq.authUser?.isMockToken));
    return res.status(200).json({
      code: "OK",
      message: "Template deleted",
      data: {
        id: templateId
      },
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Delete template failed", res);
  }
});


adminManagementRouter.get("/declarations/submitted", requireAuth, requirePermission("modules.review"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  try {
    const items = await managementService.listSubmittedDeclarations(Boolean(authReq.authUser?.isMockToken));
    return res.status(200).json({
      code: "OK",
      message: "Submitted declarations",
      data: {
        items
      },
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Load submitted declarations failed", res);
  }
});

adminManagementRouter.get("/declarations/:id/download", requireAuth, requirePermission("modules.review"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const declarationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!declarationId) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid declaration id",
      data: null,
      requestId: "local"
    });
  }

  try {
    const data = await managementService.downloadSubmittedDeclaration(declarationId, Boolean(authReq.authUser?.isMockToken));
    return res.status(200).json({
      code: "OK",
      message: "Declaration download payload",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Download submitted declaration failed", res);
  }
});
adminManagementRouter.get("/principal-profiles", requireAuth, requirePermission("organizations.review"), async (req, res) => {
  const authReq = req as RequestWithAuth;

  try {
    const items = await managementService.listPrincipalProfileSubmissions(Boolean(authReq.authUser?.isMockToken));
    return res.status(200).json({
      code: "OK",
      message: "Principal profile submissions",
      data: {
        items
      },
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Load principal profile submissions failed", res);
  }
});
adminManagementRouter.get("/principals", requireAuth, requirePermission("organizations.review"), async (req, res) => {
  const authReq = req as RequestWithAuth;
  const parsed = listPrincipalQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid query",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  try {
    const items = await managementService.listPrincipalProfiles(
      {
        roleType: parsed.data.roleType,
        status: parsed.data.status
      },
      Boolean(authReq.authUser?.isMockToken)
    );
    return res.status(200).json({
      code: "OK",
      message: "Principal profiles",
      data: {
        items
      },
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Load principal profiles failed", res);
  }
});

adminManagementRouter.patch(
  "/principals/:id/status",
  requireAuth,
  requirePermission("organizations.review"),
  async (req, res) => {
    const authReq = req as RequestWithAuth;
    const parsed = updatePrincipalStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({
        code: "VALIDATION_ERROR",
        message: "Invalid status payload",
        data: parsed.error.flatten(),
        requestId: "local"
      });
    }

    const principalId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!principalId) {
      return res.status(422).json({
        code: "VALIDATION_ERROR",
        message: "Invalid principal id",
        data: null,
        requestId: "local"
      });
    }

    try {
      const data = await managementService.updatePrincipalStatus(
        principalId,
        parsed.data.status,
        Boolean(authReq.authUser?.isMockToken)
      );
      return res.status(200).json({
        code: "OK",
        message: "Principal status updated",
        data,
        requestId: "local"
      });
    } catch (error) {
      return wrapServiceError(error, "Update principal status failed", res);
    }
  }
);


