import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("GET /api/v1/auth/me", () => {
  it("rejects unauthenticated user", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("UNAUTHORIZED");
  });
});
