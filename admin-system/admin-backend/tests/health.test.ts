import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("GET /api/v1/health", () => {
  it("returns ok envelope", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      code: "OK",
      message: "healthy",
      data: null
    });
    expect(typeof res.body.requestId).toBe("string");
  });
});
