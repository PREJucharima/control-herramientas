import { useState, useContext, useEffect } from "react";

import {
  Box,
  Card,
  Stack,
  Button,
  Switch,
  Divider,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";

import { SettingsContext } from "@/contexts/SettingsContext";
import { FlexBetween } from "@/components/flexbox";
import { FlexBox } from "@/components/flexbox";

const PreferencesPage = () => {
  const { settings, saveSettings } = useContext(SettingsContext);

  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [themeMode, setThemeMode] = useState(settings.theme ?? "system");

  useEffect(() => {
    setThemeMode(settings.theme ?? "system");
  }, [settings.theme]);

  const handleSave = () => {
    saveSettings({ ...settings, theme: themeMode });
    console.log("Guardado:", { themeMode, sidebarCompact });
  };

  const handleCancel = () => {
    setThemeMode(settings.theme ?? "system");
    setSidebarCompact(false);
  };

  const handleThemeChange = (_, v) => {
    if (!v) return;
    setThemeMode(v);

    // saveSettings({ ...settings, theme: v });
  };

  return (
    <Card>
      <Typography variant="body1" fontWeight={500} className="p-3">
        Preferencias de usuario
      </Typography>

      <Divider />

      <Box padding={3}>
        <FlexBox
          spacing={4}
          flexDirection={{ xs: "column", md: "row" }}
          gap={4}
        >
          {/* Tema */}
          <FlexBox
            flexDirection="column"
            flex={1}
            alignItems="flex-start"
            gap={2}
          >
            <Typography variant="body2" fontWeight={600} mb={1}>
              Tema
            </Typography>

            <ToggleButtonGroup
              exclusive
              value={themeMode}
              onChange={handleThemeChange}
              aria-label="Tema"
            >
              <ToggleButton value="light" aria-label="Claro">
                <LightModeIcon fontSize="small" /> Claro
              </ToggleButton>
              <ToggleButton value="dark" aria-label="Oscuro">
                <DarkModeIcon fontSize="small" /> Oscuro
              </ToggleButton>
              <ToggleButton value="system" aria-label="Automático">
                <SettingsBrightnessIcon fontSize="small" /> Automático
              </ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="caption" color="text.secondary">
              Si eliges “Automático”, el tema seguirá la preferencia del sistema
              operativo.
            </Typography>
          </FlexBox>

          <FlexBox
            flexDirection="column"
            flex={1}
            alignItems="flex-start"
            gap={2}
          >
            <Typography variant="body2" fontWeight={600}>
              Sidebar compacto
            </Typography>
            <FlexBetween>
              <Typography variant="caption" color="text.secondary">
                Reduce el ancho del menú lateral; se expande al pasar el cursor.
              </Typography>

              <Switch
                checked={sidebarCompact}
                onChange={(e) => setSidebarCompact(e.target.checked)}
              />
            </FlexBetween>
          </FlexBox>
        </FlexBox>
      </Box>

      <Divider />

      <Stack direction="row" spacing={3} padding={3}>
        <Button variant="contained" onClick={handleSave}>
          Guardar cambios
        </Button>
        <Button variant="outlined" onClick={handleCancel}>
          Cancelar
        </Button>
      </Stack>
    </Card>
  );
};

export default PreferencesPage;
