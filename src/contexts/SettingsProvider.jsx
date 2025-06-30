import useLocalStorage from "@/hooks/useLocalStorage";
import { THEMES } from "@/utils/constants";
import { useMemo } from "react";
import { SettingsContext } from "./settingsContext";

const initialSettings = {
  theme: THEMES.LIGHT,
  responsiveFontSizes: true,
};

export default function SettingsProvider({ children }) {
  const storage = useLocalStorage("settings", initialSettings);
  const { data: settings, storeData: setStoreSettings } = storage;

  const saveSettings = (updateSettings) => setStoreSettings(updateSettings);

  const contextValue = useMemo(
    () => ({
      settings,
      saveSettings,
    }),
    [settings, saveSettings]
  );
  return <SettingsContext value={contextValue}>{children}</SettingsContext>;
}
