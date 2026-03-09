import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("Business modules APIs", () => {
  it("returns records for declaration module", async () => {
    const res = await request(app)
      .get("/api/v1/modules/declaration/records")
      .set("Authorization", "Bearer fake-analyst");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });

  it("applies project review transition", async () => {
    const res = await request(app)
      .post("/api/v1/projects/p-001/review")
      .set("Authorization", "Bearer fake-analyst")
      .send({ decision: "approved", comments: "looks good" });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("approved");
  });
});
