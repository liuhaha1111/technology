import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth";
import { healthRouter } from "./routes/health";
import { modulesRouter } from "./routes/modules";
import { projectsRouter } from "./routes/projects";
import { rolesRouter } from "./routes/roles";
import { usersRouter } from "./routes/users";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1", rolesRouter);
app.use("/api/v1/modules", modulesRouter);
app.use("/api/v1/projects", projectsRouter);
