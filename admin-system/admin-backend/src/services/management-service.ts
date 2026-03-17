import { randomInt, randomUUID } from "node:crypto";
import { supabaseAdmin, supabaseAnon } from "../lib/supabase";

export class ServiceError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type CaptchaRow = {
  captchaId: string;
  code: string;
  expiresAt: string;
  consumedAt?: string;
};

type OrganizationStatus = "pending" | "approved" | "rejected";
type TemplateStatus = "draft" | "published" | "archived";
type DeclarationStatus = "draft" | "submitted" | "accepted" | "rejected";

type OrgRow = {
  id: string;
  unitAdminAuthUserId: string;
  unitAdminEmail: string;
  name: string;
  socialCreditCode?: string;
  contactName: string;
  contactPhone: string;
  provinceCode: string;
  provinceName: string;
  cityCode: string;
  cityName: string;
  districtCode: string;
  districtName: string;
  address?: string;
  departmentName?: string;
  status: OrganizationStatus;
  reviewComment?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
};

type PrincipalRow = {
  id: string;
  authUserId: string;
  email: string;
  organizationId: string;
  fullName: string;
  idType: string;
  idNumber: string;
  phone: string;
  isUnitLeader: boolean;
  isLegalRepresentative: boolean;
  title?: string;
  education?: string;
  degree?: string;
  isAcademician?: boolean;
  idCardFrontUrl?: string;
  idCardBackUrl?: string;
  titleCertUrl?: string;
  educationCertUrl?: string;
  profileSubmittedAt?: string;
  status: "active" | "disabled";
  createdAt: string;
  updatedAt: string;
};

type TemplateRow = {
  id: string;
  planCategory: string;
  projectCategory: string;
  title: string;
  sourceName?: string;
  guideUnit?: string;
  contactPhone?: string;
  startAt: string;
  endAt: string;
  fileUrl?: string;
  status: TemplateStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

type DeclarationRow = {
  id: string;
  authUserId: string;
  organizationId?: string;
  templateId: string;
  title: string;
  status: DeclarationStatus;
  content: Record<string, unknown>;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
};

type RegionRow = {
  level: "province" | "city" | "district";
  code: string;
  name: string;
  parentCode?: string;
};

type PrincipalProfileMetadata = {
  title?: string;
  education?: string;
  degree?: string;
  isAcademician?: boolean;
  idCardFrontUrl?: string;
  idCardBackUrl?: string;
  titleCertUrl?: string;
  educationCertUrl?: string;
  profileSubmittedAt?: string;
};

const mockCaptchas = new Map<string, CaptchaRow>();
const mockOrganizations: OrgRow[] = [];
const mockPrincipals: PrincipalRow[] = [];
const mockTemplates: TemplateRow[] = [];
const mockDeclarations: DeclarationRow[] = [];
const mockCredentials = new Map<string, { password: string; authUserId: string; accountType: "unit" | "principal" }>();

const mockRegions: RegionRow[] = [
  { level: "province", code: "11", name: "Beijing" },
  { level: "province", code: "22", name: "Jilin" },
  { level: "province", code: "31", name: "Shanghai" },
  { level: "city", code: "1101", name: "Beijing City", parentCode: "11" },
  { level: "city", code: "2201", name: "Changchun", parentCode: "22" },
  { level: "city", code: "2202", name: "Jilin City", parentCode: "22" },
  { level: "city", code: "3101", name: "Shanghai City", parentCode: "31" },
  { level: "district", code: "110101", name: "Dongcheng", parentCode: "1101" },
  { level: "district", code: "220102", name: "Nanguan", parentCode: "2201" },
  { level: "district", code: "220104", name: "Chaoyang", parentCode: "2201" },
  { level: "district", code: "310101", name: "Huangpu", parentCode: "3101" }
];

const templateFilesBucket = process.env.TEMPLATE_FILES_BUCKET ?? "template-files";
const principalMaterialsBucket = process.env.PRINCIPAL_MATERIALS_BUCKET ?? "principal-materials";
let templateBucketReady = false;
let principalMaterialsBucketReady = false;

const nowIso = () => new Date().toISOString();

const captchaCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 4; i += 1) {
    result += chars[randomInt(0, chars.length)];
  }
  return result;
};

const captchaImage = (code: string) => {
  const lines = Array.from({ length: 5 })
    .map(
      () =>
        `<line x1="${randomInt(0, 120)}" y1="${randomInt(0, 40)}" x2="${randomInt(0, 120)}" y2="${randomInt(
          0,
          40
        )}" stroke="rgba(0,0,0,.25)" stroke-width="1"/>`
    )
    .join("");
  const glyphs = code
    .split("")
    .map(
      (char, index) =>
        `<text x="${18 + index * 24}" y="28" font-size="24" font-family="monospace" transform="rotate(${randomInt(
          -12,
          12
        )}, ${18 + index * 24}, 20)" fill="hsl(${randomInt(0, 360)}, 65%, 35%)">${char}</text>`
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40"><rect width="120" height="40" fill="#f3f4f6"/>${lines}${glyphs}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

const assertCaptcha = (row: CaptchaRow | undefined, code: string) => {
  if (!row) {
    throw new ServiceError(422, "CAPTCHA_INVALID", "Captcha does not exist or has expired");
  }
  if (row.consumedAt) {
    throw new ServiceError(422, "CAPTCHA_INVALID", "Captcha has already been used");
  }
  if (new Date(row.expiresAt).getTime() < Date.now()) {
    throw new ServiceError(422, "CAPTCHA_EXPIRED", "Captcha has expired");
  }
  if (row.code.toUpperCase() !== code.trim().toUpperCase()) {
    throw new ServiceError(422, "CAPTCHA_MISMATCH", "Captcha code is incorrect");
  }
};

const requireApprovedOrg = (org: OrgRow | undefined) => {
  if (!org) {
    throw new ServiceError(403, "FORBIDDEN", "Only registered organizations can log in");
  }
  if (org.status !== "approved") {
    throw new ServiceError(403, "ORG_NOT_APPROVED", "Organization review is not approved");
  }
};

const mapRegionName = async (code: string) => {
  const { data } = await supabaseAdmin.from("region_catalog").select("name").eq("code", code).maybeSingle();
  return data?.name ?? code;
};

const authEmailConflictPatterns = ["already been registered", "already registered", "email_exists"];

const isAuthEmailConflictError = (message: string | undefined) => {
  if (!message) {
    return false;
  }
  const normalized = message.toLowerCase();
  return authEmailConflictPatterns.some((pattern) => normalized.includes(pattern));
};

const findAuthUserByEmail = async (email: string) => {
  const target = email.trim().toLowerCase();
  const perPage = 200;

  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query auth users failed");
    }

    const users = data?.users ?? [];
    const matched = users.find((user: any) => (user.email ?? "").toLowerCase() === target);
    if (matched) {
      return matched;
    }
    if (users.length < perPage) {
      break;
    }
  }

  return null;
};

const resolvePrincipalRoleType = (row: { is_unit_leader?: boolean; is_legal_representative?: boolean }) =>
  row.is_unit_leader || row.is_legal_representative ? "leader" : "staff";

const resolveMockPrincipalByAuthUserId = (authUserId: string) => {
  const direct = mockPrincipals.find((row) => row.authUserId === authUserId);
  if (direct) {
    return direct;
  }
  if (!mockPrincipals.length) {
    return undefined;
  }
  return mockPrincipals[mockPrincipals.length - 1];
};
const ensureTemplateBucket = async () => {
  if (templateBucketReady) {
    return;
  }
  const { data: bucket, error: getBucketError } = await supabaseAdmin.storage.getBucket(templateFilesBucket);
  if (getBucketError && !getBucketError.message?.toLowerCase().includes("not found")) {
    throw new ServiceError(500, "INTERNAL_ERROR", "Template file storage is unavailable");
  }
  if (!bucket) {
    const { error: createBucketError } = await supabaseAdmin.storage.createBucket(templateFilesBucket, {
      public: true,
      fileSizeLimit: "20MB"
    });
    if (createBucketError && !createBucketError.message?.toLowerCase().includes("already exists")) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Template file storage initialization failed");
    }
  } else if ((bucket as any).public !== true) {
    const { error: updateBucketError } = await supabaseAdmin.storage.updateBucket(templateFilesBucket, {
      public: true,
      fileSizeLimit: "20MB"
    });
    if (updateBucketError) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Template file storage initialization failed");
    }
  }
  templateBucketReady = true;
};

const ensurePrincipalMaterialsBucket = async () => {
  if (principalMaterialsBucketReady) {
    return;
  }
  const { data: bucket, error: getBucketError } = await supabaseAdmin.storage.getBucket(principalMaterialsBucket);
  if (getBucketError && !getBucketError.message?.toLowerCase().includes("not found")) {
    throw new ServiceError(500, "INTERNAL_ERROR", "Principal material storage is unavailable");
  }
  if (!bucket) {
    const { error: createBucketError } = await supabaseAdmin.storage.createBucket(principalMaterialsBucket, {
      public: true,
      fileSizeLimit: "20MB"
    });
    if (createBucketError && !createBucketError.message?.toLowerCase().includes("already exists")) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Principal material storage initialization failed");
    }
  } else if ((bucket as any).public !== true) {
    const { error: updateBucketError } = await supabaseAdmin.storage.updateBucket(principalMaterialsBucket, {
      public: true,
      fileSizeLimit: "20MB"
    });
    if (updateBucketError) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Principal material storage initialization failed");
    }
  }
  principalMaterialsBucketReady = true;
};
const normalizeTemplateFileName = (fileName: string) => {
  const trimmed = fileName.trim();
  const collapsed = trimmed.replace(/\s+/g, "-");
  return collapsed.replace(/[^a-zA-Z0-9.\-_]/g, "_");
};
const pickString = (value: unknown) => (typeof value === "string" && value.trim() ? value : undefined);
const pickBoolean = (value: unknown) => (typeof value === "boolean" ? value : undefined);

const readPrincipalProfileMetadata = (userMetadata: any): PrincipalProfileMetadata => {
  const raw = userMetadata?.principal_profile;
  if (!raw || typeof raw !== "object") {
    return {};
  }

  return {
    title: pickString(raw.title),
    education: pickString(raw.education),
    degree: pickString(raw.degree),
    isAcademician: pickBoolean(raw.is_academician ?? raw.isAcademician),
    idCardFrontUrl: pickString(raw.id_card_front_url ?? raw.idCardFrontUrl),
    idCardBackUrl: pickString(raw.id_card_back_url ?? raw.idCardBackUrl),
    titleCertUrl: pickString(raw.title_cert_url ?? raw.titleCertUrl),
    educationCertUrl: pickString(raw.education_cert_url ?? raw.educationCertUrl),
    profileSubmittedAt: pickString(raw.profile_submitted_at ?? raw.profileSubmittedAt)
  };
};

const loadAuthPrincipalMetadataMap = async (authUserIds: string[]) => {
  const targetIds = Array.from(new Set(authUserIds.filter(Boolean)));
  const target = new Set(targetIds);
  const map = new Map<string, PrincipalProfileMetadata>();
  if (!target.size) {
    return map;
  }

  const perPage = 200;
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query auth users failed");
    }

    const users = data?.users ?? [];
    for (const user of users) {
      if (target.has(user.id)) {
        map.set(user.id, readPrincipalProfileMetadata((user as any).user_metadata));
      }
    }

    if (map.size >= target.size || users.length < perPage) {
      break;
    }
  }

  return map;
};

const savePrincipalProfileMetadataToAuth = async (authUserId: string, payload: PrincipalProfileMetadata) => {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(authUserId);
  if (error || !data?.user) {
    return;
  }

  const existingUserMetadata = ((data.user as any).user_metadata ?? {}) as Record<string, unknown>;
  const existingPrincipal = readPrincipalProfileMetadata(existingUserMetadata);
  const nextPrincipal = {
    title: payload.title ?? existingPrincipal.title ?? null,
    education: payload.education ?? existingPrincipal.education ?? null,
    degree: payload.degree ?? existingPrincipal.degree ?? null,
    is_academician: payload.isAcademician ?? existingPrincipal.isAcademician ?? false,
    id_card_front_url: payload.idCardFrontUrl ?? existingPrincipal.idCardFrontUrl ?? null,
    id_card_back_url: payload.idCardBackUrl ?? existingPrincipal.idCardBackUrl ?? null,
    title_cert_url: payload.titleCertUrl ?? existingPrincipal.titleCertUrl ?? null,
    education_cert_url: payload.educationCertUrl ?? existingPrincipal.educationCertUrl ?? null,
    profile_submitted_at: payload.profileSubmittedAt ?? existingPrincipal.profileSubmittedAt ?? null
  };

  await supabaseAdmin.auth.admin.updateUserById(authUserId, {
    user_metadata: {
      ...existingUserMetadata,
      principal_profile: nextPrincipal
    }
  });
};

const mapTemplateRow = (row: any) => ({
  id: row.id,
  planCategory: row.plan_category,
  projectCategory: row.project_category,
  title: row.title,
  sourceName: row.source_name ?? undefined,
  guideUnit: row.guide_unit ?? undefined,
  contactPhone: row.contact_phone ?? undefined,
  startAt: row.start_at,
  endAt: row.end_at,
  fileUrl: row.file_url ?? undefined,
  status: row.status,
  publishedAt: row.published_at ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});


const declarationFieldLabelMap: Record<string, string> = {
  form: "填报信息",
  basic: "基础信息",
  organization: "单位信息",
  overview: "项目概述",
  budget: "经费预算",
  progress: "计划进度",
  projectName: "项目名称",
  keyword: "关键词",
  researchType: "研究类型",
  fundingSource: "资金来源",
  guideUnit: "管理单位",
  contactName: "联系人",
  contactPhone: "联系电话",
  summary: "内容摘要",
  target: "项目目标",
  milestone: "阶段计划",
  total: "总预算",
  provinceGrant: "省财政拨款",
  otherFund: "其他经费",
  templateSnapshot: "模板信息",
  planCategory: "计划类别",
  projectCategory: "项目类别",
  attachment: "附件",
  fileName: "附件文件名",
  uploadedAt: "上传时间"
};

const declarationStatusTextMap: Record<string, string> = {
  draft: "草稿",
  submitted: "已提交",
  accepted: "已通过",
  rejected: "已退回"
};

const toDeclarationFieldLabel = (key: string) => declarationFieldLabelMap[key] ?? key;

const sanitizeFileName = (value: string) => {
  const fallback = "declaration";
  const cleaned = value.replace(/[\\/:*?"<>|]/g, "_").trim();
  return cleaned || fallback;
};

const encodeUtf16BeHex = (text: string) => {
  const utf16le = Buffer.from(text, "utf16le");
  const utf16be = Buffer.alloc(utf16le.length);
  for (let idx = 0; idx < utf16le.length; idx += 2) {
    utf16be[idx] = utf16le[idx + 1];
    utf16be[idx + 1] = utf16le[idx];
  }
  return `FEFF${utf16be.toString("hex").toUpperCase()}`;
};

const wrapTextForPdf = (text: string, maxChars = 30) => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return ["-"];
  }
  const lines: string[] = [];
  for (let cursor = 0; cursor < normalized.length; cursor += maxChars) {
    lines.push(normalized.slice(cursor, cursor + maxChars));
  }
  return lines;
};

const flattenDeclarationEntries = (value: unknown, prefix = ""): Array<{ key: string; value: string }> => {
  if (value == null) {
    return [];
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return [{ key: prefix || "值", value: String(value) }];
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      return [{ key: prefix || "列表", value: "[]" }];
    }
    return value.flatMap((item, index) => flattenDeclarationEntries(item, `${prefix}[${index + 1}]`));
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (!keys.length) {
      return [{ key: prefix || "对象", value: "{}" }];
    }

    return keys.flatMap((rawKey) => {
      const nextPrefix = prefix ? `${prefix} / ${toDeclarationFieldLabel(rawKey)}` : toDeclarationFieldLabel(rawKey);
      return flattenDeclarationEntries(obj[rawKey], nextPrefix);
    });
  }

  return [{ key: prefix || "值", value: String(value) }];
};

const buildSimplePdf = (title: string, lines: string[]) => {
  const safeLines = lines.length ? lines : ["-"];
  const linesPerPage = 34;
  const chunks: string[][] = [];
  for (let offset = 0; offset < safeLines.length; offset += linesPerPage) {
    chunks.push(safeLines.slice(offset, offset + linesPerPage));
  }
  if (!chunks.length) {
    chunks.push(["-"]);
  }

  let nextObjectId = 1;
  const catalogObjectId = nextObjectId++;
  const pagesObjectId = nextObjectId++;
  const fontObjectId = nextObjectId++;

  const objects: Array<{ id: number; content: string }> = [];
  const pageObjectIds: number[] = [];

  for (let pageIndex = 0; pageIndex < chunks.length; pageIndex += 1) {
    const chunk = chunks[pageIndex];
    const contentObjectId = nextObjectId++;
    const pageObjectId = nextObjectId++;

    const streamLines: string[] = [
      "BT",
      "/F1 16 Tf",
      "50 800 Td",
      `<${encodeUtf16BeHex(title)}> Tj`,
      "0 -28 Td",
      "/F1 11 Tf",
      "14 TL",
      `<${encodeUtf16BeHex(`页码: ${pageIndex + 1}/${chunks.length}`)}> Tj`,
      "T*"
    ];

    for (const line of chunk) {
      streamLines.push(`<${encodeUtf16BeHex(line)}> Tj`);
      streamLines.push("T*");
    }

    streamLines.push("ET");
    const streamContent = streamLines.join("\n");

    objects.push({
      id: contentObjectId,
      content: `<< /Length ${Buffer.byteLength(streamContent, "utf8")} >>\nstream\n${streamContent}\nendstream`
    });
    objects.push({
      id: pageObjectId,
      content: `<< /Type /Page /Parent ${pagesObjectId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`
    });

    pageObjectIds.push(pageObjectId);
  }

  objects.push({
    id: fontObjectId,
    content: "<< /Type /Font /Subtype /Type0 /BaseFont /STSong-Light /Encoding /UniGB-UCS2-H >>"
  });
  objects.push({
    id: pagesObjectId,
    content: `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`
  });
  objects.push({
    id: catalogObjectId,
    content: `<< /Type /Catalog /Pages ${pagesObjectId} 0 R >>`
  });

  objects.sort((left, right) => left.id - right.id);

  let pdf = "%PDF-1.4\n%1234\n";
  const offsets: number[] = [0];
  let currentOffset = Buffer.byteLength(pdf, "utf8");

  for (const objectItem of objects) {
    offsets[objectItem.id] = currentOffset;
    const objectText = `${objectItem.id} 0 obj\n${objectItem.content}\nendobj\n`;
    pdf += objectText;
    currentOffset += Buffer.byteLength(objectText, "utf8");
  }

  const xrefOffset = currentOffset;
  let xref = `xref\n0 ${nextObjectId}\n0000000000 65535 f \n`;
  for (let idx = 1; idx < nextObjectId; idx += 1) {
    xref += `${String(offsets[idx] ?? 0).padStart(10, "0")} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size ${nextObjectId} /Root ${catalogObjectId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(`${pdf}${xref}${trailer}`, "utf8");
};

const findTemplateTitleById = async (templateId: string, useMock: boolean) => {
  if (!templateId) {
    return undefined;
  }
  if (useMock) {
    return mockTemplates.find((item) => item.id === templateId)?.title;
  }

  const { data, error } = await supabaseAdmin.from("application_templates").select("title").eq("id", templateId).maybeSingle();
  if (error) {
    return undefined;
  }
  return data?.title ?? undefined;
};

const buildDeclarationDownloadPayload = async (
  declaration: {
    id: string;
    title: string;
    status: string;
    templateId: string;
    content?: Record<string, unknown>;
  },
  useMock: boolean
) => {
  const content = (declaration.content ?? {}) as Record<string, unknown>;
  const fillDataRaw = content.form && typeof content.form === "object" ? (content.form as Record<string, unknown>) : content;
  const flattened = flattenDeclarationEntries(fillDataRaw);
  const templateTitle = await findTemplateTitleById(declaration.templateId, useMock);

  const lines: string[] = [];
  lines.push(...wrapTextForPdf(`申报书标题: ${declaration.title}`));
  lines.push(...wrapTextForPdf(`申报状态: ${declarationStatusTextMap[declaration.status] ?? declaration.status}`));
  if (templateTitle) {
    lines.push(...wrapTextForPdf(`申报模板: ${templateTitle}`));
  }

  const attachment = content.attachment;
  if (attachment && typeof attachment === "object") {
    const fileName = (attachment as Record<string, unknown>).fileName;
    if (typeof fileName === "string" && fileName.trim()) {
      lines.push(...wrapTextForPdf(`附件文件: ${fileName.trim()}`));
    }
  }

  if (!flattened.length) {
    lines.push(...wrapTextForPdf("填报内容: 空"));
  } else {
    lines.push(...wrapTextForPdf("填报内容:"));
    for (const item of flattened) {
      lines.push(...wrapTextForPdf(`${item.key}: ${item.value}`));
    }
  }

  const pdfBuffer = buildSimplePdf(declaration.title, lines);
  const safeName = sanitizeFileName(declaration.title);

  return {
    id: declaration.id,
    fileName: `${safeName}.pdf`,
    mimeType: "application/pdf",
    fileBase64: pdfBuffer.toString("base64"),
    content: JSON.stringify(content, null, 2)
  };
};
export const managementService = {
  issueCaptcha: async (useMock: boolean) => {
    const id = randomUUID();
    const code = captchaCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    if (useMock) {
      mockCaptchas.set(id, { captchaId: id, code, expiresAt });
    } else {
      const { error } = await supabaseAdmin.from("captchas").insert({ captcha_id: id, code, expires_at: expiresAt });
      if (error) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Captcha generation failed");
      }
    }

    return {
      captchaId: id,
      imageData: captchaImage(code),
      expiresInSeconds: 300,
      code: process.env.NODE_ENV === "test" ? code : undefined
    };
  },

  verifyCaptcha: async (captchaId: string, code: string, useMock: boolean) => {
    if (useMock) {
      const row = mockCaptchas.get(captchaId);
      assertCaptcha(row, code);
      if (row) {
        row.consumedAt = nowIso();
      }
      return true;
    }

    const { data, error } = await supabaseAdmin
      .from("captchas")
      .select("captcha_id,code,expires_at,consumed_at")
      .eq("captcha_id", captchaId)
      .maybeSingle();
    if (error) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Captcha verification failed");
    }

    assertCaptcha(
      data
        ? {
            captchaId: data.captcha_id,
            code: data.code,
            expiresAt: data.expires_at,
            consumedAt: data.consumed_at ?? undefined
          }
        : undefined,
      code
    );
    await supabaseAdmin.from("captchas").update({ consumed_at: nowIso() }).eq("captcha_id", captchaId);
    return true;
  },

  registerOrganization: async (
    payload: {
      email: string;
      password: string;
      name: string;
      socialCreditCode?: string;
      contactName: string;
      contactPhone: string;
      provinceCode: string;
      provinceName?: string;
      cityCode: string;
      cityName?: string;
      districtCode: string;
      districtName?: string;
      address?: string;
      departmentName?: string;
      captchaId: string;
      captchaCode: string;
    },
    useMock: boolean
  ) => {
    await managementService.verifyCaptcha(payload.captchaId, payload.captchaCode, useMock);

    if (useMock) {
      if (mockCredentials.has(payload.email)) {
        throw new ServiceError(409, "CONFLICT", "Email is already registered");
      }
      const authUserId = randomUUID();
      const row: OrgRow = {
        id: randomUUID(),
        unitAdminAuthUserId: authUserId,
        unitAdminEmail: payload.email,
        name: payload.name,
        socialCreditCode: payload.socialCreditCode,
        contactName: payload.contactName,
        contactPhone: payload.contactPhone,
        provinceCode: payload.provinceCode,
        provinceName: payload.provinceName ?? payload.provinceCode,
        cityCode: payload.cityCode,
        cityName: payload.cityName ?? payload.cityCode,
        districtCode: payload.districtCode,
        districtName: payload.districtName ?? payload.districtCode,
        address: payload.address,
        departmentName: payload.departmentName,
        status: "pending",
        createdAt: nowIso(),
        updatedAt: nowIso()
      };
      mockOrganizations.push(row);
      mockCredentials.set(payload.email, { password: payload.password, authUserId, accountType: "unit" });
      return row;
    }

    const authPayload = {
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: { account_type: "unit" }
    };

    const createAuth = await supabaseAdmin.auth.admin.createUser(authPayload);
    let authUserId = createAuth.data?.user?.id;
    if (createAuth.error || !authUserId) {
      const canRecover = isAuthEmailConflictError(createAuth.error?.message);
      const existingAuthUser = canRecover ? await findAuthUserByEmail(payload.email) : null;

      if (!existingAuthUser) {
        throw new ServiceError(409, "CONFLICT", createAuth.error?.message ?? "Unit account creation failed");
      }

      const { data: existingOrg, error: existingOrgError } = await supabaseAdmin
        .from("organizations")
        .select("id")
        .eq("unit_admin_auth_user_id", existingAuthUser.id)
        .maybeSingle();
      if (existingOrgError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Checking existing organization failed");
      }
      if (existingOrg) {
        throw new ServiceError(409, "CONFLICT", "Email is already registered");
      }

      const { data: existingPrincipal, error: existingPrincipalError } = await supabaseAdmin
        .from("principal_profiles")
        .select("*")
        .eq("auth_user_id", existingAuthUser.id)
        .maybeSingle();
      if (existingPrincipalError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Checking existing principal failed");
      }
      if (existingPrincipal) {
        throw new ServiceError(409, "ACCOUNT_TYPE_CONFLICT", "Email is already used by a principal account");
      }

      const { data: existingAdmin, error: existingAdminError } = await supabaseAdmin
        .from("admin_users")
        .select("id")
        .eq("auth_user_id", existingAuthUser.id)
        .maybeSingle();
      if (existingAdminError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Checking existing admin failed");
      }
      if (existingAdmin) {
        throw new ServiceError(409, "ACCOUNT_TYPE_CONFLICT", "Email is already used by an admin account");
      }

      const existingAccountType = (existingAuthUser.user_metadata as any)?.account_type;
      if (existingAccountType && existingAccountType !== "unit") {
        throw new ServiceError(409, "ACCOUNT_TYPE_CONFLICT", "Email is already used by another account type");
      }

      const deleteAuth = await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id);
      if (deleteAuth.error) {
        throw new ServiceError(409, "CONFLICT", "Email is already registered");
      }

      const recreatedAuth = await supabaseAdmin.auth.admin.createUser(authPayload);
      authUserId = recreatedAuth.data?.user?.id;
      if (recreatedAuth.error || !authUserId) {
        throw new ServiceError(409, "CONFLICT", recreatedAuth.error?.message ?? "Unit account creation failed");
      }
    }

    const { data, error } = await supabaseAdmin
      .from("organizations")
      .insert({
        unit_admin_auth_user_id: authUserId,
        unit_admin_email: payload.email,
        name: payload.name,
        social_credit_code: payload.socialCreditCode,
        contact_name: payload.contactName,
        contact_phone: payload.contactPhone,
        province_code: payload.provinceCode,
        province_name: payload.provinceName ?? (await mapRegionName(payload.provinceCode)),
        city_code: payload.cityCode,
        city_name: payload.cityName ?? (await mapRegionName(payload.cityCode)),
        district_code: payload.districtCode,
        district_name: payload.districtName ?? (await mapRegionName(payload.districtCode)),
        address: payload.address,
        department_name: payload.departmentName,
        status: "pending"
      })
      .select("id,name,status,created_at")
      .single();
    if (error || !data) {
      await supabaseAdmin.auth.admin.deleteUser(authUserId);
      throw new ServiceError(500, "INTERNAL_ERROR", "Saving unit information failed");
    }

    return { id: data.id, name: data.name, status: data.status, createdAt: data.created_at };
  },

  listOrganizations: async (status: string | undefined, useMock: boolean) => {
    if (useMock) {
      return status ? mockOrganizations.filter((row) => row.status === status) : mockOrganizations;
    }

    let query = supabaseAdmin
      .from("organizations")
      .select(
        "id,name,status,unit_admin_email,contact_name,contact_phone,social_credit_code,department_name,province_name,city_name,district_name,address,review_comment,reviewed_at,created_at,updated_at"
      )
      .order("created_at", { ascending: false });
    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query organizations failed");
    }
    return (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      status: row.status,
      unitAdminEmail: row.unit_admin_email,
      contactName: row.contact_name,
      contactPhone: row.contact_phone,
      socialCreditCode: row.social_credit_code,
      departmentName: row.department_name,
      provinceName: row.province_name,
      cityName: row.city_name,
      districtName: row.district_name,
      address: row.address,
      reviewComment: row.review_comment ?? undefined,
      reviewedAt: row.reviewed_at ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  },

  reviewOrganization: async (
    organizationId: string,
    decision: "approved" | "rejected",
    comment: string | undefined,
    reviewerAuthUserId: string,
    useMock: boolean
  ) => {
    if (useMock) {
      const target = mockOrganizations.find((row) => row.id === organizationId);
      if (!target) {
        throw new ServiceError(404, "NOT_FOUND", "Organization not found");
      }
      if (target.status !== "pending") {
        throw new ServiceError(409, "INVALID_STATE", "Organization has already been reviewed");
      }
      target.status = decision;
      target.reviewComment = comment;
      target.reviewedAt = nowIso();
      target.updatedAt = nowIso();
      return target;
    }

    const { data: reviewer } = await supabaseAdmin
      .from("admin_users")
      .select("id")
      .eq("auth_user_id", reviewerAuthUserId)
      .maybeSingle();
    const reviewTime = nowIso();
    const { data, error } = await supabaseAdmin
      .from("organizations")
      .update({
        status: decision,
        review_comment: comment,
        reviewed_by: reviewer?.id ?? null,
        reviewed_at: reviewTime,
        updated_at: reviewTime
      })
      .eq("id", organizationId)
      .eq("status", "pending")
      .select("id,name,status,review_comment,reviewed_at,updated_at")
      .maybeSingle();

    if (error) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Review organization failed");
    }

    if (!data) {
      const { data: existingOrg, error: existingOrgError } = await supabaseAdmin
        .from("organizations")
        .select("id")
        .eq("id", organizationId)
        .maybeSingle();
      if (existingOrgError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Review organization failed");
      }
      if (!existingOrg) {
        throw new ServiceError(404, "NOT_FOUND", "Organization not found");
      }
      throw new ServiceError(409, "INVALID_STATE", "Organization has already been reviewed");
    }

    return {
      id: data.id,
      name: data.name,
      status: data.status,
      reviewComment: data.review_comment ?? undefined,
      reviewedAt: data.reviewed_at ?? undefined,
      updatedAt: data.updated_at
    };
  },

  listApprovedOrganizations: async (useMock: boolean) => {
    if (useMock) {
      return mockOrganizations.filter((row) => row.status === "approved").map((row) => ({ id: row.id, name: row.name }));
    }
    const { data, error } = await supabaseAdmin
      .from("organizations")
      .select("id,name")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query approved organizations failed");
    }
    return (data ?? []).map((row: any) => ({ id: row.id, name: row.name }));
  },

  listPrincipalProfiles: async (
    options: {
      roleType?: "all" | "leader" | "staff";
      status?: "active" | "disabled";
    },
    useMock: boolean
  ) => {
    const roleType = options.roleType ?? "all";

    if (useMock) {
      let items = [...mockPrincipals];
      if (options.status) {
        items = items.filter((row) => row.status === options.status);
      }
      if (roleType !== "all") {
        items = items.filter((row) => (row.isUnitLeader || row.isLegalRepresentative ? "leader" : "staff") === roleType);
      }
      return items.map((row) => {
        const organization = mockOrganizations.find((org) => org.id === row.organizationId);
        return {
          id: row.id,
          authUserId: row.authUserId,
          email: row.email,
          organizationId: row.organizationId,
          organizationName: organization?.name ?? row.organizationId,
          organizationStatus: organization?.status ?? "unknown",
          fullName: row.fullName,
          idType: row.idType,
          idNumber: row.idNumber,
          phone: row.phone,
          isUnitLeader: row.isUnitLeader,
          isLegalRepresentative: row.isLegalRepresentative,
          roleType: row.isUnitLeader || row.isLegalRepresentative ? "leader" : "staff",
          status: row.status,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt
        };
      });
    }

    let query = supabaseAdmin
      .from("principal_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (options.status) {
      query = query.eq("status", options.status);
    }

    const { data, error } = await query;
    if (error) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query principal profiles failed");
    }

    let principalRows = data ?? [];
    if (roleType !== "all") {
      principalRows = principalRows.filter((row: any) => resolvePrincipalRoleType(row) === roleType);
    }

    const organizationIds = Array.from(new Set(principalRows.map((row: any) => row.organization_id).filter(Boolean)));
    const organizationMap = new Map<string, { name: string; status: string }>();
    if (organizationIds.length) {
      const { data: organizations, error: orgError } = await supabaseAdmin
        .from("organizations")
        .select("id,name,status")
        .in("id", organizationIds);
      if (orgError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Query organizations failed");
      }
      for (const org of organizations ?? []) {
        organizationMap.set(org.id, { name: org.name, status: org.status });
      }
    }

    return principalRows.map((row: any) => {
      const organization = organizationMap.get(row.organization_id);
      return {
        id: row.id,
        authUserId: row.auth_user_id,
        email: row.email,
        organizationId: row.organization_id,
        organizationName: organization?.name ?? row.organization_id,
        organizationStatus: organization?.status ?? "unknown",
        fullName: row.full_name,
        idType: row.id_type,
        idNumber: row.id_number,
        phone: row.phone,
        isUnitLeader: row.is_unit_leader,
        isLegalRepresentative: row.is_legal_representative,
        roleType: resolvePrincipalRoleType(row),
        status: (row.status ?? "active") as "active" | "disabled",
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    });
  },

  updatePrincipalStatus: async (
    principalId: string,
    status: "active" | "disabled",
    useMock: boolean
  ) => {
    if (useMock) {
      const target = mockPrincipals.find((row) => row.id === principalId);
      if (!target) {
        throw new ServiceError(404, "NOT_FOUND", "Principal profile not found");
      }
      target.status = status;
      target.updatedAt = nowIso();
      const organization = mockOrganizations.find((org) => org.id === target.organizationId);
      return {
        id: target.id,
        authUserId: target.authUserId,
        email: target.email,
        organizationId: target.organizationId,
        organizationName: organization?.name ?? target.organizationId,
        organizationStatus: organization?.status ?? "unknown",
        fullName: target.fullName,
        idType: target.idType,
        idNumber: target.idNumber,
        phone: target.phone,
        isUnitLeader: target.isUnitLeader,
        isLegalRepresentative: target.isLegalRepresentative,
        roleType: target.isUnitLeader || target.isLegalRepresentative ? "leader" : "staff",
        status: target.status,
        createdAt: target.createdAt,
        updatedAt: target.updatedAt
      };
    }

    const { data, error } = await supabaseAdmin
      .from("principal_profiles")
      .update({ status, updated_at: nowIso() })
      .eq("id", principalId)
      .select(
        "*"
      )
      .maybeSingle();

    if (error) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Update principal status failed");
    }
    if (!data) {
      throw new ServiceError(404, "NOT_FOUND", "Principal profile not found");
    }

    const { data: organization } = await supabaseAdmin
      .from("organizations")
      .select("id,name,status")
      .eq("id", data.organization_id)
      .maybeSingle();

    return {
      id: data.id,
      authUserId: data.auth_user_id,
      email: data.email,
      organizationId: data.organization_id,
      organizationName: organization?.name ?? data.organization_id,
      organizationStatus: organization?.status ?? "unknown",
      fullName: data.full_name,
      idType: data.id_type,
      idNumber: data.id_number,
      phone: data.phone,
      isUnitLeader: data.is_unit_leader,
      isLegalRepresentative: data.is_legal_representative,
      roleType: resolvePrincipalRoleType(data),
      status: (data.status ?? "active") as "active" | "disabled",
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  registerPrincipal: async (
    payload: {
      email: string;
      password: string;
      organizationId: string;
      fullName: string;
      idType: string;
      idNumber: string;
      phone: string;
      isUnitLeader: boolean;
      isLegalRepresentative: boolean;
      captchaId: string;
      captchaCode: string;
    },
    useMock: boolean
  ) => {
    await managementService.verifyCaptcha(payload.captchaId, payload.captchaCode, useMock);

    if (useMock) {
      const org = mockOrganizations.find((row) => row.id === payload.organizationId);
      requireApprovedOrg(org);
      if (mockCredentials.has(payload.email)) {
        throw new ServiceError(409, "CONFLICT", "Email is already registered");
      }
      const authUserId = randomUUID();
      const profile: PrincipalRow = {
        id: randomUUID(),
        authUserId,
        email: payload.email,
        organizationId: payload.organizationId,
        fullName: payload.fullName,
        idType: payload.idType,
        idNumber: payload.idNumber,
        phone: payload.phone,
        isUnitLeader: payload.isUnitLeader,
        isLegalRepresentative: payload.isLegalRepresentative,
        status: "active",
        createdAt: nowIso(),
        updatedAt: nowIso()
      };
      mockPrincipals.push(profile);
      mockCredentials.set(payload.email, { password: payload.password, authUserId, accountType: "principal" });
      return profile;
    }

    const { data: org } = await supabaseAdmin.from("organizations").select("id,status").eq("id", payload.organizationId).maybeSingle();
    if (!org || org.status !== "approved") {
      throw new ServiceError(422, "ORG_REQUIRED", "Please choose an approved organization");
    }

    const existingAuthUser = await findAuthUserByEmail(payload.email);
    let principalAuthUserId: string | undefined;
    let createdAuthUserId: string | undefined;

    if (existingAuthUser) {
      const { data: ownerOrg, error: ownerOrgError } = await supabaseAdmin
        .from("organizations")
        .select("id,status")
        .eq("unit_admin_auth_user_id", existingAuthUser.id)
        .maybeSingle();
      if (ownerOrgError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Checking existing organization failed");
      }
      if (!ownerOrg || ownerOrg.id !== payload.organizationId || ownerOrg.status !== "approved") {
        throw new ServiceError(409, "CONFLICT", "Email is already registered");
      }
      principalAuthUserId = existingAuthUser.id;
    } else {
      const createAuth = await supabaseAdmin.auth.admin.createUser({
        email: payload.email,
        password: payload.password,
        email_confirm: true,
        user_metadata: { account_type: "principal" }
      });
      if (createAuth.error || !createAuth.data.user) {
        throw new ServiceError(409, "CONFLICT", createAuth.error?.message ?? "Principal account creation failed");
      }
      principalAuthUserId = createAuth.data.user.id;
      createdAuthUserId = createAuth.data.user.id;
    }

    if (!principalAuthUserId) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Principal account creation failed");
    }

    const { data: existingPrincipal, error: existingPrincipalError } = await supabaseAdmin
      .from("principal_profiles")
      .select("*")
      .eq("auth_user_id", principalAuthUserId)
      .maybeSingle();
    if (existingPrincipalError) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Checking existing principal failed");
    }
    if (existingPrincipal) {
      throw new ServiceError(409, "CONFLICT", "Principal profile already exists for this email");
    }

    const { data, error } = await supabaseAdmin
      .from("principal_profiles")
      .insert({
        auth_user_id: principalAuthUserId,
        email: payload.email,
        organization_id: payload.organizationId,
        full_name: payload.fullName,
        id_type: payload.idType,
        id_number: payload.idNumber,
        phone: payload.phone,
        is_unit_leader: payload.isUnitLeader,
        is_legal_representative: payload.isLegalRepresentative,
        status: "active"
      })
      .select(
        "*"
      )
      .single();
    if (error || !data) {
      if (createdAuthUserId) {
        await supabaseAdmin.auth.admin.deleteUser(createdAuthUserId);
      }
      throw new ServiceError(500, "INTERNAL_ERROR", "Saving principal information failed");
    }
    return {
      id: data.id,
      authUserId: data.auth_user_id,
      email: data.email,
      organizationId: data.organization_id,
      fullName: data.full_name,
      idType: data.id_type,
      idNumber: data.id_number,
      phone: data.phone,
      isUnitLeader: data.is_unit_leader,
      isLegalRepresentative: data.is_legal_representative,
      status: (data.status ?? "active") as "active" | "disabled",
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  loginUnit: async (payload: { email: string; password: string; captchaId: string; captchaCode: string }, useMock: boolean) => {
    await managementService.verifyCaptcha(payload.captchaId, payload.captchaCode, useMock);

    if (useMock) {
      const account = mockCredentials.get(payload.email);
      if (!account || account.password !== payload.password || account.accountType !== "unit") {
        throw new ServiceError(401, "UNAUTHORIZED", "Login failed, check your account or password");
      }
      const org = mockOrganizations.find((row) => row.unitAdminAuthUserId === account.authUserId);
      if (!org) {
        throw new ServiceError(403, "ORG_NOT_FOUND", "Only registered organizations can log in");
      }
      if (org.status === "pending") {
        throw new ServiceError(403, "ORG_PENDING", "Organization review is pending");
      }
      if (org.status === "rejected") {
        throw new ServiceError(403, "ORG_REJECTED", "Organization review was rejected");
      }
      return {
        accessToken: "portal-fake-unit",
        refreshToken: "portal-fake-refresh",
        accountType: "unit",
        user: {
          authUserId: account.authUserId,
          email: payload.email,
          organization: org
        }
      };
    }

    const { data, error } = await supabaseAnon.auth.signInWithPassword({ email: payload.email, password: payload.password });
    if (error || !data.user || !data.session) {
      throw new ServiceError(401, "UNAUTHORIZED", "Login failed, check your account or password");
    }
    let { data: org, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("id,name,status,contact_name,contact_phone,social_credit_code,department_name,province_name,city_name,district_name,address,unit_admin_email,unit_admin_auth_user_id")
      .eq("unit_admin_auth_user_id", data.user.id)
      .maybeSingle();
    if (orgError) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query organizations failed");
    }
    if (!org && data.user.email) {
      const { data: fallbackOrg, error: fallbackError } = await supabaseAdmin
        .from("organizations")
        .select("id,name,status,contact_name,contact_phone,social_credit_code,department_name,province_name,city_name,district_name,address,unit_admin_email,unit_admin_auth_user_id")
        .eq("unit_admin_email", data.user.email)
        .maybeSingle();
      if (fallbackError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Query organizations failed");
      }
      if (fallbackOrg) {
        org = fallbackOrg;
        if (fallbackOrg.unit_admin_auth_user_id !== data.user.id) {
          await supabaseAdmin
            .from("organizations")
            .update({ unit_admin_auth_user_id: data.user.id, updated_at: nowIso() })
            .eq("id", fallbackOrg.id);
        }
      }
    }
    if (!org) {
      let { data: principal, error: principalError } = await supabaseAdmin
        .from("principal_profiles")
        .select("*")
        .eq("auth_user_id", data.user.id)
        .maybeSingle();
      if (principalError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Query principal profile failed");
      }
      if (!principal && data.user.email) {
        const { data: principalByEmail, error: principalByEmailError } = await supabaseAdmin
          .from("principal_profiles")
          .select("*")
          .eq("email", data.user.email)
          .maybeSingle();
        if (principalByEmailError) {
          throw new ServiceError(500, "INTERNAL_ERROR", "Query principal profile failed");
        }
        if (principalByEmail) {
          principal = principalByEmail;
          if (principalByEmail.auth_user_id !== data.user.id) {
            await supabaseAdmin
              .from("principal_profiles")
              .update({ auth_user_id: data.user.id, updated_at: nowIso() })
              .eq("id", principalByEmail.id);
          }
        }
      }
      if (principal) {
        throw new ServiceError(403, "ACCOUNT_TYPE_MISMATCH", "This email is a principal account, please use principal login");
      }
      throw new ServiceError(403, "ORG_NOT_FOUND", "Only registered organizations can log in");
    }
    if (org.status === "pending") {
      throw new ServiceError(403, "ORG_PENDING", "Organization review is pending");
    }
    if (org.status === "rejected") {
      throw new ServiceError(403, "ORG_REJECTED", "Organization review was rejected");
    }
    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      accountType: "unit",
      user: {
        authUserId: data.user.id,
        email: data.user.email ?? payload.email,
        organization: org
      }
    };
  },

  loginPrincipal: async (
    payload: { email: string; password: string; captchaId: string; captchaCode: string },
    useMock: boolean
  ) => {
    await managementService.verifyCaptcha(payload.captchaId, payload.captchaCode, useMock);

    if (useMock) {
      const account = mockCredentials.get(payload.email);
      if (!account || account.password !== payload.password || account.accountType !== "principal") {
        throw new ServiceError(401, "UNAUTHORIZED", "Login failed, check your account or password");
      }
      const principal = mockPrincipals.find((row) => row.authUserId === account.authUserId);
      if (!principal) {
        throw new ServiceError(403, "FORBIDDEN", "Principal profile not found");
      }
      if (principal.status === "disabled") {
        throw new ServiceError(403, "ACCOUNT_DISABLED", "Principal account is disabled");
      }
      const org = mockOrganizations.find((row) => row.id === principal.organizationId);
      requireApprovedOrg(org);
      return {
        accessToken: "portal-fake-principal",
        refreshToken: "portal-fake-refresh",
        accountType: "principal",
        user: {
          authUserId: account.authUserId,
          email: payload.email,
          principal,
          organization: org
        }
      };
    }

    const { data, error } = await supabaseAnon.auth.signInWithPassword({ email: payload.email, password: payload.password });
    if (error || !data.user || !data.session) {
      throw new ServiceError(401, "UNAUTHORIZED", "Login failed, check your account or password");
    }
    let { data: principal, error: principalError } = await supabaseAdmin
      .from("principal_profiles")
      .select("*")
      .eq("auth_user_id", data.user.id)
      .maybeSingle();
    if (principalError) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query principal profile failed");
    }
    if (!principal && data.user.email) {
      const { data: principalByEmail, error: principalByEmailError } = await supabaseAdmin
        .from("principal_profiles")
        .select("*")
        .eq("email", data.user.email)
        .maybeSingle();
      if (principalByEmailError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Query principal profile failed");
      }
      if (principalByEmail) {
        principal = principalByEmail;
        if (principalByEmail.auth_user_id !== data.user.id) {
          await supabaseAdmin
            .from("principal_profiles")
            .update({ auth_user_id: data.user.id, updated_at: nowIso() })
            .eq("id", principalByEmail.id);
        }
      }
    }
    if (!principal) {
      const { data: unitByAuthUser, error: unitByAuthUserError } = await supabaseAdmin
        .from("organizations")
        .select("id")
        .eq("unit_admin_auth_user_id", data.user.id)
        .maybeSingle();
      if (unitByAuthUserError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Query organizations failed");
      }

      let unitByEmail: { id: string } | null = null;
      if (!unitByAuthUser && data.user.email) {
        const { data: unitByEmailData, error: unitByEmailError } = await supabaseAdmin
          .from("organizations")
          .select("id")
          .eq("unit_admin_email", data.user.email)
          .maybeSingle();
        if (unitByEmailError) {
          throw new ServiceError(500, "INTERNAL_ERROR", "Query organizations failed");
        }
        unitByEmail = unitByEmailData;
      }

      if (unitByAuthUser || unitByEmail) {
        throw new ServiceError(403, "ACCOUNT_TYPE_MISMATCH", "This email is a unit account, please use unit login");
      }
      throw new ServiceError(403, "FORBIDDEN", "Principal profile not found");
    }
    if (principal.status === "disabled") {
      throw new ServiceError(403, "ACCOUNT_DISABLED", "Principal account is disabled");
    }
    const { data: org } = await supabaseAdmin.from("organizations").select("id,name,status").eq("id", principal.organization_id).maybeSingle();
    if (!org || org.status !== "approved") {
      throw new ServiceError(403, "ORG_NOT_APPROVED", "Organization review is not approved");
    }
    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      accountType: "principal",
      user: {
        authUserId: data.user.id,
        email: data.user.email ?? payload.email,
        principal,
        organization: org
      }
    };
  },

  getPortalProfile: async (authUserId: string, accountType: "unit" | "principal" | "unknown", useMock: boolean) => {
    if (useMock) {
      if (accountType === "unit") {
        return { accountType, organization: mockOrganizations.find((row) => row.unitAdminAuthUserId === authUserId) ?? null };
      }
      const principal = resolveMockPrincipalByAuthUserId(authUserId);
      const organization = principal ? mockOrganizations.find((row) => row.id === principal.organizationId) : null;
      return { accountType: principal ? "principal" : accountType, principal: principal ?? null, organization };
    }

    if (accountType === "unit") {
      const { data: organization } = await supabaseAdmin
        .from("organizations")
        .select("id,name,status,contact_name,contact_phone,social_credit_code,department_name,province_name,city_name,district_name,address,unit_admin_email")
        .eq("unit_admin_auth_user_id", authUserId)
        .maybeSingle();
      return { accountType: "unit", organization: organization ?? null };
    }

    const { data: principal } = await supabaseAdmin
      .from("principal_profiles")
      .select("*")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    let metadata: PrincipalProfileMetadata | undefined;
    if (principal?.auth_user_id) {
      try {
        const metadataMap = await loadAuthPrincipalMetadataMap([principal.auth_user_id]);
        metadata = metadataMap.get(principal.auth_user_id);
      } catch {
        metadata = undefined;
      }
    }

    const principalWithFallback = principal
      ? {
          ...principal,
          title: principal.title ?? metadata?.title ?? null,
          education: principal.education ?? metadata?.education ?? null,
          degree: principal.degree ?? metadata?.degree ?? null,
          is_academician: principal.is_academician ?? metadata?.isAcademician ?? false,
          id_card_front_url: principal.id_card_front_url ?? metadata?.idCardFrontUrl ?? null,
          id_card_back_url: principal.id_card_back_url ?? metadata?.idCardBackUrl ?? null,
          title_cert_url: principal.title_cert_url ?? metadata?.titleCertUrl ?? null,
          education_cert_url: principal.education_cert_url ?? metadata?.educationCertUrl ?? null,
          profile_submitted_at: principal.profile_submitted_at ?? metadata?.profileSubmittedAt ?? null
        }
      : null;

    const { data: organization } = principalWithFallback
      ? await supabaseAdmin
          .from("organizations")
          .select("id,name,status,contact_name,contact_phone,social_credit_code,department_name,province_name,city_name,district_name,address")
          .eq("id", principalWithFallback.organization_id)
          .maybeSingle()
      : { data: null };
    return {
      accountType: principalWithFallback ? "principal" : accountType,
      principal: principalWithFallback,
      organization: organization ?? null
    };
  },

  savePortalPrincipalProfile: async (
    authUserId: string,
    payload: {
      email?: string;
      phone?: string;
      title?: string;
      education?: string;
      degree?: string;
      isAcademician?: boolean;
      idCardFrontUrl?: string;
      idCardBackUrl?: string;
      titleCertUrl?: string;
      educationCertUrl?: string;
    },
    useMock: boolean
  ) => {
    if (useMock) {
      const principal = resolveMockPrincipalByAuthUserId(authUserId);
      if (!principal) {
        throw new ServiceError(403, "FORBIDDEN", "Principal profile not found");
      }

      const next = {
        idCardFrontUrl: payload.idCardFrontUrl ?? principal.idCardFrontUrl,
        idCardBackUrl: payload.idCardBackUrl ?? principal.idCardBackUrl,
        titleCertUrl: payload.titleCertUrl ?? principal.titleCertUrl,
        educationCertUrl: payload.educationCertUrl ?? principal.educationCertUrl
      };

      if (!next.idCardFrontUrl || !next.idCardBackUrl || !next.titleCertUrl || !next.educationCertUrl) {
        throw new ServiceError(422, "VALIDATION_ERROR", "All required materials must be uploaded before saving");
      }

      principal.email = payload.email ?? principal.email;
      principal.phone = payload.phone ?? principal.phone;
      principal.title = payload.title ?? principal.title;
      principal.education = payload.education ?? principal.education;
      principal.degree = payload.degree ?? principal.degree;
      principal.isAcademician = payload.isAcademician ?? principal.isAcademician ?? false;
      principal.idCardFrontUrl = next.idCardFrontUrl;
      principal.idCardBackUrl = next.idCardBackUrl;
      principal.titleCertUrl = next.titleCertUrl;
      principal.educationCertUrl = next.educationCertUrl;
      principal.profileSubmittedAt = nowIso();
      principal.updatedAt = nowIso();

      const organization = mockOrganizations.find((org) => org.id === principal.organizationId);

      return {
        id: principal.id,
        authUserId: principal.authUserId,
        email: principal.email,
        organizationId: principal.organizationId,
        organizationName: organization?.name ?? principal.organizationId,
        fullName: principal.fullName,
        idType: principal.idType,
        idNumber: principal.idNumber,
        phone: principal.phone,
        isUnitLeader: principal.isUnitLeader,
        isLegalRepresentative: principal.isLegalRepresentative,
        title: principal.title ?? undefined,
        education: principal.education ?? undefined,
        degree: principal.degree ?? undefined,
        isAcademician: principal.isAcademician ?? false,
        idCardFrontUrl: principal.idCardFrontUrl,
        idCardBackUrl: principal.idCardBackUrl,
        titleCertUrl: principal.titleCertUrl,
        educationCertUrl: principal.educationCertUrl,
        profileSubmittedAt: principal.profileSubmittedAt,
        updatedAt: principal.updatedAt
      };
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("principal_profiles")
      .select("*")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (existingError) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query principal profile failed");
    }
    if (!existing) {
      throw new ServiceError(403, "FORBIDDEN", "Principal profile not found");
    }

    const hasColumn = (column: string) => Object.prototype.hasOwnProperty.call(existing, column);
    const hasAllMaterialColumns =
      hasColumn("id_card_front_url") &&
      hasColumn("id_card_back_url") &&
      hasColumn("title_cert_url") &&
      hasColumn("education_cert_url");

    const next = {
      idCardFrontUrl: payload.idCardFrontUrl ?? existing.id_card_front_url,
      idCardBackUrl: payload.idCardBackUrl ?? existing.id_card_back_url,
      titleCertUrl: payload.titleCertUrl ?? existing.title_cert_url,
      educationCertUrl: payload.educationCertUrl ?? existing.education_cert_url
    };

    if (hasAllMaterialColumns && (!next.idCardFrontUrl || !next.idCardBackUrl || !next.titleCertUrl || !next.educationCertUrl)) {
      throw new ServiceError(422, "VALIDATION_ERROR", "All required materials must be uploaded before saving");
    }

    const updatePayload: Record<string, unknown> = {
      email: payload.email ?? existing.email,
      phone: payload.phone ?? existing.phone,
      updated_at: nowIso()
    };

    if (hasColumn("title")) {
      updatePayload.title = payload.title ?? existing.title;
    }
    if (hasColumn("education")) {
      updatePayload.education = payload.education ?? existing.education;
    }
    if (hasColumn("degree")) {
      updatePayload.degree = payload.degree ?? existing.degree;
    }
    if (hasColumn("is_academician")) {
      updatePayload.is_academician = payload.isAcademician ?? existing.is_academician ?? false;
    }
    if (hasColumn("id_card_front_url")) {
      updatePayload.id_card_front_url = next.idCardFrontUrl;
    }
    if (hasColumn("id_card_back_url")) {
      updatePayload.id_card_back_url = next.idCardBackUrl;
    }
    if (hasColumn("title_cert_url")) {
      updatePayload.title_cert_url = next.titleCertUrl;
    }
    if (hasColumn("education_cert_url")) {
      updatePayload.education_cert_url = next.educationCertUrl;
    }
    if (hasColumn("profile_submitted_at")) {
      updatePayload.profile_submitted_at = nowIso();
    }

    const { data, error } = await supabaseAdmin
      .from("principal_profiles")
      .update(updatePayload)
      .eq("id", existing.id)
      .select(
        "*"
      )
      .single();

    if (error || !data) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Save principal profile failed");
    }

    const metadataSnapshot: PrincipalProfileMetadata = {
      title: payload.title ?? data.title ?? existing.title ?? undefined,
      education: payload.education ?? data.education ?? existing.education ?? undefined,
      degree: payload.degree ?? data.degree ?? existing.degree ?? undefined,
      isAcademician: payload.isAcademician ?? data.is_academician ?? existing.is_academician ?? false,
      idCardFrontUrl: next.idCardFrontUrl,
      idCardBackUrl: next.idCardBackUrl,
      titleCertUrl: next.titleCertUrl,
      educationCertUrl: next.educationCertUrl,
      profileSubmittedAt: data.profile_submitted_at ?? nowIso()
    };

    try {
      await savePrincipalProfileMetadataToAuth(authUserId, metadataSnapshot);
    } catch {
      // Keep save flow successful even if metadata sync fails.
    }

    const { data: organization } = await supabaseAdmin
      .from("organizations")
      .select("id,name")
      .eq("id", data.organization_id)
      .maybeSingle();

    return {
      id: data.id,
      authUserId: data.auth_user_id,
      email: data.email,
      organizationId: data.organization_id,
      organizationName: organization?.name ?? data.organization_id,
      fullName: data.full_name,
      idType: data.id_type,
      idNumber: data.id_number,
      phone: data.phone,
      isUnitLeader: data.is_unit_leader,
      isLegalRepresentative: data.is_legal_representative,
      title: data.title ?? metadataSnapshot.title ?? undefined,
      education: data.education ?? metadataSnapshot.education ?? undefined,
      degree: data.degree ?? metadataSnapshot.degree ?? undefined,
      isAcademician: data.is_academician ?? metadataSnapshot.isAcademician ?? false,
      idCardFrontUrl: data.id_card_front_url ?? metadataSnapshot.idCardFrontUrl ?? undefined,
      idCardBackUrl: data.id_card_back_url ?? metadataSnapshot.idCardBackUrl ?? undefined,
      titleCertUrl: data.title_cert_url ?? metadataSnapshot.titleCertUrl ?? undefined,
      educationCertUrl: data.education_cert_url ?? metadataSnapshot.educationCertUrl ?? undefined,
      profileSubmittedAt: data.profile_submitted_at ?? metadataSnapshot.profileSubmittedAt ?? undefined,
      updatedAt: data.updated_at
    };
  },

  uploadPrincipalMaterial: async (
    authUserId: string,
    payload: {
      fileName: string;
      mimeType: string;
      fileBase64: string;
    },
    useMock: boolean
  ) => {
    const safeName = normalizeTemplateFileName(payload.fileName);
    if (!safeName) {
      throw new ServiceError(422, "VALIDATION_ERROR", "Invalid file name");
    }

    if (useMock) {
      const principal = resolveMockPrincipalByAuthUserId(authUserId);
      if (!principal) {
        throw new ServiceError(403, "FORBIDDEN", "Principal profile not found");
      }
      return {
        fileUrl: `https://example.local/mock-principal-materials/${safeName}`,
        storagePath: `mock-principal-materials/${safeName}`
      };
    }

    const { data: principal } = await supabaseAdmin
      .from("principal_profiles")
      .select("*")
      .eq("auth_user_id", authUserId)
      .maybeSingle();
    if (!principal) {
      throw new ServiceError(403, "FORBIDDEN", "Principal profile not found");
    }

    await ensurePrincipalMaterialsBucket();

    let binary: Buffer;
    try {
      binary = Buffer.from(payload.fileBase64, "base64");
    } catch {
      throw new ServiceError(422, "VALIDATION_ERROR", "Invalid file content");
    }
    if (!binary.length) {
      throw new ServiceError(422, "VALIDATION_ERROR", "File content is empty");
    }
    if (binary.length > 20 * 1024 * 1024) {
      throw new ServiceError(422, "VALIDATION_ERROR", "File size exceeds 20MB limit");
    }

    const datePrefix = new Date().toISOString().slice(0, 10);
    const storagePath = `principal-materials/${datePrefix}/${authUserId}/${randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(principalMaterialsBucket)
      .upload(storagePath, binary, {
        contentType: payload.mimeType || "application/octet-stream",
        upsert: false
      });

    if (uploadError) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Principal material upload failed");
    }

    const { data } = supabaseAdmin.storage.from(principalMaterialsBucket).getPublicUrl(storagePath);

    return {
      fileUrl: data.publicUrl,
      storagePath
    };
  },

  listPrincipalProfileSubmissions: async (useMock: boolean) => {
    if (useMock) {
      return mockPrincipals
        .filter((row) => row.profileSubmittedAt)
        .sort((a, b) => new Date(b.profileSubmittedAt ?? b.updatedAt).getTime() - new Date(a.profileSubmittedAt ?? a.updatedAt).getTime())
        .map((row) => {
          const org = mockOrganizations.find((item) => item.id === row.organizationId);
          return {
            id: row.id,
            fullName: row.fullName,
            email: row.email,
            organizationId: row.organizationId,
            organizationName: org?.name ?? row.organizationId,
            idType: row.idType,
            idNumber: row.idNumber,
            phone: row.phone,
            isUnitLeader: row.isUnitLeader,
            isLegalRepresentative: row.isLegalRepresentative,
            roleType: row.isUnitLeader || row.isLegalRepresentative ? "leader" : "staff",
            title: row.title ?? undefined,
            education: row.education ?? undefined,
            degree: row.degree ?? undefined,
            isAcademician: row.isAcademician ?? false,
            idCardFrontUrl: row.idCardFrontUrl ?? undefined,
            idCardBackUrl: row.idCardBackUrl ?? undefined,
            titleCertUrl: row.titleCertUrl ?? undefined,
            educationCertUrl: row.educationCertUrl ?? undefined,
            profileSubmittedAt: row.profileSubmittedAt ?? undefined,
            updatedAt: row.updatedAt
          };
        });
    }

    const primaryQuery = await supabaseAdmin
      .from("principal_profiles")
      .select("*")
      .not("profile_submitted_at", "is", null)
      .order("profile_submitted_at", { ascending: false });

    let principalRows = primaryQuery.data ?? [];
    if (primaryQuery.error) {
      const errorMessage = String(primaryQuery.error.message ?? "").toLowerCase();
      const missingSubmittedAt = errorMessage.includes("profile_submitted_at") && errorMessage.includes("does not exist");
      if (!missingSubmittedAt) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Query principal profile submissions failed");
      }

      const fallbackQuery = await supabaseAdmin
        .from("principal_profiles")
        .select("*")
        .order("updated_at", { ascending: false });

      if (fallbackQuery.error) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Query principal profile submissions failed");
      }

      const fallbackRows = fallbackQuery.data ?? [];
      const hasSubmittedAtColumn = fallbackRows.some((row: any) =>
        Object.prototype.hasOwnProperty.call(row, "profile_submitted_at")
      );
      const hasAnyProfileMaterialColumn = fallbackRows.some((row: any) =>
        Object.prototype.hasOwnProperty.call(row, "id_card_front_url") ||
        Object.prototype.hasOwnProperty.call(row, "id_card_back_url") ||
        Object.prototype.hasOwnProperty.call(row, "title_cert_url") ||
        Object.prototype.hasOwnProperty.call(row, "education_cert_url") ||
        Object.prototype.hasOwnProperty.call(row, "title") ||
        Object.prototype.hasOwnProperty.call(row, "education") ||
        Object.prototype.hasOwnProperty.call(row, "degree")
      );

      if (hasSubmittedAtColumn) {
        principalRows = fallbackRows.filter((row: any) => Boolean(row.profile_submitted_at));
      } else if (hasAnyProfileMaterialColumn) {
        principalRows = fallbackRows.filter((row: any) =>
          Boolean(
            row.id_card_front_url ||
              row.id_card_back_url ||
              row.title_cert_url ||
              row.education_cert_url ||
              row.title ||
              row.education ||
              row.degree
          )
        );
      } else {
        // Legacy schema fallback: no profile submission columns yet, keep records visible for admin receiving.
        principalRows = fallbackRows;
      }
    }
    const organizationIds = Array.from(new Set(principalRows.map((row: any) => row.organization_id).filter(Boolean)));
    const organizationMap = new Map<string, string>();

    if (organizationIds.length) {
      const { data: organizations, error: orgError } = await supabaseAdmin
        .from("organizations")
        .select("id,name")
        .in("id", organizationIds);
      if (orgError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Query organizations failed");
      }
      for (const org of organizations ?? []) {
        organizationMap.set(org.id, org.name);
      }
    }

    const authUserIds = Array.from(new Set(principalRows.map((row: any) => row.auth_user_id).filter(Boolean)));
    let metadataMap = new Map<string, PrincipalProfileMetadata>();
    try {
      metadataMap = await loadAuthPrincipalMetadataMap(authUserIds);
    } catch {
      metadataMap = new Map<string, PrincipalProfileMetadata>();
    }

    return principalRows.map((row: any) => {
      const metadata = metadataMap.get(row.auth_user_id);
      return {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        organizationId: row.organization_id,
        organizationName: organizationMap.get(row.organization_id) ?? row.organization_id,
        idType: row.id_type,
        idNumber: row.id_number,
        phone: row.phone,
        isUnitLeader: row.is_unit_leader,
        isLegalRepresentative: row.is_legal_representative,
        roleType: resolvePrincipalRoleType(row),
        title: row.title ?? metadata?.title ?? undefined,
        education: row.education ?? metadata?.education ?? undefined,
        degree: row.degree ?? metadata?.degree ?? undefined,
        isAcademician: row.is_academician ?? metadata?.isAcademician ?? false,
        idCardFrontUrl: row.id_card_front_url ?? metadata?.idCardFrontUrl ?? undefined,
        idCardBackUrl: row.id_card_back_url ?? metadata?.idCardBackUrl ?? undefined,
        titleCertUrl: row.title_cert_url ?? metadata?.titleCertUrl ?? undefined,
        educationCertUrl: row.education_cert_url ?? metadata?.educationCertUrl ?? undefined,
        profileSubmittedAt: row.profile_submitted_at ?? metadata?.profileSubmittedAt ?? undefined,
        updatedAt: row.updated_at
      };
    });
  },
  listRegions: async (level: "province" | "city" | "district", parentCode: string | undefined, useMock: boolean) => {
    if (useMock) {
      return mockRegions.filter((row) => row.level === level && (!parentCode || row.parentCode === parentCode));
    }
    let query = supabaseAdmin
      .from("region_catalog")
      .select("level,code,name,parent_code")
      .eq("level", level)
      .order("sort_order", { ascending: true })
      .order("code", { ascending: true });
    if (parentCode) {
      query = query.eq("parent_code", parentCode);
    }
    const { data, error } = await query;
    if (error) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query regions failed");
    }
    return (data ?? []).map((row: any) => ({
      level: row.level,
      code: row.code,
      name: row.name,
      parentCode: row.parent_code ?? undefined
    }));
  },
  uploadTemplateFile: async (
    payload: {
      fileName: string;
      mimeType: string;
      fileBase64: string;
    },
    useMock: boolean
  ) => {
    const safeName = normalizeTemplateFileName(payload.fileName);
    if (!safeName) {
      throw new ServiceError(422, "VALIDATION_ERROR", "Invalid file name");
    }

    if (useMock) {
      return {
        fileUrl: `https://example.local/mock-uploads/${safeName}`,
        storagePath: `mock/${safeName}`
      };
    }

    await ensureTemplateBucket();

    let binary: Buffer;
    try {
      binary = Buffer.from(payload.fileBase64, "base64");
    } catch {
      throw new ServiceError(422, "VALIDATION_ERROR", "Invalid file content");
    }
    if (!binary.length) {
      throw new ServiceError(422, "VALIDATION_ERROR", "File content is empty");
    }
    if (binary.length > 20 * 1024 * 1024) {
      throw new ServiceError(422, "VALIDATION_ERROR", "File size exceeds 20MB limit");
    }

    const datePrefix = new Date().toISOString().slice(0, 10);
    const storagePath = `templates/${datePrefix}/${randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(templateFilesBucket)
      .upload(storagePath, binary, {
        contentType: payload.mimeType || "application/octet-stream",
        upsert: false
      });

    if (uploadError) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Template file upload failed");
    }

    const { data } = supabaseAdmin.storage.from(templateFilesBucket).getPublicUrl(storagePath);

    return {
      fileUrl: data.publicUrl,
      storagePath
    };
  },

  createTemplate: async (
    payload: {
      planCategory: string;
      projectCategory: string;
      title: string;
      sourceName?: string;
      guideUnit?: string;
      contactPhone?: string;
      startAt: string;
      endAt: string;
      fileUrl?: string;
    },
    creatorAuthUserId: string,
    useMock: boolean
  ) => {
    if (useMock) {
      const row: TemplateRow = {
        id: randomUUID(),
        planCategory: payload.planCategory,
        projectCategory: payload.projectCategory,
        title: payload.title,
        sourceName: payload.sourceName,
        guideUnit: payload.guideUnit,
        contactPhone: payload.contactPhone,
        startAt: payload.startAt,
        endAt: payload.endAt,
        fileUrl: payload.fileUrl,
        status: "draft",
        createdAt: nowIso(),
        updatedAt: nowIso()
      };
      mockTemplates.push(row);
      return row;
    }

    const { data: creator } = await supabaseAdmin.from("admin_users").select("id").eq("auth_user_id", creatorAuthUserId).maybeSingle();
    const { data, error } = await supabaseAdmin
      .from("application_templates")
      .insert({
        plan_category: payload.planCategory,
        project_category: payload.projectCategory,
        title: payload.title,
        source_name: payload.sourceName,
        guide_unit: payload.guideUnit,
        contact_phone: payload.contactPhone,
        start_at: payload.startAt,
        end_at: payload.endAt,
        file_url: payload.fileUrl,
        status: "draft",
        created_by: creator?.id ?? null
      })
      .select("id,plan_category,project_category,title,source_name,guide_unit,contact_phone,start_at,end_at,file_url,status,published_at,created_at,updated_at")
      .single();
    if (error || !data) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Create template failed");
    }
    return mapTemplateRow(data);
  },

  updateTemplate: async (templateId: string, payload: Partial<any>, useMock: boolean) => {
    if (useMock) {
      const row = mockTemplates.find((item) => item.id === templateId);
      if (!row) {
        throw new ServiceError(404, "NOT_FOUND", "Template not found");
      }
      Object.assign(row, {
        planCategory: payload.planCategory ?? row.planCategory,
        projectCategory: payload.projectCategory ?? row.projectCategory,
        title: payload.title ?? row.title,
        sourceName: payload.sourceName ?? row.sourceName,
        guideUnit: payload.guideUnit ?? row.guideUnit,
        contactPhone: payload.contactPhone ?? row.contactPhone,
        startAt: payload.startAt ?? row.startAt,
        endAt: payload.endAt ?? row.endAt,
        fileUrl: payload.fileUrl ?? row.fileUrl,
        status: payload.status ?? row.status,
        updatedAt: nowIso()
      });
      return row;
    }

    const { data, error } = await supabaseAdmin
      .from("application_templates")
      .update({
        plan_category: payload.planCategory,
        project_category: payload.projectCategory,
        title: payload.title,
        source_name: payload.sourceName,
        guide_unit: payload.guideUnit,
        contact_phone: payload.contactPhone,
        start_at: payload.startAt,
        end_at: payload.endAt,
        file_url: payload.fileUrl,
        status: payload.status,
        updated_at: nowIso()
      })
      .eq("id", templateId)
      .select("id,plan_category,project_category,title,source_name,guide_unit,contact_phone,start_at,end_at,file_url,status,published_at,created_at,updated_at")
      .single();
    if (error || !data) {
      throw new ServiceError(404, "NOT_FOUND", "Template not found");
    }
    return mapTemplateRow(data);
  },

  publishTemplate: async (templateId: string, useMock: boolean) => {
    if (useMock) {
      const row = mockTemplates.find((item) => item.id === templateId);
      if (!row) {
        throw new ServiceError(404, "NOT_FOUND", "Template not found");
      }
      row.status = "published";
      row.publishedAt = nowIso();
      row.updatedAt = nowIso();
      return row;
    }
    const { data, error } = await supabaseAdmin
      .from("application_templates")
      .update({ status: "published", published_at: nowIso(), updated_at: nowIso() })
      .eq("id", templateId)
      .select("id,plan_category,project_category,title,source_name,guide_unit,contact_phone,start_at,end_at,file_url,status,published_at,created_at,updated_at")
      .single();
    if (error || !data) {
      throw new ServiceError(404, "NOT_FOUND", "Template not found");
    }
    return mapTemplateRow(data);
  },

  deleteTemplate: async (templateId: string, useMock: boolean) => {
    if (useMock) {
      const idx = mockTemplates.findIndex((row) => row.id === templateId);
      if (idx < 0) {
        throw new ServiceError(404, "NOT_FOUND", "Template not found");
      }
      const hasDeclarations = mockDeclarations.some((row) => row.templateId === templateId);
      if (hasDeclarations) {
        const target = mockTemplates[idx];
        target.status = "archived";
        target.updatedAt = nowIso();
        return true;
      }
      mockTemplates.splice(idx, 1);
      return true;
    }

    const { data: existingTemplate, error: existingTemplateError } = await supabaseAdmin
      .from("application_templates")
      .select("id")
      .eq("id", templateId)
      .maybeSingle();
    if (existingTemplateError) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query templates failed");
    }
    if (!existingTemplate) {
      throw new ServiceError(404, "NOT_FOUND", "Template not found");
    }

    const { count, error: referenceError } = await supabaseAdmin
      .from("declaration_forms")
      .select("id", { count: "exact", head: true })
      .eq("template_id", templateId);
    if (referenceError) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query template references failed");
    }
    if ((count ?? 0) > 0) {
      const { error: archiveError } = await supabaseAdmin
        .from("application_templates")
        .update({ status: "archived", updated_at: nowIso() })
        .eq("id", templateId);
      if (archiveError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Archive template failed");
      }
      return true;
    }

    const { error } = await supabaseAdmin.from("application_templates").delete().eq("id", templateId);
    if (error) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Delete template failed");
    }
    return true;
  },

  listTemplates: async (filters: { planCategory?: string; status?: string; publishedOnly?: boolean }, useMock: boolean) => {
    if (useMock) {
      let items = [...mockTemplates];
      if (filters.publishedOnly) {
        items = items.filter((row) => row.status === "published");
      }
      if (filters.status) {
        items = items.filter((row) => row.status === filters.status);
      }
      if (filters.planCategory) {
        items = items.filter((row) => row.planCategory === filters.planCategory);
      }
      return items;
    }
    let query = supabaseAdmin
      .from("application_templates")
      .select("id,plan_category,project_category,title,source_name,guide_unit,contact_phone,start_at,end_at,file_url,status,published_at,created_at,updated_at")
      .order("created_at", { ascending: false });
    if (filters.publishedOnly) {
      query = query.eq("status", "published");
    }
    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    if (filters.planCategory) {
      query = query.eq("plan_category", filters.planCategory);
    }
    const { data, error } = await query;
    if (error) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query templates failed");
    }
    return (data ?? []).map(mapTemplateRow);
  },

  createDeclaration: async (
    authUserId: string,
    payload: { templateId: string; title: string; content?: Record<string, unknown> },
    useMock: boolean
  ) => {
    if (useMock) {
      const row: DeclarationRow = {
        id: randomUUID(),
        authUserId,
        templateId: payload.templateId,
        title: payload.title,
        status: "draft",
        content: payload.content ?? {},
        createdAt: nowIso(),
        updatedAt: nowIso()
      };
      mockDeclarations.push(row);
      return row;
    }

    const { data: principal } = await supabaseAdmin
      .from("principal_profiles")
      .select("*")
      .eq("auth_user_id", authUserId)
      .maybeSingle();
    const { data, error } = await supabaseAdmin
      .from("declaration_forms")
      .insert({
        auth_user_id: authUserId,
        principal_profile_id: principal?.id ?? null,
        organization_id: principal?.organization_id ?? null,
        template_id: payload.templateId,
        title: payload.title,
        status: "draft",
        form_data: payload.content ?? {}
      })
      .select("id,auth_user_id,organization_id,template_id,title,status,form_data,created_at,updated_at")
      .single();
    if (error || !data) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Create declaration failed");
    }
    return {
      id: data.id,
      authUserId: data.auth_user_id,
      organizationId: data.organization_id ?? undefined,
      templateId: data.template_id,
      title: data.title,
      status: data.status,
      content: (data.form_data as Record<string, unknown>) ?? {},
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  listDeclarations: async (authUserId: string, useMock: boolean) => {
    if (useMock) {
      return mockDeclarations.filter((row) => row.authUserId === authUserId);
    }
    const { data, error } = await supabaseAdmin
      .from("declaration_forms")
      .select("id,auth_user_id,organization_id,template_id,title,status,form_data,created_at,updated_at")
      .eq("auth_user_id", authUserId)
      .order("updated_at", { ascending: false });
    if (error) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query declarations failed");
    }
    return (data ?? []).map((row: any) => ({
      id: row.id,
      authUserId: row.auth_user_id,
      organizationId: row.organization_id ?? undefined,
      templateId: row.template_id,
      title: row.title,
      status: row.status,
      content: (row.form_data as Record<string, unknown>) ?? {},
      submittedAt: row.submitted_at ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  },

  updateDeclaration: async (declarationId: string, authUserId: string, payload: Partial<any>, useMock: boolean) => {
    if (useMock) {
      const row = mockDeclarations.find((item) => item.id === declarationId && item.authUserId === authUserId);
      if (!row) {
        throw new ServiceError(404, "NOT_FOUND", "Declaration not found");
      }
      if (payload.title) {
        row.title = payload.title;
      }
      if (payload.status) {
        row.status = payload.status;
      }
      if (payload.content) {
        row.content = payload.content;
      }
      if (payload.status === "submitted") {
        row.submittedAt = nowIso();
      }
      row.updatedAt = nowIso();
      return row;
    }

    const { data, error } = await supabaseAdmin
      .from("declaration_forms")
      .update({
        title: payload.title,
        status: payload.status,
        form_data: payload.content,
        updated_at: nowIso(),
        // Keep compatible with schemas that do not have submitted_at.
      })
      .eq("id", declarationId)
      .eq("auth_user_id", authUserId)
      .select("id,auth_user_id,organization_id,template_id,title,status,form_data,created_at,updated_at")
      .single();
    if (error || !data) {
      throw new ServiceError(404, "NOT_FOUND", "Declaration not found");
    }
    return {
      id: data.id,
      authUserId: data.auth_user_id,
      organizationId: data.organization_id ?? undefined,
      templateId: data.template_id,
      title: data.title,
      status: data.status,
      content: (data.form_data as Record<string, unknown>) ?? {},
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  listSubmittedDeclarations: async (useMock: boolean) => {
    if (useMock) {
      return mockDeclarations
        .filter((row) => row.status === "submitted")
        .sort((left, right) => {
          const leftTime = new Date(left.submittedAt ?? left.updatedAt).getTime();
          const rightTime = new Date(right.submittedAt ?? right.updatedAt).getTime();
          return rightTime - leftTime;
        })
        .map((row) => {
          const template = mockTemplates.find((item) => item.id === row.templateId);
          const organization = row.organizationId
            ? mockOrganizations.find((item) => item.id === row.organizationId)
            : undefined;
          const principal = mockPrincipals.find((item) => item.authUserId === row.authUserId);
          return {
            id: row.id,
            title: row.title,
            status: row.status,
            templateId: row.templateId,
            templateTitle: template?.title ?? row.templateId,
            organizationId: row.organizationId ?? "",
            organizationName: organization?.name ?? "-",
            principalName: principal?.fullName ?? "-",
            submittedAt: row.submittedAt ?? row.updatedAt,
            updatedAt: row.updatedAt
          };
        });
    }

    const { data: declarations, error: declarationError } = await supabaseAdmin
      .from("declaration_forms")
      .select("id,auth_user_id,principal_profile_id,organization_id,template_id,title,status,updated_at")
      .eq("status", "submitted")
      .order("updated_at", { ascending: false });
    if (declarationError) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query submitted declarations failed");
    }

    const declarationRows = declarations ?? [];
    const templateIds = Array.from(new Set(declarationRows.map((item: any) => item.template_id).filter(Boolean)));
    const organizationIds = Array.from(new Set(declarationRows.map((item: any) => item.organization_id).filter(Boolean)));
    const principalIds = Array.from(new Set(declarationRows.map((item: any) => item.principal_profile_id).filter(Boolean)));

    const templateMap = new Map<string, string>();
    if (templateIds.length) {
      const { data: templates, error: templatesError } = await supabaseAdmin
        .from("application_templates")
        .select("id,title")
        .in("id", templateIds);
      if (templatesError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Query templates failed");
      }
      for (const template of templates ?? []) {
        templateMap.set(template.id, template.title);
      }
    }

    const organizationMap = new Map<string, string>();
    if (organizationIds.length) {
      const { data: organizations, error: organizationsError } = await supabaseAdmin
        .from("organizations")
        .select("id,name")
        .in("id", organizationIds);
      if (organizationsError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Query organizations failed");
      }
      for (const organization of organizations ?? []) {
        organizationMap.set(organization.id, organization.name);
      }
    }

    const principalMap = new Map<string, string>();
    if (principalIds.length) {
      const { data: principals, error: principalsError } = await supabaseAdmin
        .from("principal_profiles")
        .select("*")
        .in("id", principalIds);
      if (principalsError) {
        throw new ServiceError(500, "INTERNAL_ERROR", "Query principal profiles failed");
      }
      for (const principal of principals ?? []) {
        principalMap.set(principal.id, principal.full_name);
      }
    }

    return declarationRows.map((row: any) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      templateId: row.template_id,
      templateTitle: templateMap.get(row.template_id) ?? row.template_id,
      organizationId: row.organization_id ?? "",
      organizationName: organizationMap.get(row.organization_id) ?? "-",
      principalName: principalMap.get(row.principal_profile_id) ?? "-",
      submittedAt: row.updated_at,
      updatedAt: row.updated_at
    }));
  },
  deleteDeclaration: async (declarationId: string, authUserId: string, useMock: boolean) => {
    if (useMock) {
      const target = mockDeclarations.find((item) => item.id === declarationId && item.authUserId === authUserId);
      if (!target) {
        throw new ServiceError(404, "NOT_FOUND", "Declaration not found");
      }
      if (target.status !== "draft") {
        throw new ServiceError(409, "INVALID_STATE", "Only draft declarations can be deleted");
      }

      const idx = mockDeclarations.findIndex((item) => item.id === declarationId && item.authUserId === authUserId);
      mockDeclarations.splice(idx, 1);
      return true;
    }
    const { data: existing, error: queryError } = await supabaseAdmin
      .from("declaration_forms")
      .select("id,status")
      .eq("id", declarationId)
      .eq("auth_user_id", authUserId)
      .maybeSingle();
    if (queryError) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query declaration failed");
    }
    if (!existing) {
      throw new ServiceError(404, "NOT_FOUND", "Declaration not found");
    }
    if (existing.status !== "draft") {
      throw new ServiceError(409, "INVALID_STATE", "Only draft declarations can be deleted");
    }

    const { error } = await supabaseAdmin
      .from("declaration_forms")
      .delete()
      .eq("id", declarationId)
      .eq("auth_user_id", authUserId);
    if (error) {
      throw new ServiceError(404, "NOT_FOUND", "Declaration not found");
    }
    return true;
  },

    downloadDeclaration: async (declarationId: string, authUserId: string, useMock: boolean) => {
    const items = await managementService.listDeclarations(authUserId, useMock);
    const target = items.find((item) => item.id === declarationId);
    if (!target) {
      throw new ServiceError(404, "NOT_FOUND", "Declaration not found");
    }

    return buildDeclarationDownloadPayload(
      {
        id: target.id,
        title: target.title,
        status: target.status,
        templateId: target.templateId,
        content: target.content ?? {}
      },
      useMock
    );
  },

  downloadSubmittedDeclaration: async (declarationId: string, useMock: boolean) => {
    if (useMock) {
      const target = mockDeclarations.find((item) => item.id === declarationId && item.status === "submitted");
      if (!target) {
        throw new ServiceError(404, "NOT_FOUND", "Declaration not found");
      }

      return buildDeclarationDownloadPayload(
        {
          id: target.id,
          title: target.title,
          status: target.status,
          templateId: target.templateId,
          content: target.content ?? {}
        },
        useMock
      );
    }

    const { data, error } = await supabaseAdmin
      .from("declaration_forms")
      .select("id,title,status,template_id,form_data")
      .eq("id", declarationId)
      .eq("status", "submitted")
      .maybeSingle();
    if (error) {
      throw new ServiceError(500, "INTERNAL_ERROR", "Query submitted declaration failed");
    }
    if (!data) {
      throw new ServiceError(404, "NOT_FOUND", "Declaration not found");
    }

    return buildDeclarationDownloadPayload(
      {
        id: data.id,
        title: data.title,
        status: data.status,
        templateId: data.template_id,
        content: (data.form_data as Record<string, unknown>) ?? {}
      },
      useMock
    );
  }
};
















