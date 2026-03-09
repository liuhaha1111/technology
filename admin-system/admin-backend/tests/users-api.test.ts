import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("Users and roles APIs", () => {
  it("lists users with pagination", async () => {
    const res = await request(app)
      .get("/api/v1/users?page=1&size=20")
      .set("Authorization", "Bearer fake-admin");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });

  it("lists roles", async () => {
    const res = await request(app)
      .get("/api/v1/roles")
      .set("Authorization", "Bearer fake-admin");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });

  it("lists permissions", async () => {
    const res = await request(app)
      .get("/api/v1/permissions")
      .set("Authorization", "Bearer fake-admin");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });
});
