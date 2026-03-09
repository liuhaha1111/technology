import { Router } from "express";
import { z } from "zod";
import { supabaseAnon } from "../lib/supabase";
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

  return res.status(200).json({
    code: "OK",
    message: "Logged in",
    data: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email
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
