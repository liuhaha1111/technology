import cors from "cors";
import express from "express";
import { adminManagementRouter } from "./routes/admin-management";
import { analyticsRouter } from "./routes/analytics";
import { authRouter } from "./routes/auth";
import { auditsRouter } from "./routes/audits";
import { captchaRouter } from "./routes/captcha";
import { healthRouter } from "./routes/health";
import { modulesRouter } from "./routes/modules";
import { projectsRouter } from "./routes/projects";
import { publicRouter } from "./routes/public";
import { rolesRouter } from "./routes/roles";
import { usersRouter } from "./routes/users";

export const app = express();

const jsonBodyLimit = process.env.ADMIN_BACKEND_JSON_LIMIT ?? "35mb";

app.use(cors());
app.use(express.json({ limit: jsonBodyLimit }));

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/captcha", captchaRouter);
app.use("/api/v1/public", publicRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1", rolesRouter);
app.use("/api/v1/modules", modulesRouter);
app.use("/api/v1/projects", projectsRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/audits", auditsRouter);
app.use("/api/v1/admin", adminManagementRouter);
