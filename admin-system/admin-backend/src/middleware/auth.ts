import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin, supabaseAnon } from "../lib/supabase";

export type RequestAuthUser = {
  authUserId: string;
  email: string;
  orgUnitId: string;
  roleHint?: string;
  roles?: string[];
  isMockToken?: boolean;
};

type RequestWithAuth = Request & {
  authUser?: RequestAuthUser;
};
export type { RequestWithAuth };

export type RequestPortalUser = {
  authUserId: string;
  email: string;
  accountType: "unit" | "principal" | "unknown";
  isMockToken?: boolean;
};

type RequestWithPortalAuth = Request & {
  portalUser?: RequestPortalUser;
};
export type { RequestWithPortalAuth };

const unauthorized = (res: Response) =>
  res.status(401).json({
    code: "UNAUTHORIZED",
    message: "Unauthorized",
    data: null,
    requestId: "local"
  });

const forbidden = (res: Response, message = "Forbidden") =>
  res.status(403).json({
    code: "FORBIDDEN",
    message,
    data: null,
    requestId: "local"
  });

const rolePriority: Record<string, number> = {
  super_admin: 4,
  admin: 3,
  analyst: 2,
  viewer: 1
};

const pickHighestRole = (roles: string[]): string | undefined =>
  [...roles].sort((left, right) => (rolePriority[right] ?? 0) - (rolePriority[left] ?? 0))[0];

const readBearerToken = (request: Request): string | null => {
  const header = request.header("authorization");
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
};

const parsePortalAccountType = (value: string | null | undefined): "unit" | "principal" | undefined => {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "unit" || normalized === "principal") {
    return normalized;
  }
  return undefined;
};

export const requireAuth = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  const token = readBearerToken(req);
  if (!token) {
    return unauthorized(res);
  }

  // Lightweight fake tokens for deterministic unit tests.
  if (process.env.NODE_ENV === "test" && token.startsWith("fake-")) {
    const roleHint = token.slice("fake-".length);
    req.authUser = {
      authUserId: `test-${roleHint}`,
      email: `${roleHint}@example.com`,
      orgUnitId: "00000000-0000-0000-0000-000000000001",
      roleHint,
      isMockToken: true
    };
    return next();
  }

  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data.user) {
    return unauthorized(res);
  }

  const { data: adminUser, error: adminUserError } = await supabaseAdmin
    .from("admin_users")
    .select("id,org_unit_id,email")
    .eq("auth_user_id", data.user.id)
    .maybeSingle();

  if (adminUserError) {
    return forbidden(res, "Failed to resolve admin profile");
  }

  if (!adminUser) {
    return forbidden(res, "Admin profile not registered");
  }

  const { data: roleRows, error: roleError } = await supabaseAdmin
    .from("user_roles")
    .select("roles(key)")
    .eq("user_id", adminUser.id);

  if (roleError) {
    return forbidden(res, "Failed to resolve roles");
  }

  const roles = (roleRows ?? [])
    .map((row: any) => row.roles?.key as string | undefined)
    .filter((role): role is string => Boolean(role));

  req.authUser = {
    authUserId: data.user.id,
    email: adminUser.email ?? data.user.email ?? "",
    orgUnitId: adminUser.org_unit_id,
    roleHint: pickHighestRole(roles),
    roles,
    isMockToken: false
  };

  return next();
};

export const requirePortalAuth = async (req: RequestWithPortalAuth, res: Response, next: NextFunction) => {
  const token = readBearerToken(req);
  if (!token) {
    return unauthorized(res);
  }

  const requestedAccountType = parsePortalAccountType(req.header("x-portal-account-type"));

  if (process.env.NODE_ENV === "test" && token.startsWith("portal-fake-")) {
    const tokenAccountType = token === "portal-fake-unit" ? "unit" : token === "portal-fake-principal" ? "principal" : "unknown";
    req.portalUser = {
      authUserId: `portal-${tokenAccountType}`,
      email: `${tokenAccountType}@example.com`,
      accountType: requestedAccountType ?? tokenAccountType,
      isMockToken: true
    };
    return next();
  }

  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data.user) {
    return unauthorized(res);
  }

  const accountTypeRaw = data.user.user_metadata?.account_type;
  const metadataAccountType = accountTypeRaw === "unit" || accountTypeRaw === "principal" ? accountTypeRaw : "unknown";

  req.portalUser = {
    authUserId: data.user.id,
    email: data.user.email ?? "",
    accountType: requestedAccountType ?? metadataAccountType,
    isMockToken: false
  };

  return next();
};
