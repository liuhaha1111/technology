export type DeclarationPageTab = "fill" | "mine" | "submit" | "print";

export type DeclarationPageView = {
  showPageChrome: boolean;
  showEditor: boolean;
  showMineHint: boolean;
  visibleTab: DeclarationPageTab | null;
};

export const getDeclarationPageView = (
  activeTab: DeclarationPageTab,
  isEditorOpen: boolean
): DeclarationPageView => {
  if (isEditorOpen) {
    return {
      showPageChrome: false,
      showEditor: true,
      showMineHint: false,
      visibleTab: null
    };
  }

  return {
    showPageChrome: true,
    showEditor: false,
    showMineHint: activeTab === "mine",
    visibleTab: activeTab
  };
};
