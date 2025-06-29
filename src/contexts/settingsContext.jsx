import { createContext, useMemo } from "react";
import { THEMES } from "@/utils/constants";
import useLocalStorage from "@/hooks/useLocalStorage";

const initialSettings = {
  theme: THEMES.LIGHT,
  activeLayout: "layout1",
  responsiveFontSizes: true,
};

export const SettingsContext = createContext({});

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
