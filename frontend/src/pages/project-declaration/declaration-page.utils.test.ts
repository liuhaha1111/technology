import assert from "node:assert/strict";
import test from "node:test";

import { getDeclarationPageView } from "./declaration-page.utils";

test("getDeclarationPageView hides page chrome while editor is open", () => {
  assert.deepEqual(getDeclarationPageView("fill", true), {
    showPageChrome: false,
    showEditor: true,
    showMineHint: false,
    visibleTab: null
  });
});

test("getDeclarationPageView keeps my declarations hint on list mode", () => {
  assert.deepEqual(getDeclarationPageView("mine", false), {
    showPageChrome: true,
    showEditor: false,
    showMineHint: true,
    visibleTab: "mine"
  });
});
