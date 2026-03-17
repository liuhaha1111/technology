import assert from "node:assert/strict";
import test from "node:test";
import {
  buildDeclarationContent,
  createEmptyDeclarationForm,
  getDeclarationActionFlags,
  parseDeclarationEditorState
} from "./declaration-editor.utils";

test("parseDeclarationEditorState maps legacy compact content into editor sections", () => {
  const form = parseDeclarationEditorState(
    {
      form: {
        projectName: "Laser Imaging",
        keyword: "microscope",
        summary: "legacy summary",
        target: "legacy target",
        contactName: "Alice",
        contactPhone: "13800000000",
        total: "100",
        provinceGrant: "80",
        otherFund: "20"
      }
    },
    {
      id: "tpl-1",
      title: "Template",
      planCategory: "Basic",
      projectCategory: "Youth",
      startAt: "2026-03-01T00:00:00.000Z",
      endAt: "2026-04-01T00:00:00.000Z",
      status: "published"
    }
  );

  assert.equal(form.basicInfo.projectName, "Laser Imaging");
  assert.equal(form.basicInfo.keywords, "microscope");
  assert.equal(form.overview.overview, "legacy summary");
  assert.equal(form.research.target, "legacy target");
  assert.equal(form.unitInfo.contactName, "Alice");
  assert.equal(form.unitInfo.contactPhone, "13800000000");
  assert.equal(form.budget.totalBudget, "100");
  assert.equal(form.budget.provinceGrant, "80");
  assert.equal(form.budget.otherFunding, "20");
});

test("buildDeclarationContent stores meta and template snapshot", () => {
  const form = createEmptyDeclarationForm("0431-12345678", "Youth");
  form.basicInfo.projectName = "Integrated Platform";
  form.unitInfo.contactName = "Bob";

  const content = buildDeclarationContent(
    {
      id: "tpl-2",
      title: "2026 Declaration",
      planCategory: "Basic",
      projectCategory: "Youth",
      guideUnit: "Fund Office",
      contactPhone: "0431-12345678",
      startAt: "2026-03-01T00:00:00.000Z",
      endAt: "2026-04-01T00:00:00.000Z",
      status: "published"
    },
    form,
    3
  );

  assert.equal(content.meta.currentStep, 3);
  assert.equal(content.form.basicInfo.projectName, "Integrated Platform");
  assert.equal(content.templateSnapshot.templateId, "tpl-2");
  assert.equal(content.templateSnapshot.title, "2026 Declaration");
});

test("getDeclarationActionFlags only allows delete for draft declarations", () => {
  assert.deepEqual(getDeclarationActionFlags("draft"), {
    canEdit: true,
    canDelete: true,
    canSubmit: true,
    canViewPdf: false
  });

  assert.deepEqual(getDeclarationActionFlags("submitted"), {
    canEdit: false,
    canDelete: false,
    canSubmit: false,
    canViewPdf: true
  });
});
