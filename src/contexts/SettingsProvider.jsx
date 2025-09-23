import { useMemo, useCallback } from "react";

import useLocalStorage from "@/hooks/useLocalStorage";
import { THEMES } from "@/utils/constants";
import { SettingsContext } from "./SettingsContext";

const initialSettings = {
  theme: THEMES.LIGHT,
};

export default function SettingsProvider({ children }) {
  const [settings, setStoreSettings] = useLocalStorage(
    "settings",
    initialSettings
  );

  const saveSettings = useCallback(
    (update) => {
      setStoreSettings(update);
    },
    [setStoreSettings]
  );

  const contextValue = useMemo(
    () => ({
      settings,
      saveSettings,
    }),
    [settings, saveSettings]
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}
