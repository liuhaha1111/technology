import { Router } from "express";
import { z } from "zod";
import { isMockModeEnabled } from "../lib/runtime";
import { requirePortalAuth, type RequestWithPortalAuth } from "../middleware/auth";
import { ServiceError, managementService } from "../services/management-service";

export const publicRouter = Router();

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

const registerOrganizationSchema = z.object({
  account: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  }),
  organization: z.object({
    name: z.string().min(1),
    socialCreditCode: z.string().optional(),
    contactName: z.string().min(1),
    contactPhone: z.string().min(1),
    provinceCode: z.string().min(1),
    provinceName: z.string().optional(),
    cityCode: z.string().min(1),
    cityName: z.string().optional(),
    districtCode: z.string().min(1),
    districtName: z.string().optional(),
    address: z.string().optional(),
    departmentName: z.string().optional()
  }),
  captchaId: z.string().min(1),
  captchaCode: z.string().min(1)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  captchaId: z.string().min(1),
  captchaCode: z.string().min(1)
});

const registerPrincipalSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  organizationId: z.string().uuid(),
  fullName: z.string().min(1),
  idType: z.string().min(1),
  idNumber: z.string().min(1),
  phone: z.string().min(1),
  isUnitLeader: z.boolean().default(false),
  isLegalRepresentative: z.boolean().default(false),
  captchaId: z.string().min(1),
  captchaCode: z.string().min(1)
});

const regionsQuerySchema = z.object({
  level: z.enum(["province", "city", "district"]),
  parentCode: z.string().optional()
});

const templatesQuerySchema = z.object({
  planCategory: z.string().optional()
});

const createDeclarationSchema = z.object({
  templateId: z.string().min(1),
  title: z.string().min(1),
  content: z.record(z.string(), z.unknown()).optional()
});

const updateDeclarationSchema = z.object({
  title: z.string().min(1).optional(),
  status: z.enum(["draft", "submitted", "accepted", "rejected"]).optional(),
  content: z.record(z.string(), z.unknown()).optional()
});

const uploadProfileMaterialSchema = z.object({
  fileName: z.string().min(1).max(200),
  mimeType: z.string().min(1).max(120),
  fileBase64: z.string().min(1)
});

const saveProfileSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  education: z.string().min(1).optional(),
  degree: z.string().min(1).optional(),
  isAcademician: z.boolean().optional(),
  idCardFrontUrl: z.string().url().optional(),
  idCardBackUrl: z.string().url().optional(),
  titleCertUrl: z.string().url().optional(),
  educationCertUrl: z.string().url().optional()
});
publicRouter.post("/organizations/register", async (req, res) => {
  const parsed = registerOrganizationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid registration payload",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  try {
    const data = await managementService.registerOrganization(
      {
        email: parsed.data.account.email,
        password: parsed.data.account.password,
        ...parsed.data.organization,
        captchaId: parsed.data.captchaId,
        captchaCode: parsed.data.captchaCode
      },
      isMockModeEnabled()
    );
    return res.status(201).json({
      code: "OK",
      message: "Organization registration submitted",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Organization registration failed", res);
  }
});

publicRouter.get("/organizations/approved", async (_req, res) => {
  try {
    const items = await managementService.listApprovedOrganizations(isMockModeEnabled());
    return res.status(200).json({
      code: "OK",
      message: "Approved organizations",
      data: {
        items
      },
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Load approved organizations failed", res);
  }
});

publicRouter.post("/auth/unit/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid login payload",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  try {
    const data = await managementService.loginUnit(parsed.data, isMockModeEnabled());
    return res.status(200).json({
      code: "OK",
      message: "Logged in",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Unit login failed", res);
  }
});

publicRouter.post("/auth/principal/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid login payload",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  try {
    const data = await managementService.loginPrincipal(parsed.data, isMockModeEnabled());
    return res.status(200).json({
      code: "OK",
      message: "Logged in",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Principal login failed", res);
  }
});

publicRouter.post("/principals/register", async (req, res) => {
  const parsed = registerPrincipalSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid principal payload",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  try {
    const data = await managementService.registerPrincipal(parsed.data, isMockModeEnabled());
    return res.status(201).json({
      code: "OK",
      message: "Principal registration submitted",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Principal registration failed", res);
  }
});

publicRouter.get("/profile", requirePortalAuth, async (req, res) => {
  const authReq = req as RequestWithPortalAuth;
  if (!authReq.portalUser) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      data: null,
      requestId: "local"
    });
  }

  try {
    const data = await managementService.getPortalProfile(
      authReq.portalUser.authUserId,
      authReq.portalUser.accountType,
      Boolean(authReq.portalUser.isMockToken)
    );

    return res.status(200).json({
      code: "OK",
      message: "Current profile",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Load profile failed", res);
  }
});

publicRouter.post("/profile/materials/upload", requirePortalAuth, async (req, res) => {
  const authReq = req as RequestWithPortalAuth;
  const parsed = uploadProfileMaterialSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid upload payload",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  if (!authReq.portalUser) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      data: null,
      requestId: "local"
    });
  }

  if (authReq.portalUser.accountType !== "principal") {
    return res.status(403).json({
      code: "FORBIDDEN",
      message: "Only principal accounts can upload profile materials",
      data: null,
      requestId: "local"
    });
  }

  try {
    const data = await managementService.uploadPrincipalMaterial(
      authReq.portalUser.authUserId,
      parsed.data,
      Boolean(authReq.portalUser.isMockToken)
    );
    return res.status(201).json({
      code: "OK",
      message: "Profile material uploaded",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Upload profile material failed", res);
  }
});

publicRouter.patch("/profile", requirePortalAuth, async (req, res) => {
  const authReq = req as RequestWithPortalAuth;
  const parsed = saveProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid profile payload",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  if (!authReq.portalUser) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      data: null,
      requestId: "local"
    });
  }

  if (authReq.portalUser.accountType !== "principal") {
    return res.status(403).json({
      code: "FORBIDDEN",
      message: "Only principal accounts can save profile",
      data: null,
      requestId: "local"
    });
  }

  try {
    const data = await managementService.savePortalPrincipalProfile(
      authReq.portalUser.authUserId,
      parsed.data,
      Boolean(authReq.portalUser.isMockToken)
    );
    return res.status(200).json({
      code: "OK",
      message: "Profile saved",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Save profile failed", res);
  }
});
publicRouter.get("/regions", async (req, res) => {
  const parsed = regionsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid query",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }

  try {
    const items = await managementService.listRegions(parsed.data.level, parsed.data.parentCode, isMockModeEnabled());
    return res.status(200).json({
      code: "OK",
      message: "Region options",
      data: {
        items
      },
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Load region options failed", res);
  }
});

publicRouter.get("/templates", async (req, res) => {
  const parsed = templatesQuerySchema.safeParse(req.query);
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
        planCategory: parsed.data.planCategory,
        publishedOnly: true
      },
      isMockModeEnabled()
    );
    return res.status(200).json({
      code: "OK",
      message: "Published templates",
      data: {
        items
      },
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Load templates failed", res);
  }
});

publicRouter.get("/declarations", requirePortalAuth, async (req, res) => {
  const authReq = req as RequestWithPortalAuth;
  if (!authReq.portalUser) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      data: null,
      requestId: "local"
    });
  }

  try {
    const items = await managementService.listDeclarations(authReq.portalUser.authUserId, Boolean(authReq.portalUser.isMockToken));
    return res.status(200).json({
      code: "OK",
      message: "Declarations",
      data: {
        items
      },
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Load declarations failed", res);
  }
});

publicRouter.post("/declarations", requirePortalAuth, async (req, res) => {
  const authReq = req as RequestWithPortalAuth;
  const parsed = createDeclarationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid declaration payload",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }
  if (!authReq.portalUser) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      data: null,
      requestId: "local"
    });
  }

  try {
    const data = await managementService.createDeclaration(
      authReq.portalUser.authUserId,
      parsed.data,
      Boolean(authReq.portalUser.isMockToken)
    );
    return res.status(201).json({
      code: "OK",
      message: "Declaration created",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Create declaration failed", res);
  }
});

publicRouter.put("/declarations/:id", requirePortalAuth, async (req, res) => {
  const authReq = req as RequestWithPortalAuth;
  const parsed = updateDeclarationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid declaration payload",
      data: parsed.error.flatten(),
      requestId: "local"
    });
  }
  if (!authReq.portalUser) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      data: null,
      requestId: "local"
    });
  }
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
    const data = await managementService.updateDeclaration(
      declarationId,
      authReq.portalUser.authUserId,
      parsed.data,
      Boolean(authReq.portalUser.isMockToken)
    );
    return res.status(200).json({
      code: "OK",
      message: "Declaration updated",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Update declaration failed", res);
  }
});

publicRouter.delete("/declarations/:id", requirePortalAuth, async (req, res) => {
  const authReq = req as RequestWithPortalAuth;
  if (!authReq.portalUser) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      data: null,
      requestId: "local"
    });
  }
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
    await managementService.deleteDeclaration(declarationId, authReq.portalUser.authUserId, Boolean(authReq.portalUser.isMockToken));
    return res.status(200).json({
      code: "OK",
      message: "Declaration deleted",
      data: { id: declarationId },
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Delete declaration failed", res);
  }
});

publicRouter.get("/declarations/:id/download", requirePortalAuth, async (req, res) => {
  const authReq = req as RequestWithPortalAuth;
  if (!authReq.portalUser) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      data: null,
      requestId: "local"
    });
  }
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
    const data = await managementService.downloadDeclaration(
      declarationId,
      authReq.portalUser.authUserId,
      Boolean(authReq.portalUser.isMockToken)
    );
    return res.status(200).json({
      code: "OK",
      message: "Declaration download payload",
      data,
      requestId: "local"
    });
  } catch (error) {
    return wrapServiceError(error, "Download declaration failed", res);
  }
});



