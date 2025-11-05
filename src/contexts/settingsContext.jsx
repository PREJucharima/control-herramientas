import { createContext } from "react";

import { THEMES } from "@/utils/constants";

export const SettingsContext = createContext({
  settings: { theme: THEMES.LIGHT },
  saveSettings: () => {},
});
