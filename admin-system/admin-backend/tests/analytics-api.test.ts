import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("Analytics and audit APIs", () => {
  it("returns overview metrics", async () => {
    const res = await request(app)
      .get("/api/v1/analytics/overview")
      .set("Authorization", "Bearer fake-analyst");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("usersTotal");
  });

  it("returns audit events", async () => {
    const res = await request(app)
      .get("/api/v1/audits")
      .set("Authorization", "Bearer fake-analyst");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });
});
