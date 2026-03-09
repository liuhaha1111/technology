import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("RBAC guard", () => {
  it("returns 403 when role lacks permission", async () => {
    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", "Bearer fake-viewer");

    expect(res.status).toBe(403);
    expect(res.body.code).toBe("FORBIDDEN");
  });
});
