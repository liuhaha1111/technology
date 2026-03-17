import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("scripts contract", () => {
  it("verify script includes test and build commands", () => {
    const text = readFileSync(resolve(process.cwd(), "../scripts/verify.ps1"), "utf8");
    expect(text).toMatch(/npm --prefix admin-backend test/);
    expect(text).toMatch(/npm --prefix admin-frontend run build/);
  });
});
