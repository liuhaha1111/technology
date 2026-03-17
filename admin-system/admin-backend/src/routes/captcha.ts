import { Router } from "express";
import { ServiceError, managementService } from "../services/management-service";
import { isMockModeEnabled } from "../lib/runtime";

export const captchaRouter = Router();

captchaRouter.get("/", async (_req, res) => {
  try {
    const data = await managementService.issueCaptcha(isMockModeEnabled());
    return res.status(200).json({
      code: "OK",
      message: "Captcha issued",
      data,
      requestId: "local"
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        data: null,
        requestId: "local"
      });
    }
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Captcha issue failed",
      data: null,
      requestId: "local"
    });
  }
});
