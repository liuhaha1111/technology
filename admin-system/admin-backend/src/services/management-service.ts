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
  createdAt: string;
  updatedAt: string;
};

type RegionRow = {
  level: "province" | "city" | "district";
  code: string;
  name: string;
  parentCode?: string;
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

    const createAuth = await supabaseAdmin.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: { account_type: "unit" }
    });
    if (createAuth.error || !createAuth.data.user) {
      throw new ServiceError(409, "CONFLICT", createAuth.error?.message ?? "Unit account creation failed");
    }

    const { data, error } = await supabaseAdmin
      .from("organizations")
      .insert({
        unit_admin_auth_user_id: createAuth.data.user.id,
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
      await supabaseAdmin.auth.admin.deleteUser(createAuth.data.user.id);
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

    const createAuth = await supabaseAdmin.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: { account_type: "principal" }
    });
    if (createAuth.error || !createAuth.data.user) {
      throw new ServiceError(409, "CONFLICT", createAuth.error?.message ?? "Principal account creation failed");
    }

    const { data, error } = await supabaseAdmin
      .from("principal_profiles")
      .insert({
        auth_user_id: createAuth.data.user.id,
        email: payload.email,
        organization_id: payload.organizationId,
        full_name: payload.fullName,
        id_type: payload.idType,
        id_number: payload.idNumber,
        phone: payload.phone,
        is_unit_leader: payload.isUnitLeader,
        is_legal_representative: payload.isLegalRepresentative
      })
      .select(
        "id,auth_user_id,email,organization_id,full_name,id_type,id_number,phone,is_unit_leader,is_legal_representative,created_at,updated_at"
      )
      .single();
    if (error || !data) {
      await supabaseAdmin.auth.admin.deleteUser(createAuth.data.user.id);
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
    const { data: org } = await supabaseAdmin
      .from("organizations")
      .select("id,name,status,contact_name,contact_phone,social_credit_code,department_name,province_name,city_name,district_name,address")
      .eq("unit_admin_auth_user_id", data.user.id)
      .maybeSingle();
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
    const { data: principal } = await supabaseAdmin
      .from("principal_profiles")
      .select("id,auth_user_id,email,organization_id,full_name,id_type,id_number,phone,is_unit_leader,is_legal_representative,created_at,updated_at")
      .eq("auth_user_id", data.user.id)
      .maybeSingle();
    if (!principal) {
      throw new ServiceError(403, "FORBIDDEN", "Principal profile not found");
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
      const principal = mockPrincipals.find((row) => row.authUserId === authUserId);
      const organization = principal ? mockOrganizations.find((row) => row.id === principal.organizationId) : null;
      return { accountType: principal ? "principal" : accountType, principal: principal ?? null, organization };
    }

    if (accountType === "unit") {
      const { data: organization } = await supabaseAdmin
        .from("organizations")
        .select("id,name,status,contact_name,contact_phone,social_credit_code,department_name,province_name,city_name,district_name,address")
        .eq("unit_admin_auth_user_id", authUserId)
        .maybeSingle();
      return { accountType: "unit", organization: organization ?? null };
    }

    const { data: principal } = await supabaseAdmin
      .from("principal_profiles")
      .select("id,auth_user_id,email,organization_id,full_name,id_type,id_number,phone,is_unit_leader,is_legal_representative")
      .eq("auth_user_id", authUserId)
      .maybeSingle();
    const { data: organization } = principal
      ? await supabaseAdmin
          .from("organizations")
          .select("id,name,status,contact_name,contact_phone,social_credit_code,department_name,province_name,city_name,district_name,address")
          .eq("id", principal.organization_id)
          .maybeSingle()
      : { data: null };
    return { accountType: principal ? "principal" : accountType, principal: principal ?? null, organization: organization ?? null };
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
      mockTemplates.splice(idx, 1);
      return true;
    }
    const { error } = await supabaseAdmin.from("application_templates").delete().eq("id", templateId);
    if (error) {
      throw new ServiceError(404, "NOT_FOUND", "Template not found");
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
      .select("id,organization_id")
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
        submitted_at: payload.status === "submitted" ? nowIso() : undefined
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

  deleteDeclaration: async (declarationId: string, authUserId: string, useMock: boolean) => {
    if (useMock) {
      const idx = mockDeclarations.findIndex((item) => item.id === declarationId && item.authUserId === authUserId);
      if (idx < 0) {
        throw new ServiceError(404, "NOT_FOUND", "Declaration not found");
      }
      mockDeclarations.splice(idx, 1);
      return true;
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
    return {
      id: target.id,
      fileName: `${target.title}.json`,
      content: JSON.stringify(target.content ?? {}, null, 2)
    };
  }
};



