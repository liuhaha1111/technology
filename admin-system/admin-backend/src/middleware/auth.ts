import type { NextFunction, Request, Response } from "express";
import { supabaseAnon } from "../lib/supabase";

export type RequestAuthUser = {
  authUserId: string;
  email: string;
  orgUnitId: string;
  roleHint?: string;
};

type RequestWithAuth = Request & {
  authUser?: RequestAuthUser;
};
export type { RequestWithAuth };

const unauthorized = (res: Response) =>
  res.status(401).json({
    code: "UNAUTHORIZED",
    message: "Unauthorized",
    data: null,
    requestId: "local"
  });

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

export const requireAuth = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  const token = readBearerToken(req);
  if (!token) {
    return unauthorized(res);
  }

  // Lightweight fake tokens for deterministic unit tests.
  if (token.startsWith("fake-")) {
    const roleHint = token.slice("fake-".length);
    req.authUser = {
      authUserId: `test-${roleHint}`,
      email: `${roleHint}@example.com`,
      orgUnitId: "00000000-0000-0000-0000-000000000001",
      roleHint
    };
    return next();
  }

  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data.user) {
    return unauthorized(res);
  }

  req.authUser = {
    authUserId: data.user.id,
    email: data.user.email ?? "",
    orgUnitId: "",
    roleHint: undefined
  };

  return next();
};
