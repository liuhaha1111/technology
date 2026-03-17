import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AdminLayout } from "../layout/AdminLayout";

describe("Permission visibility", () => {
  it("hides user management menu for viewer role", () => {
    localStorage.setItem("admin_system_role", "viewer");
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    );
    expect(screen.queryByText("用户管理")).not.toBeInTheDocument();
  });
});
