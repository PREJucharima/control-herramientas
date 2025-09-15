import { useFormContext, Controller } from "react-hook-form";
import { TextField, MenuItem } from "@mui/material";

export function SelectField({
  name,
  label,
  options,
  valueKey = "id",
  labelKey = "descripcion",
  loading,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...other}
          select
          fullWidth
          label={label}
          value={field.value || ""}
          error={!!error}
          helperText={error?.message}
          disabled={loading || other.disabled}
        >
          {loading && <MenuItem disabled>Cargando opciones...</MenuItem>}
          {!loading && options?.length === 0 && (
            <MenuItem disabled>No hay opciones</MenuItem>
          )}

          {options?.map((option) => (
            <MenuItem key={option[valueKey]} value={option[valueKey]}>
              {option[labelKey]}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
