import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoginPage } from "../pages/LoginPage";

describe("LoginPage", () => {
  it("shows validation message for empty email", async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: "登录" }));
    expect(await screen.findByText("请输入邮箱")).toBeInTheDocument();
  });
});
