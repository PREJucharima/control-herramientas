import { Controller } from "react-hook-form";
import { Stack, Switch, FormControlLabel, FormHelperText } from "@mui/material";

export default function SwitchController({
  name,
  control,
  label,
  helperText,
  disabled = false,
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Stack>
          <FormControlLabel
            sx={{ ml: 0.5 }}
            control={
              <Switch
                checked={!!field.value}
                onChange={(_, v) => field.onChange(v)}
                disabled={disabled}
              />
            }
            label={label}
          />
          <FormHelperText sx={{ ml: 1.5, mt: 0 }} error={!!fieldState.error}>
            {fieldState.error?.message ?? helperText}
          </FormHelperText>
        </Stack>
      )}
    />
  );
}
