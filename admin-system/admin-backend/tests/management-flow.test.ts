import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("Management flow APIs", () => {
  it("issues captcha image payload", async () => {
    const res = await request(app).get("/api/v1/captcha");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("captchaId");
    expect(res.body.data).toHaveProperty("imageData");
  });

  it("submits organization registration with captcha", async () => {
    const captcha = await request(app).get("/api/v1/captcha");
    const code = captcha.body.data.code;

    const res = await request(app).post("/api/v1/public/organizations/register").send({
      account: {
        email: "unit-admin@example.com",
        password: "Password!123"
      },
      organization: {
        name: "Acme Research Unit",
        socialCreditCode: "91320100MA1234567X",
        contactName: "Unit Contact",
        contactPhone: "13800001111",
        provinceCode: "22",
        cityCode: "2201",
        districtCode: "220102",
        address: "No.1 Tech Road"
      },
      captchaId: captcha.body.data.captchaId,
      captchaCode: code
    });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("pending");
  });

  it("allows admin to review organization", async () => {
    const listRes = await request(app)
      .get("/api/v1/admin/organizations?status=pending")
      .set("Authorization", "Bearer fake-super_admin");

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.data.items)).toBe(true);

    const first = listRes.body.data.items[0];
    expect(first).toBeDefined();

    const reviewRes = await request(app)
      .post(`/api/v1/admin/organizations/${first.id}/review`)
      .set("Authorization", "Bearer fake-super_admin")
      .send({ decision: "approved", comment: "ok" });

    expect(reviewRes.status).toBe(200);
    expect(reviewRes.body.data.status).toBe("approved");
  });
  it("rejects re-review after organization already reviewed", async () => {
    const captcha = await request(app).get("/api/v1/captcha");
    const code = captcha.body.data.code;

    const registerRes = await request(app).post("/api/v1/public/organizations/register").send({
      account: {
        email: "unit-rereview@example.com",
        password: "Password!123"
      },
      organization: {
        name: "ReReview Unit",
        socialCreditCode: "91320100MA1234000X",
        contactName: "U1",
        contactPhone: "13800009999",
        provinceCode: "22",
        cityCode: "2201",
        districtCode: "220102",
        address: "Street 1"
      },
      captchaId: captcha.body.data.captchaId,
      captchaCode: code
    });

    expect(registerRes.status).toBe(201);

    const orgId = registerRes.body.data.id;

    const firstReview = await request(app)
      .post(`/api/v1/admin/organizations/${orgId}/review`)
      .set("Authorization", "Bearer fake-super_admin")
      .send({ decision: "approved", comment: "first pass" });
    expect(firstReview.status).toBe(200);

    const secondReview = await request(app)
      .post(`/api/v1/admin/organizations/${orgId}/review`)
      .set("Authorization", "Bearer fake-super_admin")
      .send({ decision: "rejected", comment: "should fail" });

    expect(secondReview.status).toBe(409);
    expect(secondReview.body.code).toBe("INVALID_STATE");
  });
  it("blocks unit login when organization is pending", async () => {
    const registerCaptcha = await request(app).get("/api/v1/captcha");
    const email = "unit-pending-login@example.com";
    const password = "Password!123";

    const registerRes = await request(app).post("/api/v1/public/organizations/register").send({
      account: { email, password },
      organization: {
        name: "Pending Unit",
        socialCreditCode: "91320100MA1234001X",
        contactName: "Contact",
        contactPhone: "13800000001",
        provinceCode: "22",
        cityCode: "2201",
        districtCode: "220102",
        address: "Street 2"
      },
      captchaId: registerCaptcha.body.data.captchaId,
      captchaCode: registerCaptcha.body.data.code
    });
    expect(registerRes.status).toBe(201);

    const loginCaptcha = await request(app).get("/api/v1/captcha");
    const loginRes = await request(app).post("/api/v1/public/auth/unit/login").send({
      email,
      password,
      captchaId: loginCaptcha.body.data.captchaId,
      captchaCode: loginCaptcha.body.data.code
    });

    expect(loginRes.status).toBe(403);
    expect(loginRes.body.code).toBe("ORG_PENDING");
  });

  it("blocks unit login when organization is rejected", async () => {
    const registerCaptcha = await request(app).get("/api/v1/captcha");
    const email = "unit-rejected-login@example.com";
    const password = "Password!123";

    const registerRes = await request(app).post("/api/v1/public/organizations/register").send({
      account: { email, password },
      organization: {
        name: "Rejected Unit",
        socialCreditCode: "91320100MA1234002X",
        contactName: "Contact",
        contactPhone: "13800000002",
        provinceCode: "22",
        cityCode: "2201",
        districtCode: "220102",
        address: "Street 3"
      },
      captchaId: registerCaptcha.body.data.captchaId,
      captchaCode: registerCaptcha.body.data.code
    });
    expect(registerRes.status).toBe(201);

    const reviewRes = await request(app)
      .post(`/api/v1/admin/organizations/${registerRes.body.data.id}/review`)
      .set("Authorization", "Bearer fake-super_admin")
      .send({ decision: "rejected", comment: "missing material" });
    expect(reviewRes.status).toBe(200);

    const loginCaptcha = await request(app).get("/api/v1/captcha");
    const loginRes = await request(app).post("/api/v1/public/auth/unit/login").send({
      email,
      password,
      captchaId: loginCaptcha.body.data.captchaId,
      captchaCode: loginCaptcha.body.data.code
    });

    expect(loginRes.status).toBe(403);
    expect(loginRes.body.code).toBe("ORG_REJECTED");
  });

  it("publishes templates and exposes them to public query", async () => {
    const createRes = await request(app)
      .post("/api/v1/admin/templates")
      .set("Authorization", "Bearer fake-admin")
      .send({
        planCategory: "基础研究",
        projectCategory: "青年基金",
        title: "2026 基础研究申报书",
        sourceName: "省科技专项",
        guideUnit: "省基金办",
        contactPhone: "0431-12345678",
        startAt: "2026-03-01T00:00:00.000Z",
        endAt: "2026-04-01T00:00:00.000Z",
        fileUrl: "https://example.com/template.docx"
      });

    expect(createRes.status).toBe(201);

    const publishRes = await request(app)
      .post(`/api/v1/admin/templates/${createRes.body.data.id}/publish`)
      .set("Authorization", "Bearer fake-admin");

    expect(publishRes.status).toBe(200);
    expect(publishRes.body.data.status).toBe("published");

    const publicRes = await request(app).get("/api/v1/public/templates?planCategory=基础研究");
    expect(publicRes.status).toBe(200);
    expect(publicRes.body.data.items.length).toBeGreaterThan(0);
  });

  it("supports declaration CRUD operations for principal", async () => {
    const createRes = await request(app)
      .post("/api/v1/public/declarations")
      .set("Authorization", "Bearer portal-fake-principal")
      .send({
        templateId: "tpl-001",
        title: "我的申报书",
        content: { summary: "demo" }
      });

    expect(createRes.status).toBe(201);

    const declarationId = createRes.body.data.id;

    const listRes = await request(app)
      .get("/api/v1/public/declarations")
      .set("Authorization", "Bearer portal-fake-principal");
    expect(listRes.status).toBe(200);

    const updateRes = await request(app)
      .put(`/api/v1/public/declarations/${declarationId}`)
      .set("Authorization", "Bearer portal-fake-principal")
      .send({ title: "更新标题" });
    expect(updateRes.status).toBe(200);

    const downloadRes = await request(app)
      .get(`/api/v1/public/declarations/${declarationId}/download`)
      .set("Authorization", "Bearer portal-fake-principal");
    expect(downloadRes.status).toBe(200);

    const deleteRes = await request(app)
      .delete(`/api/v1/public/declarations/${declarationId}`)
      .set("Authorization", "Bearer portal-fake-principal");
    expect(deleteRes.status).toBe(200);
  });
});


