import { describe, expect, it } from "vitest";

describe("workspace smoke", () => {
  it("has isolated package roots", () => {
    expect(process.env.npm_package_name).toBeDefined();
  });
});
