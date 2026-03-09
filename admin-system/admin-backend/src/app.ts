import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth";
import { healthRouter } from "./routes/health";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
