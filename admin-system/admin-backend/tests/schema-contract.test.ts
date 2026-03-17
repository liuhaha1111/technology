import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("database schema contract", () => {
  it("defines core admin tables", () => {
    const coreSql = readFileSync(resolve(process.cwd(), "../database/supabase/migrations/20260309_0001_core.sql"), "utf8");

    expect(coreSql).toContain("create table if not exists public.org_units");
    expect(coreSql).toContain("create table if not exists public.admin_users");
    expect(coreSql).toContain("create table if not exists public.roles");
    expect(coreSql).toContain("create table if not exists public.permissions");
    expect(coreSql).toContain("create table if not exists public.audit_logs");
  });

  it("defines rls policies for org-scoped data", () => {
    const rlsSql = readFileSync(resolve(process.cwd(), "../database/supabase/migrations/20260309_0002_rls.sql"), "utf8");

    expect(rlsSql).toContain("enable row level security");
    expect(rlsSql).toContain("is_super_admin");
    expect(rlsSql).toContain("same_org");
  });

  it("defines management flow tables", () => {
    const flowSql = readFileSync(
      resolve(process.cwd(), "../database/supabase/migrations/20260309_0003_management_flow.sql"),
      "utf8"
    );

    expect(flowSql).toContain("create table if not exists public.organizations");
    expect(flowSql).toContain("create table if not exists public.principal_profiles");
    expect(flowSql).toContain("create table if not exists public.captchas");
    expect(flowSql).toContain("create table if not exists public.application_templates");
    expect(flowSql).toContain("create table if not exists public.declaration_forms");
    expect(flowSql).toContain("create table if not exists public.region_catalog");
  });
  it("defines org review hardening migration", () => {
    const hardeningSql = readFileSync(
      resolve(process.cwd(), "../database/supabase/migrations/20260312_0004_org_review_hardening.sql"),
      "utf8"
    );

    expect(hardeningSql).toContain("organizations_review_pending_idx");
    expect(hardeningSql).toContain("organizations_review_consistency_chk");
  });
});

