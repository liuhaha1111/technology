const TRUTHY_VALUES = new Set(["1", "true", "yes", "on"]);
const FALSY_VALUES = new Set(["0", "false", "no", "off"]);

export const isMockModeEnabled = () => {
  const configured = process.env.ADMIN_BACKEND_MOCK_MODE;
  if (configured !== undefined) {
    const normalized = configured.trim().toLowerCase();
    if (TRUTHY_VALUES.has(normalized)) {
      return process.env.NODE_ENV === "test";
    }
    if (FALSY_VALUES.has(normalized)) {
      return false;
    }
  }

  // Static mock data is only allowed in automated tests.
  return process.env.NODE_ENV === "test";
};
