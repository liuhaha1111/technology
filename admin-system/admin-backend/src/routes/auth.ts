import { Router } from "express";
import { z } from "zod";
import { supabaseAdmin, supabaseAnon } from "../lib/supabase";
import { requireAuth } from "../middleware/auth";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

authRouter.post("/login", async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      message: "Invalid login payload",
      data: parse.error.flatten(),
      requestId: "local"
    });
  }

  const { data, error } = await supabaseAnon.auth.signInWithPassword(parse.data);
  if (error || !data.session || !data.user) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Invalid credentials",
      data: null,
      requestId: "local"
    });
  }

  const { data: adminUser } = await supabaseAdmin
    .from("admin_users")
    .select("id,org_unit_id,email")
    .eq("auth_user_id", data.user.id)
    .maybeSingle();

  if (!adminUser) {
    return res.status(403).json({
      code: "FORBIDDEN",
      message: "Admin profile not registered",
      data: null,
      requestId: "local"
    });
  }

  const { data: roleRows } = await supabaseAdmin
    .from("user_roles")
    .select("roles(key)")
    .eq("user_id", adminUser.id);

  const roleOrder = ["super_admin", "admin", "analyst", "viewer"];
  const roles = (roleRows ?? [])
    .map((row: any) => row.roles?.key as string | undefined)
    .filter((role): role is string => Boolean(role));
  const role = roleOrder.find((item) => roles.includes(item)) ?? "viewer";

  return res.status(200).json({
    code: "OK",
    message: "Logged in",
    data: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: {
        id: data.user.id,
        email: adminUser.email ?? data.user.email,
        role,
        roles,
        orgUnitId: adminUser.org_unit_id
      }
    },
    requestId: "local"
  });
});

authRouter.post("/logout", (_req, res) => {
  return res.status(200).json({
    code: "OK",
    message: "Logged out",
    data: null,
    requestId: "local"
  });
});

authRouter.get("/me", requireAuth, (req, res) => {
  const user = (req as { authUser?: unknown }).authUser;
  return res.status(200).json({
    code: "OK",
    message: "Current user",
    data: user ?? null,
    requestId: "local"
  });
});
