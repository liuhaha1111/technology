import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  const requestId = req.header("x-request-id") ?? "local";
  res.status(200).json({
    code: "OK",
    message: "healthy",
    data: null,
    requestId
  });
});
